// App initialization
document.addEventListener('DOMContentLoaded', () => {
  // FORZA A FALSE: dice all'SDK di usare la Testnet ufficiale
  Pi.init({ version: '2.0', sandbox: false }); 

  $('login-btn').addEventListener('click', loginWithPi);
  $('logout-btn').addEventListener('click', logout);
  $('pay-2pi-btn').addEventListener('click', () => {
    startPayment(2, 'Testnet payment');
  });

  showLogin();
});