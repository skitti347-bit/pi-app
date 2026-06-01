// Pi Network Payment
async function startPayment(amount, memo) {
  showStatus('Creazione pagamento testnet...', 'loading');
  try {
    const payment = await Pi.createPayment(
      { 
        amount: Number(amount), 
        memo: memo || 'Testnet payment', 
        metadata: { product: 'testnet_payment' } 
      },
      { 
        onReadyForServerApproval, 
        onReadyForServerCompletion, 
        onCancel, 
        onError 
      }
    );
    return payment;
  } catch (err) {
    showStatus('Errore creazione pagamento: ' + err.message, 'error');
  }
}

async function onReadyForServerApproval(paymentId) {
  showStatus('Approvazione server in corso...', 'loading');
  try {
    const r = await fetch(CFG.apiBase + '/approve-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId }) // Invia solo il paymentId, il txid qui non esiste ancora!
    });
    
    const d = await r.json();
    
    if (d.success) {
      showStatus('Approvato! In attesa della firma dell\'utente...', 'loading');
      return d; // FONDAMENTALE: Dice all'SDK che il server ha approvato, sbloccando l'apertura del Wallet
    } else {
      showStatus('Approvazione fallita dal server', 'error');
      throw new Error('Approve failed on server');
    }
  } catch (err) {
    showStatus('Errore approvazione: ' + err.message, 'error');
    throw err; // Rilancia l'errore per sbloccare l'SDK in caso di crash
  }
}

function onReadyForServerCompletion(paymentId, txid) {
  // FONDAMENTALE: Il 'return' passa la Promise del completamento direttamente all'SDK di Pi
  return completeServerPayment(paymentId, txid);
}

async function completeServerPayment(paymentId, txid) {
  showStatus('Completamento server...', 'loading');
  try {
    const r = await fetch(CFG.apiBase + '/complete-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, txid }) // Qui passiamo sia paymentId che il txid generato dal wallet
    });
    
    const d = await r.json();
    
    if (d.success) {
      showStatus('✅ Pagamento completato con successo sulla Testnet!', 'success');
      return d; // FONDAMENTALE: Chiude definitivamente la transazione nell'SDK
    } else {
      showStatus('❌ Completamento fallito: ' + JSON.stringify(d.details || d.error), 'error');
      throw new Error('Completion failed on server');
    }
  } catch (err) {
    showStatus('Errore completamento: ' + err.message, 'error');
    throw err; // Rilancia l'errore per evitare che l'SDK rimanga appeso
  }
}

function onCancel(paymentId) {
  showStatus('Pagamento annullato dall\'utente. ID: ' + paymentId, 'error');
}

function onError(err, payment) {
  showStatus('Errore critico SDK Pi: ' + err.message, 'error');
  console.error('Dettagli errore SDK:', err, payment);
}