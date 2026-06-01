// UI state management
const $ = id => document.getElementById(id);

function showLogin() {
  $('login-section').classList.remove('hidden');
  $('user-section').classList.add('hidden');
  $('payment-section').classList.add('hidden');
  $('status').innerHTML = '';
}

function showUser(u) {
  $('login-section').classList.add('hidden');
  $('user-section').classList.remove('hidden');
  $('user-info').textContent = '👤 ' + u.username;
}

function showPaymentForm() {
  $('payment-section').classList.remove('hidden');
}

function showStatus(msg, type) {
  const el = $('status');
  el.textContent = msg;
  el.className = 'status-' + type;
  el.classList.remove('hidden');
}