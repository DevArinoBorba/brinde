// Gordinho Brindes — autenticação do painel (PIN com hash scrypt + token assinado HMAC)
import crypto from 'node:crypto';
import { getPinHash, setPinHash } from './database.js';

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas

const secret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
if (!process.env.SESSION_SECRET) {
  console.warn('[auth] SESSION_SECRET não definido: sessões do painel serão invalidadas a cada reinício.');
}

export function hashPin(pin) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(pin), salt, 32);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

function verifyPin(pin, stored) {
  const [scheme, saltHex, hashHex] = String(stored || '').split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(String(pin), Buffer.from(saltHex, 'hex'), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

const sign = (payload) => crypto.createHmac('sha256', secret).update(payload).digest('base64url');

function issueToken() {
  const payload = Buffer.from(JSON.stringify({ iat: Date.now(), exp: Date.now() + TOKEN_TTL_MS })).toString('base64url');
  return { token: `${payload}.${sign(payload)}`, expiresAt: Date.now() + TOKEN_TTL_MS };
}

function readToken(token) {
  const [payload, signature] = String(token || '').split('.');
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

// Cria a credencial na primeira execução a partir de ADMIN_PIN
export async function ensureAdminCredential(db) {
  if (await getPinHash(db)) return;
  const pin = process.env.ADMIN_PIN;
  if (!pin || String(pin).length < 4) {
    throw new Error('Defina ADMIN_PIN (mínimo 4 caracteres) para criar o acesso inicial ao painel.');
  }
  await setPinHash(db, hashPin(pin));
  console.log('[auth] Credencial do painel criada a partir de ADMIN_PIN.');
}

export async function login(db, pin) {
  const credential = await getPinHash(db);
  if (!credential || !verifyPin(pin, credential.pin_hash)) return null;
  return issueToken();
}

export async function changePin(db, newPin) {
  await setPinHash(db, hashPin(newPin));
  return issueToken(); // sessões anteriores à troca deixam de valer
}

// Middleware: exige token válido emitido depois da última troca de PIN
export function requireAdmin(db) {
  return async (req, res, next) => {
    try {
      const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
      const data = readToken(token);
      const credential = data && (await getPinHash(db));
      if (!data || !credential || data.iat < new Date(credential.updated_at).getTime() - 1000) {
        return res.status(401).json({ error: 'Sessão expirada. Entre novamente no painel.' });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
