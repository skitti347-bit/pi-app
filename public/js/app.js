// App initialization
document.addEventListener('DOMContentLoaded', () => {
  Pi.init({ version: '2.0', sandbox: CFG.sandbox });

  $('login-btn').addEventListener('click', loginWithPi);
  $('logout-btn').addEventListener('click', logout);
  $('pay-btn').addEventListener('click', () => {
    const amount = $('amount').value;
    const memo = $('memo').value;
    if (!amount || amount <= 0) {
      showStatus('Inserisci un importo valido', 'error');
      return;
    }
    startPayment(amount, memo);
  });

  showLogin();
});