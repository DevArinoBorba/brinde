// Gordinho Brindes — contas de clientes da loja (cadastro, login, perfil, senha)
import crypto from 'node:crypto';
import * as store from './database.js';
import { hashPin, verifyPin, issueSignedToken, readToken } from './auth.js';

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD = 8;

export class CustomerError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const clean = (value, max) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
const normalizeEmail = (email) => clean(email, 160).toLowerCase();

// Dados que o próprio cliente pode ver/editar (nunca o hash da senha)
export const publicCustomer = (c) => c && {
  id: c.id,
  email: c.email,
  name: c.name || '',
  phone: c.phone || '',
  company: c.company || '',
  cnpj: c.cnpj || '',
  createdAt: c.createdAt,
};

function profileFields(input, { requireAll }) {
  const data = {
    name: clean(input.name, 120),
    phone: clean(input.phone, 40),
    company: clean(input.company, 160),
    cnpj: clean(input.cnpj, 20),
  };
  if (requireAll || input.name !== undefined) {
    if (data.name.length < 2) throw new CustomerError(400, 'Informe seu nome.');
  }
  if (requireAll || input.phone !== undefined) {
    if (data.phone.replace(/\D/g, '').length < 10) throw new CustomerError(400, 'Informe um WhatsApp válido com DDD.');
  }
  return data;
}

function checkPassword(password) {
  const value = String(password || '');
  if (value.length < MIN_PASSWORD) throw new CustomerError(400, `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`);
  if (value.length > 128) throw new CustomerError(400, 'Senha longa demais.');
  return value;
}

const session = (customer) => ({ ...issueSignedToken({ aud: 'customer', sub: customer.id }, SESSION_TTL_MS), customer: publicCustomer(customer) });

export async function register(db, input = {}) {
  const email = normalizeEmail(input.email);
  if (!EMAIL_RE.test(email)) throw new CustomerError(400, 'Informe um e-mail válido.');
  const password = checkPassword(input.password);
  if (input.acceptTerms !== true) throw new CustomerError(400, 'É preciso aceitar a Política de Privacidade.');
  const data = { ...profileFields(input, { requireAll: true }), acceptedTermsAt: new Date().toISOString() };

  const customer = await store.insertCustomer(db, {
    id: 'cli_' + crypto.randomBytes(12).toString('base64url'),
    email,
    passwordHash: hashPin(password),
    data,
  });
  if (!customer) throw new CustomerError(409, 'Este e-mail já tem cadastro. Entre com sua senha.');
  return session(customer);
}

export async function login(db, input = {}) {
  const customer = await store.getCustomerByEmail(db, normalizeEmail(input.email));
  // Mesma mensagem para e-mail inexistente e senha errada (não revela quem tem conta)
  if (!customer || !verifyPin(String(input.password || ''), customer.passwordHash)) {
    throw new CustomerError(401, 'E-mail ou senha incorretos.');
  }
  return session(customer);
}

export async function updateProfile(db, customerId, input = {}) {
  const data = profileFields(input, { requireAll: false });
  for (const key of Object.keys(data)) if (input[key] === undefined) delete data[key];
  return publicCustomer(await store.updateCustomerData(db, customerId, data));
}

export async function changePassword(db, customer, { currentPassword, newPassword } = {}) {
  if (!verifyPin(String(currentPassword || ''), customer.passwordHash)) {
    throw new CustomerError(400, 'Senha atual incorreta.');
  }
  await store.setCustomerPassword(db, customer.id, hashPin(checkPassword(newPassword)));
  return session(await store.getCustomerById(db, customer.id)); // sessões anteriores deixam de valer
}

/** Redefinição pelo painel (cliente esqueceu a senha): gera uma senha temporária. */
export async function resetPasswordByAdmin(db, customerId) {
  const customer = await store.getCustomerById(db, customerId);
  if (!customer) throw new CustomerError(404, 'Cliente não encontrado.');
  const temporary = crypto.randomBytes(6).toString('base64url');
  await store.setCustomerPassword(db, customerId, hashPin(temporary));
  return { temporaryPassword: temporary };
}

/** Lê o cliente do token (ou null). Tokens emitidos antes da última troca de senha não valem. */
export async function customerFromRequest(db, req) {
  const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const data = readToken(token);
  if (!data || data.aud !== 'customer' || !data.sub) return null;
  const customer = await store.getCustomerById(db, data.sub);
  if (!customer || data.iat < new Date(customer.passwordChangedAt).getTime() - 1000) return null;
  return customer;
}

export function requireCustomer(db) {
  return async (req, res, next) => {
    try {
      const customer = await customerFromRequest(db, req);
      if (!customer) return res.status(401).json({ error: 'Sua sessão expirou. Entre novamente.' });
      req.customer = customer;
      next();
    } catch (err) {
      next(err);
    }
  };
}
