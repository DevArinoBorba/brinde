// Gordinho Brindes — camada de dados do servidor (PostgreSQL)
// Em produção usa DATABASE_URL (Postgres do Coolify). Sem DATABASE_URL, cai para o PGlite
// (Postgres embutido, só para desenvolvimento local — dependência de dev).
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from '../src/seed-data.js';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS products (
    id         TEXT PRIMARY KEY,
    position   INTEGER NOT NULL DEFAULT 0,
    data       JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS categories (
    id       TEXT PRIMARY KEY,
    position INTEGER NOT NULL DEFAULT 0,
    data     JSONB NOT NULL
  );
  CREATE TABLE IF NOT EXISTS orders (
    id         TEXT PRIMARY KEY,
    data       JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
  CREATE INDEX IF NOT EXISTS orders_phone_idx ON orders ((regexp_replace(data->'customer'->>'phone', '\\D', '', 'g')));
  CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    data       JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS admin_credentials (
    id         INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    pin_hash   TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

async function connect() {
  if (process.env.DATABASE_URL) {
    const { default: pg } = await import('pg');
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
    return {
      query: (text, params) => pool.query(text, params),
      transaction: async (fn) => {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          const result = await fn({ query: (t, p) => client.query(t, p) });
          await client.query('COMMIT');
          return result;
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release();
        }
      },
      exec: (sql) => pool.query(sql),
      kind: 'postgres',
    };
  }

  const { PGlite } = await import('@electric-sql/pglite');
  const { mkdirSync } = await import('node:fs');
  const dataDir = process.env.PGLITE_DIR || './.data/pglite';
  mkdirSync(dataDir, { recursive: true });
  const lite = new PGlite(dataDir);
  return {
    query: (text, params) => lite.query(text, params),
    transaction: (fn) => lite.transaction((tx) => fn({ query: (t, p) => tx.query(t, p) })),
    exec: (sql) => lite.exec(sql),
    kind: `pglite (${dataDir})`,
  };
}

export async function openDatabase() {
  const db = await connect();
  await db.exec(SCHEMA);
  await seed(db);
  return db;
}

// Popula catálogo e configurações apenas na primeira execução (tabelas vazias)
async function seed(db) {
  const { rows: [{ count: productCount }] } = await db.query('SELECT count(*)::int AS count FROM products');
  if (productCount === 0) {
    await db.transaction(async (tx) => {
      for (const [i, product] of DEFAULT_PRODUCTS.entries()) {
        await tx.query('INSERT INTO products (id, position, data) VALUES ($1, $2, $3)', [product.id, i, product]);
      }
    });
    console.log(`[db] ${DEFAULT_PRODUCTS.length} produtos iniciais inseridos`);
  }

  const { rows: [{ count: categoryCount }] } = await db.query('SELECT count(*)::int AS count FROM categories');
  if (categoryCount === 0) {
    await db.transaction(async (tx) => {
      for (const [i, category] of DEFAULT_CATEGORIES.entries()) {
        await tx.query('INSERT INTO categories (id, position, data) VALUES ($1, $2, $3)', [category.id, i, category]);
      }
    });
    console.log(`[db] ${DEFAULT_CATEGORIES.length} categorias iniciais inseridas`);
  }

  await db.query(
    `INSERT INTO settings (key, data) VALUES ('store', $1) ON CONFLICT (key) DO NOTHING`,
    [DEFAULT_SETTINGS],
  );
}

// ------------------------------------------------------------------
// Consultas
// ------------------------------------------------------------------
export async function getSettings(db) {
  const { rows } = await db.query(`SELECT data FROM settings WHERE key = 'store'`);
  // Mescla com os padrões para que chaves novas apareçam sem migração manual
  return { ...DEFAULT_SETTINGS, ...(rows[0]?.data || {}) };
}

export async function saveSettings(db, patch) {
  const current = await getSettings(db);
  const updated = { ...current, ...patch };
  await db.query(
    `INSERT INTO settings (key, data, updated_at) VALUES ('store', $1, now())
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [updated],
  );
  return updated;
}

export async function listProducts(db) {
  const { rows } = await db.query('SELECT data FROM products ORDER BY position, id');
  return rows.map((r) => r.data);
}

export async function getProductsByIds(db, ids) {
  if (!ids.length) return new Map();
  const { rows } = await db.query('SELECT id, data FROM products WHERE id = ANY($1)', [ids]);
  return new Map(rows.map((r) => [r.id, r.data]));
}

export async function upsertProduct(db, product) {
  // Produto novo entra no topo da lista (mesmo comportamento do admin)
  await db.query(
    `INSERT INTO products (id, position, data, updated_at)
     VALUES ($1, (SELECT coalesce(min(position), 0) - 1 FROM products), $2, now())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [product.id, product],
  );
  return product;
}

export async function deleteProduct(db, id) {
  const { rowCount } = await db.query('DELETE FROM products WHERE id = $1', [id]);
  return rowCount > 0;
}

export async function listCategories(db) {
  const { rows } = await db.query('SELECT data FROM categories ORDER BY position, id');
  return rows.map((r) => r.data);
}

// Renomear categoria também atualiza os produtos que a usam
export async function upsertCategory(db, category) {
  return db.transaction(async (tx) => {
    const { rows } = await tx.query('SELECT data FROM categories WHERE id = $1', [category.id]);
    const oldName = rows[0]?.data?.name;
    await tx.query(
      `INSERT INTO categories (id, position, data)
       VALUES ($1, (SELECT coalesce(max(position), -1) + 1 FROM categories), $2)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [category.id, category],
    );
    if (oldName && oldName !== category.name) {
      await tx.query(
        `UPDATE products SET data = jsonb_set(data, '{category}', to_jsonb($2::text)), updated_at = now()
         WHERE data->>'category' = $1`,
        [oldName, category.name],
      );
    }
    return category;
  });
}

export async function deleteCategory(db, id) {
  const { rowCount } = await db.query('DELETE FROM categories WHERE id = $1', [id]);
  return rowCount > 0;
}

export async function listOrders(db) {
  const { rows } = await db.query('SELECT data FROM orders ORDER BY created_at DESC');
  return rows.map((r) => r.data);
}

export async function getOrder(db, id) {
  const { rows } = await db.query('SELECT data FROM orders WHERE id = $1', [id]);
  return rows[0]?.data || null;
}

export async function insertOrder(db, order) {
  await db.query('INSERT INTO orders (id, data, created_at) VALUES ($1, $2, $3)', [order.id, order, order.createdAt]);
  return order;
}

export async function updateOrder(db, id, patch) {
  const current = await getOrder(db, id);
  if (!current) return null;
  const updated = { ...current, ...patch, id, updatedAt: new Date().toISOString() };
  await db.query('UPDATE orders SET data = $2, updated_at = now() WHERE id = $1', [id, updated]);
  return updated;
}

export async function deleteOrder(db, id) {
  const { rowCount } = await db.query('DELETE FROM orders WHERE id = $1', [id]);
  return rowCount > 0;
}

// Rastreio público: número exato do pedido ou WhatsApp completo (10+ dígitos)
export async function findOrdersForTracking(db, query) {
  const q = String(query || '').trim().toUpperCase().replace(/^#/, '');
  const digits = q.replace(/\D/g, '');
  const { rows } = await db.query(
    `SELECT data FROM orders
     WHERE upper(id) = $1
        OR ($2 <> '' AND regexp_replace(data->'customer'->>'phone', '\\D', '', 'g') IN ($2, '55' || $2))
     ORDER BY created_at DESC LIMIT 10`,
    [q, digits.length >= 10 ? digits : ''],
  );
  return rows.map((r) => r.data);
}

export async function getPinHash(db) {
  const { rows } = await db.query('SELECT pin_hash, updated_at FROM admin_credentials WHERE id = 1');
  return rows[0] || null;
}

export async function setPinHash(db, pinHash) {
  await db.query(
    `INSERT INTO admin_credentials (id, pin_hash, updated_at) VALUES (1, $1, now())
     ON CONFLICT (id) DO UPDATE SET pin_hash = EXCLUDED.pin_hash, updated_at = now()`,
    [pinHash],
  );
}
