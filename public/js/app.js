// App initialization
document.addEventListener('DOMContentLoaded', () => {
  Pi.init({ version: '2.0' });

  $('login-btn').addEventListener('click', loginWithPi);
  $('logout-btn').addEventListener('click', logout);
  $('pay-2pi-btn').addEventListener('click', () => {
    startPayment(2, 'Testnet payment');
  });

  showLogin();
});