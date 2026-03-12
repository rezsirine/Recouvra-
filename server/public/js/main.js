// Toggle password visibility
function togglePassword() {
  const field = document.getElementById('passwordField');
  const icon = document.getElementById('eyeIcon');
  if (field.type === 'password') {
    field.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    field.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

// Sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // Auto-hide alerts
  document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-8px)';
      alert.style.transition = 'all .3s ease';
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  });
});

// Status badge helper
function statusBadge(status) {
  const map = {
    paid: ['badge status-paid', 'Payée'],
    unpaid: ['badge status-unpaid', 'Impayée'],
    overdue: ['badge status-overdue', 'En retard'],
    pending: ['badge status-pending', 'En cours'],
    successful: ['badge badge-green', 'Réussi'],
    failed: ['badge badge-red', 'Échoué'],
    rescheduled: ['badge badge-orange', 'Reporté'],
  };
  const [cls, label] = map[status] || ['badge badge-gray', status];
  return `<span class="${cls}">${label}</span>`;
}

// Format currency
function formatCurrency(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0);
}

// Format date
function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('fr-FR') : '—';
}

// API helper
async function api(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api' + endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    ...options,
  });
  if (res.status === 401) { window.location.href = '/login'; return null; }
  return res.json();
}