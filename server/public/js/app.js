

const API = '/api';

// ── Token helpers ──
const getToken = () => localStorage.getItem('token');
const setToken = (t) => localStorage.setItem('token', t);
const removeToken = () => localStorage.removeItem('token');

// ── Auth guard ──
const requireAuth = () => {
  if (!getToken() && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup') 
      && !location.pathname.startsWith('/forgot') && !location.pathname.startsWith('/reset')) {
    location.href = '/login';
  }
};

// ── Fetch wrapper ──
const apiFetch = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (getToken()) headers['Authorization'] = `Bearer ${getToken()}`;
  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur serveur');
  return data;
};

// ── Toast ──
const showToast = (msg, type = 'success') => {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
};

// ── Alert ──
const showAlert = (id, msg, type = 'error') => {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> ${msg}`;
  el.style.display = 'flex';
};

// ── Modal helpers ──
const openModal = (id) => {
  document.getElementById(id).style.display = 'flex';
};
const closeModal = (id) => {
  document.getElementById(id).style.display = 'none';
};

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
  }
});

// ── Format helpers ──
const formatCurrency = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0);

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR');
};

const statusLabel = (s) => {
  const map = { paid: ['Payée', 'paid'], unpaid: ['Impayée', 'unpaid'], overdue: ['En retard', 'overdue'], pending: ['Partielle', 'pending'] };
  const [label, cls] = map[s] || [s, 'unpaid'];
  return `<span class="status-badge status-${cls}">${label}</span>`;
};

const outcomeLabel = (s) => {
  const map = { pending: 'En attente', successful: 'Réussie', failed: 'Échouée', rescheduled: 'Reportée' };
  return `<span class="outcome-badge outcome-${s}">${map[s] || s}</span>`;
};

const typeLabel = (t) => {
  const map = { call: '📞 Appel', email: '📧 Email', meeting: '🤝 Réunion' };
  return `<span class="type-badge">${map[t] || t}</span>`;
};


//  AUTH FORMS


// --- Login ---
let loginMode = 'email';

const switchTab = (mode) => {
  loginMode = mode;
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (mode === 'email' && i === 0) || (mode === 'phone' && i === 1));
  });
  document.getElementById('emailField').style.display = mode === 'email' ? 'block' : 'none';
  document.getElementById('phoneField').style.display = mode === 'phone' ? 'block' : 'none';
};

const togglePassword = () => {
  const input = document.querySelector('#loginForm [type="password"]');
  const icon = document.getElementById('eyeIcon');
  if (!input) return;
  if (input.type === 'password') { input.type = 'text'; icon.className = 'fas fa-eye-slash'; }
  else { input.type = 'password'; icon.className = 'fas fa-eye'; }
};

const handleLogin = async (e) => {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-loader').style.display = 'block';

  try {
    const body = loginMode === 'email'
      ? { email: document.getElementById('email').value, password: document.getElementById('password').value }
      : { phone_number: document.getElementById('phone').value, password: document.getElementById('password').value };

    const endpoint = loginMode === 'email' ? '/user/loginByEmail' : '/user/loginByPhoneNumber';
    const data = await apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) });
    setToken(data.token);
    location.href = '/dashboard';
  } catch (err) {
    showAlert('alertMsg', err.message);
    btn.querySelector('.btn-text').style.display = 'block';
    btn.querySelector('.btn-loader').style.display = 'none';
  }
};

// --- Forgot password ---
const handleForgot = async (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-loader').style.display = 'block';

  try {
    await apiFetch('/user/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: document.getElementById('email').value })
    });
    document.getElementById('forgotForm').style.display = 'none';
    document.getElementById('successMsg').style.display = 'flex';
  } catch (err) {
    showAlert('alertMsg', err.message);
    btn.querySelector('.btn-text').style.display = 'block';
    btn.querySelector('.btn-loader').style.display = 'none';
  }
};

// --- Reset password ---
const handleReset = async (e) => {
  e.preventDefault();
  const pass = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;
  if (pass !== confirm) return showAlert('alertMsg', 'Les mots de passe ne correspondent pas');

  const btn = document.getElementById('submitBtn');
  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-loader').style.display = 'block';

  try {
    const token = document.getElementById('resetToken').value || new URLSearchParams(location.search).get('token');
    await apiFetch('/user/reset-password', { method: 'POST', body: JSON.stringify({ token, password: pass }) });
    showAlert('alertMsg', 'Mot de passe réinitialisé ! Redirection...', 'success');
    setTimeout(() => location.href = '/login', 2000);
  } catch (err) {
    showAlert('alertMsg', err.message);
    btn.querySelector('.btn-text').style.display = 'block';
    btn.querySelector('.btn-loader').style.display = 'none';
  }
};


//  DASHBOARD


const loadDashboard = async () => {
  try {
    const [stats, overdue, actions] = await Promise.all([
      apiFetch('/invoice/stats'),
      apiFetch('/invoice/overdue'),
      apiFetch('/recovery/upcoming')
    ]);

    document.getElementById('statTotal').textContent   = stats.total;
    document.getElementById('statPaid').textContent    = stats.paid;
    document.getElementById('statOverdue').textContent = stats.overdue;
    document.getElementById('statPending').textContent = stats.pending;
    document.getElementById('totalAmount').textContent = formatCurrency(stats.totalAmount);
    document.getElementById('totalPaid').textContent   = formatCurrency(stats.totalPaid);
    document.getElementById('totalDue').textContent    = formatCurrency(stats.totalDue);

    // Recent actions
    const actEl = document.getElementById('recentActions');
    if (actions.length === 0) {
      actEl.innerHTML = `<div class="empty-state"><i class="fas fa-tasks"></i><p>Aucune action à venir</p></div>`;
    } else {
      actEl.innerHTML = `<div class="action-list">${actions.slice(0,5).map(a => `
        <div class="action-item">
          <div class="action-type-icon"><i class="fas fa-${a.type === 'call' ? 'phone' : a.type === 'email' ? 'envelope' : 'handshake'}"></i></div>
          <div class="action-info">
            <div class="action-inv">${a.invoice?.number || '—'}</div>
            <div class="action-desc">${a.description}</div>
          </div>
          ${outcomeLabel(a.outcome)}
        </div>
      `).join('')}</div>`;
    }

    // Overdue
    const ovEl = document.getElementById('overdueList');
    if (overdue.length === 0) {
      ovEl.innerHTML = `<div class="empty-state"><i class="fas fa-check-circle"></i><p>Aucune facture en retard</p></div>`;
    } else {
      ovEl.innerHTML = overdue.slice(0,5).map(inv => `
        <div class="overdue-item">
          <div>
            <div class="overdue-client">${inv.client?.company || inv.client?.name}</div>
            <div class="overdue-num">${inv.number} — échéance ${formatDate(inv.dueDate)}</div>
          </div>
          <div class="overdue-amount">${formatCurrency(inv.amount - inv.paidAmount)}</div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error(err);
    showToast(err.message, 'error');
  }
};


//  CLIENTS


let clientsData = [];

const loadClients = async () => {
  try {
    clientsData = await apiFetch('/client/getAll');
    renderClients(clientsData);
  } catch (err) { showToast(err.message, 'error'); }
};

const renderClients = (list) => {
  const tbody = document.getElementById('clientsTable');
  if (!tbody) return;
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-users"></i><p>Aucun client trouvé</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.company}</td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td><code>${c.siret}</code></td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon btn-icon-blue" onclick="editClient('${c._id}')" title="Modifier"><i class="fas fa-edit"></i></button>
          <button class="btn-icon btn-icon-red" onclick="deleteClient('${c._id}')" title="Supprimer"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
};

const filterClients = () => {
  const q = document.getElementById('clientSearch')?.value.toLowerCase();
  renderClients(clientsData.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.company.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q)
  ));
};

const editClient = (id) => {
  const c = clientsData.find(x => x._id === id);
  if (!c) return;
  document.getElementById('clientId').value      = c._id;
  document.getElementById('clientName').value    = c.name;
  document.getElementById('clientCompany').value = c.company;
  document.getElementById('clientEmail').value   = c.email;
  document.getElementById('clientPhone').value   = c.phone;
  document.getElementById('clientSiret').value   = c.siret;
  document.getElementById('clientAddress').value = c.address;
  document.getElementById('modalTitle').textContent = 'Modifier le client';
  openModal('clientModal');
};

const saveClient = async (e) => {
  e.preventDefault();
  const id = document.getElementById('clientId').value;
  const body = {
    name: document.getElementById('clientName').value,
    company: document.getElementById('clientCompany').value,
    email: document.getElementById('clientEmail').value,
    phone: document.getElementById('clientPhone').value,
    siret: document.getElementById('clientSiret').value,
    address: document.getElementById('clientAddress').value
  };
  try {
    if (id) await apiFetch(`/client/update/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    else     await apiFetch('/client/create', { method: 'POST', body: JSON.stringify(body) });
    closeModal('clientModal');
    document.getElementById('clientForm').reset();
    document.getElementById('clientId').value = '';
    document.getElementById('modalTitle').textContent = 'Nouveau client';
    showToast(id ? 'Client modifié' : 'Client créé');
    loadClients();
  } catch (err) { showToast(err.message, 'error'); }
};

const deleteClient = async (id) => {
  if (!confirm('Supprimer ce client ?')) return;
  try {
    await apiFetch(`/client/delete/${id}`, { method: 'DELETE' });
    showToast('Client supprimé');
    loadClients();
  } catch (err) { showToast(err.message, 'error'); }
};


//  INVOICES


let invoicesData = [];
let invoiceFilter = 'all';

const loadInvoices = async () => {
  try {
    invoicesData = await apiFetch('/invoice/getAll');
    renderInvoices();
    loadClientsForSelect('invoiceClient');
  } catch (err) { showToast(err.message, 'error'); }
};

const filterByStatus = (status, btn) => {
  invoiceFilter = status;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderInvoices();
};

const renderInvoices = () => {
  const tbody = document.getElementById('invoicesTable');
  if (!tbody) return;
  const list = invoiceFilter === 'all' ? invoicesData : invoicesData.filter(i => i.status === invoiceFilter);
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-file-invoice-dollar"></i><p>Aucune facture trouvée</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(inv => `
    <tr>
      <td><strong>${inv.number}</strong></td>
      <td>${inv.client?.company || inv.client?.name || '—'}</td>
      <td>${formatCurrency(inv.amount)}</td>
      <td>${formatCurrency(inv.paidAmount)}</td>
      <td>${formatDate(inv.dueDate)}</td>
      <td>${statusLabel(inv.status)}</td>
      <td>
        <div class="actions-cell">
          ${inv.status !== 'paid' ? `<button class="btn-icon btn-icon-green" onclick="openPayment('${inv._id}','${inv.number}',${inv.amount},${inv.paidAmount})" title="Paiement"><i class="fas fa-coins"></i></button>` : ''}
          <button class="btn-icon btn-icon-blue" onclick="editInvoice('${inv._id}')" title="Modifier"><i class="fas fa-edit"></i></button>
          <button class="btn-icon btn-icon-red" onclick="deleteInvoice('${inv._id}')" title="Supprimer"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
};

const editInvoice = (id) => {
  const inv = invoicesData.find(x => x._id === id);
  if (!inv) return;
  document.getElementById('invoiceId').value          = inv._id;
  document.getElementById('invoiceNumber').value      = inv.number;
  document.getElementById('invoiceClient').value      = inv.client?._id || '';
  document.getElementById('invoiceAmount').value      = inv.amount;
  document.getElementById('invoiceDueDate').value     = inv.dueDate?.substring(0, 10);
  document.getElementById('invoiceDescription').value = inv.description || '';
  document.getElementById('invoiceModalTitle').textContent = 'Modifier la facture';
  openModal('invoiceModal');
};

const saveInvoice = async (e) => {
  e.preventDefault();
  const id = document.getElementById('invoiceId').value;
  const body = {
    number: document.getElementById('invoiceNumber').value,
    clientId: document.getElementById('invoiceClient').value,
    amount: parseFloat(document.getElementById('invoiceAmount').value),
    dueDate: document.getElementById('invoiceDueDate').value,
    description: document.getElementById('invoiceDescription').value
  };
  try {
    if (id) await apiFetch(`/invoice/update/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    else     await apiFetch('/invoice/create', { method: 'POST', body: JSON.stringify(body) });
    closeModal('invoiceModal');
    document.getElementById('invoiceForm').reset();
    document.getElementById('invoiceId').value = '';
    showToast(id ? 'Facture modifiée' : 'Facture créée');
    loadInvoices();
  } catch (err) { showToast(err.message, 'error'); }
};

const deleteInvoice = async (id) => {
  if (!confirm('Supprimer cette facture ?')) return;
  try {
    await apiFetch(`/invoice/delete/${id}`, { method: 'DELETE' });
    showToast('Facture supprimée');
    loadInvoices();
  } catch (err) { showToast(err.message, 'error'); }
};

const openPayment = (id, number, amount, paid) => {
  document.getElementById('paymentInvoiceId').value = id;
  document.getElementById('paymentInfo').textContent = `Facture ${number} — Reste à payer: ${formatCurrency(amount - paid)}`;
  openModal('paymentModal');
};

const registerPayment = async (e) => {
  e.preventDefault();
  const id = document.getElementById('paymentInvoiceId').value;
  const amount = parseFloat(document.getElementById('paymentAmount').value);
  try {
    await apiFetch(`/invoice/payment/${id}`, { method: 'POST', body: JSON.stringify({ amount }) });
    closeModal('paymentModal');
    document.getElementById('paymentForm').reset();
    showToast('Paiement enregistré');
    loadInvoices();
  } catch (err) { showToast(err.message, 'error'); }
};

// ═══════════════════════════════
//  RECOVERY
// ═══════════════════════════════

let recoveryData = [];

const loadRecovery = async () => {
  try {
    const [actions, stats] = await Promise.all([
      apiFetch('/recovery/getAll'),
      apiFetch('/recovery/stats')
    ]);
    recoveryData = actions;
    renderRecovery();

    document.getElementById('rTotal').textContent      = stats.total;
    document.getElementById('rPending').textContent    = stats.byOutcome.pending;
    document.getElementById('rSuccessful').textContent = stats.byOutcome.successful;
    document.getElementById('rFailed').textContent     = stats.byOutcome.failed;

    loadInvoicesForSelect('actionInvoice');
  } catch (err) { showToast(err.message, 'error'); }
};

const renderRecovery = () => {
  const tbody = document.getElementById('recoveryTable');
  if (!tbody) return;
  if (recoveryData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-tasks"></i><p>Aucune action de recouvrement</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = recoveryData.map(a => `
    <tr>
      <td>${formatDate(a.date)}</td>
      <td><strong>${a.invoice?.number || '—'}</strong></td>
      <td>${typeLabel(a.type)}</td>
      <td>${a.description}</td>
      <td>${outcomeLabel(a.outcome)}</td>
      <td>${a.nextAction ? formatDate(a.nextAction) : '—'}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon btn-icon-blue" onclick="editAction('${a._id}')" title="Modifier"><i class="fas fa-edit"></i></button>
          <button class="btn-icon btn-icon-red" onclick="deleteAction('${a._id}')" title="Supprimer"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
};

const editAction = (id) => {
  const a = recoveryData.find(x => x._id === id);
  if (!a) return;
  document.getElementById('actionId').value          = a._id;
  document.getElementById('actionInvoice').value     = a.invoice?._id || '';
  document.getElementById('actionType').value        = a.type;
  document.getElementById('actionDescription').value = a.description;
  document.getElementById('actionDate').value        = a.date?.substring(0, 10);
  document.getElementById('actionOutcome').value     = a.outcome;
  document.getElementById('actionNext').value        = a.nextAction?.substring(0, 10) || '';
  document.getElementById('recoveryModalTitle').textContent = 'Modifier l\'action';
  openModal('recoveryModal');
};

const saveAction = async (e) => {
  e.preventDefault();
  const id = document.getElementById('actionId').value;
  const body = {
    invoiceId: document.getElementById('actionInvoice').value,
    type: document.getElementById('actionType').value,
    description: document.getElementById('actionDescription').value,
    date: document.getElementById('actionDate').value,
    outcome: document.getElementById('actionOutcome').value,
    nextAction: document.getElementById('actionNext').value || undefined
  };
  try {
    if (id) await apiFetch(`/recovery/update/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    else     await apiFetch('/recovery/create', { method: 'POST', body: JSON.stringify(body) });
    closeModal('recoveryModal');
    document.getElementById('recoveryForm').reset();
    document.getElementById('actionId').value = '';
    showToast(id ? 'Action modifiée' : 'Action créée');
    loadRecovery();
  } catch (err) { showToast(err.message, 'error'); }
};

const deleteAction = async (id) => {
  if (!confirm('Supprimer cette action ?')) return;
  try {
    await apiFetch(`/recovery/delete/${id}`, { method: 'DELETE' });
    showToast('Action supprimée');
    loadRecovery();
  } catch (err) { showToast(err.message, 'error'); }
};

// ═══════════════════════════════
//  HELPERS — populate selects
// ═══════════════════════════════

const loadClientsForSelect = async (selectId) => {
  try {
    const clients = await apiFetch('/client/getAll');
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = '<option value="">Sélectionner un client...</option>' +
      clients.map(c => `<option value="${c._id}">${c.name} — ${c.company}</option>`).join('');
    sel.value = cur;
  } catch (_) {}
};

const loadInvoicesForSelect = async (selectId) => {
  try {
    const invoices = await apiFetch('/invoice/getAll?status=overdue');
    const unpaid   = await apiFetch('/invoice/getAll?status=unpaid');
    const all = [...invoices, ...unpaid];
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="">Sélectionner une facture...</option>' +
      all.map(i => `<option value="${i._id}">${i.number} — ${formatCurrency(i.amount - i.paidAmount)}</option>`).join('');
  } catch (_) {}
};

// ═══════════════════════════════
//  LOGOUT
// ═══════════════════════════════

const logout = () => {
  removeToken();
  location.href = '/login';
};

// ═══════════════════════════════
//  SIDEBAR TOGGLE (mobile)
// ═══════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();

  // Load user name in topbar
  const userNameEl = document.getElementById('userName');
  if (userNameEl && getToken()) {
    apiFetch('/user/me').then(u => { userNameEl.textContent = u.name; }).catch(() => {});
  }

  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar   = document.querySelector('.sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // Logout link
  document.querySelector('.nav-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  // Set today as default for date fields
  const today = new Date().toISOString().substring(0, 10);
  document.getElementById('actionDate') && (document.getElementById('actionDate').value = today);

  // Page-specific loaders
  const path = location.pathname;
  if (path === '/dashboard') loadDashboard();
  if (path === '/clients')   loadClients();
  if (path === '/invoices')  loadInvoices();
  if (path === '/recovery')  loadRecovery();
});