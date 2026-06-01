// Pi Network Payment
async function startPayment(amount, memo) {
  showStatus('Creazione pagamento testnet...', 'loading');
  try {
    const payment = await Pi.createPayment(
      { amount: Number(amount), memo: memo || 'Testnet payment', metadata: { product: 'testnet_payment' } },
      { onReadyForServerApproval, onReadyForServerCompletion, onCancel, onError }
    );
    return payment;
  } catch (err) {
    showStatus('Errore: ' + err.message, 'error');
  }
}

async function onReadyForServerApproval(paymentId) {
  showStatus('Approvazione server in corso...', 'loading');
  const r = await fetch(CFG.apiBase + '/approve-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId })
  });
  const d = await r.json();
  if (d.success) {
    showStatus('Approvato! Completamento...', 'loading');
  } else {
    showStatus('Approvazione fallita', 'error');
    throw new Error('Approve failed');
  }
}

function onReadyForServerCompletion(paymentId, txid) {
  // Aggiungi il 'return' davanti per passare la Promise all'SDK di Pi
  return completeServerPayment(paymentId, txid);
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
      return d; // Ritorna un valore positivo all'SDK
    } else {
      showStatus('❌ Completamento fallito: ' + JSON.stringify(d.details), 'error');
      throw new Error('Completion failed on server');
    }
  } catch (err) {
    showStatus('Errore: ' + err.message, 'error');
    throw err; // Rilancia l'errore per sbloccare l'SDK
  }
}

function onCancel(paymentId) {
  showStatus('Pagamento annullato: ' + paymentId, 'error');
}

function onError(err, payment) {
  showStatus('Errore pagamento: ' + err.message, 'error');
}