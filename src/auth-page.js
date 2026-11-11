// Gordinho Brindes — página /auth: Entrar, Cadastrar e Minha conta (clientes da loja)
import { db } from './db.js';
import { whatsappUrl, escapeHtml, formatBRL } from './store-sync.js';

const $ = (sel, root = document) => root.querySelector(sel);
const params = new URLSearchParams(window.location.search);
// Para onde voltar depois de entrar (só caminhos internos)
const nextPath = /^\/(?!\/)/.test(params.get('next') || '') ? params.get('next') : null;

function setTabs(root, active) {
  root.querySelectorAll('.auth-tab').forEach((tab) => {
    const on = tab.dataset.tab === active;
    tab.classList.toggle('is-active', on);
    tab.setAttribute('aria-selected', String(on));
  });
  root.querySelectorAll('[data-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.panel !== active;
  });
}

function showMessage(form, kind, message) {
  const error = $('.auth-error', form);
  const success = $('.auth-success', form);
  if (error) error.hidden = kind !== 'error';
  if (success) success.hidden = kind !== 'success';
  const target = kind === 'error' ? error : success;
  if (target && message) target.textContent = message;
}

async function submitWith(form, action) {
  const button = $('button[type="submit"]', form);
  button.disabled = true;
  showMessage(form, null);
  try {
    await action(Object.fromEntries(new FormData(form)));
  } catch (err) {
    showMessage(form, 'error', err.message || 'Não foi possível concluir. Tente novamente.');
  } finally {
    button.disabled = false;
  }
}

// ------------------------------------------------------------------
// Visitante: Entrar / Cadastrar
// ------------------------------------------------------------------
function setupGuest() {
  const guest = $('#auth-guest');
  guest.querySelectorAll('.auth-tab').forEach((tab) => tab.addEventListener('click', () => setTabs(guest, tab.dataset.tab)));
  if (params.get('tab') === 'cadastrar') setTabs(guest, 'register');

  $('.auth-toggle-password').addEventListener('click', (e) => {
    const input = e.currentTarget.previousElementSibling;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    e.currentTarget.textContent = show ? 'Ocultar' : 'Mostrar';
    e.currentTarget.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  });

  // Sem envio de e-mail: a redefinição é feita pela equipe (senha temporária pelo painel)
  $('#forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    const email = $('#login-form input[name="email"]').value.trim();
    const message = `Olá! Esqueci a senha da minha conta no site${email ? ` (e-mail: ${email})` : ''}. Podem me ajudar a redefinir?`;
    window.open(whatsappUrl(message), '_blank', 'noopener');
  });

  $('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submitWith(e.currentTarget, async ({ email, password }) => {
      if (!email || !password) throw new Error('Informe e-mail e senha.');
      await db.loginCustomer(email, password);
      afterLogin();
    });
  });

  $('#register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    submitWith(form, async (data) => {
      if (data.password !== data.passwordConfirm) throw new Error('As senhas não conferem.');
      await db.registerCustomer({
        name: data.name,
        phone: data.phone,
        email: data.email,
        company: data.company,
        cnpj: data.cnpj,
        password: data.password,
        acceptTerms: form.elements.acceptTerms.checked,
      });
      afterLogin();
    });
  });
}

function afterLogin() {
  if (nextPath) {
    window.location.href = nextPath;
    return;
  }
  render();
}

// ------------------------------------------------------------------
// Cliente logado: Minha conta
// ------------------------------------------------------------------
function setupAccount() {
  const account = $('#auth-account');
  account.querySelectorAll('.auth-tab').forEach((tab) => tab.addEventListener('click', () => setTabs(account, tab.dataset.tab)));

  $('#logout-button').addEventListener('click', () => {
    db.logoutCustomer();
    render();
  });

  $('#profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    submitWith(form, async (data) => {
      await db.updateCustomerAccount({ name: data.name, phone: data.phone, company: data.company, cnpj: data.cnpj });
      fillAccount();
      showMessage(form, 'success');
    });
  });

  $('#password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    submitWith(form, async (data) => {
      if (data.newPassword !== data.newPasswordConfirm) throw new Error('As senhas novas não conferem.');
      await db.changeCustomerPassword(data.currentPassword, data.newPassword);
      form.reset();
      showMessage(form, 'success');
    });
  });
}

function fillAccount() {
  const customer = db.getCustomerAccount();
  if (!customer) return;
  document.querySelectorAll('[data-customer-first-name]').forEach((el) => (el.textContent = customer.name.split(/\s+/)[0] || ''));
  document.querySelectorAll('[data-customer-email]').forEach((el) => (el.textContent = customer.email));
  const form = $('#profile-form');
  for (const key of ['name', 'phone', 'email', 'company', 'cnpj']) form.elements[key].value = customer[key] || '';
}

async function loadOrders() {
  const container = $('#account-orders');
  try {
    const orders = await db.getCustomerOrders();
    if (!orders.length) {
      container.innerHTML = '<p class="account-empty">Você ainda não enviou orçamentos. Escolha os brindes na loja e envie pelo WhatsApp.</p>';
      return;
    }
    container.innerHTML = orders.map((o) => `
      <article class="account-order">
        <div class="account-order-head">
          <span class="account-order-id">#${escapeHtml(o.id)}</span>
          <span class="account-order-status" data-status="${escapeHtml(o.status)}">${escapeHtml(o.status)}</span>
        </div>
        <div class="account-order-meta">${escapeHtml(o.date)} · ${o.hasPriceOnRequest && !(o.total > 0) ? 'Valor sob consulta' : escapeHtml(formatBRL(o.total))}</div>
        <ul class="account-order-items">
          ${(o.items || []).map((it) => `<li>${escapeHtml(it.quantity)}x ${escapeHtml(it.name)}${it.color ? ` · ${escapeHtml(it.color)}` : ''}</li>`).join('')}
        </ul>
      </article>`).join('');
  } catch (err) {
    container.innerHTML = `<p class="account-empty">${escapeHtml(err.message)}</p>`;
  }
}

// ------------------------------------------------------------------
function render() {
  const loggedIn = db.isCustomerLoggedIn();
  $('#auth-guest').hidden = loggedIn;
  $('#auth-account').hidden = !loggedIn;
  document.title = `${loggedIn ? 'Minha conta' : 'Entrar ou Cadastrar'} | ${db.getSettings().storeName}`;
  if (loggedIn) {
    fillAccount();
    setTabs($('#auth-account'), 'orders');
    loadOrders();
    db.refreshCustomerAccount().then(fillAccount).catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await db.ready;
  const settings = db.getSettings();
  document.querySelectorAll('[data-store-name]').forEach((el) => (el.textContent = settings.storeName));
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
  setupGuest();
  setupAccount();
  // Sessão expirada no meio do uso volta para a tela de login
  db.subscribe(({ key }) => {
    if (key.includes('customer_session') && !db.isCustomerLoggedIn() && !$('#auth-account').hidden) render();
  });
  render();
});
