// Pi Network Payment
async function startPayment(amount, memo) {
  showStatus('Creazione pagamento testnet...', 'loading');
  try {
    const payment = await Pi.createPayment(
      { amount: Number(amount), memo: memo || 'Testnet payment', metadata: {} },
      { onReadyForServerApproval, onReadyForServerCompletion, onCancel, onError }
    );
    return payment;
  } catch (err) {
    showStatus('Errore: ' + err.message, 'error');
  }
}

function onReadyForServerApproval(paymentId) {
  showStatus('Approvazione server in corso...', 'loading');
  fetch(CFG.apiBase + '/approve-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId })
  })
    .then(r => r.json())
    .then(d => d.success
      ? showStatus('Approvato! Completamento...', 'loading')
      : showStatus('Approvazione fallita', 'error'));
}

function onReadyForServerCompletion(paymentId, txid) {
  completeServerPayment(paymentId, txid);
}

async function completeServerPayment(paymentId, txid) {
  showStatus('Completamento server...', 'loading');
  try {
    const r = await fetch(CFG.apiBase + '/complete-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, txid })
    });
    const d = await r.json();
    if (d.success) {
      showStatus('✅ Pagamento completato con successo sulla Testnet!', 'success');
    } else {
      showStatus('❌ Completamento fallito: ' + JSON.stringify(d.details), 'error');
    }
  } catch (err) {
    showStatus('Errore: ' + err.message, 'error');
  }
}

function onCancel(paymentId) {
  showStatus('Pagamento annullato: ' + paymentId, 'error');
}

function onError(err, payment) {
  showStatus('Errore pagamento: ' + err.message, 'error');
}