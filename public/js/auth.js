// Pi Network Authentication
let user = null;
let accessToken = null;

async function loginWithPi() {
  try {
    const scopes = ['payments', 'username'];
    const auth = await Pi.authenticate(scopes, onIncompletePayment);
    user = auth.user;
    accessToken = auth.accessToken;
    showUser(user);
    showPaymentForm();
  } catch (err) {
    showStatus('Login fallito: ' + err.message, 'error');
  }
}

function logout() {
  user = null;
  accessToken = null;
  showLogin();
}

function onIncompletePayment(payment) {
  showStatus('Pagamento in sospeso trovato. ID: ' + payment.identifier, 'loading');
  completeServerPayment(payment.identifier, payment.transaction?.txid);
}