const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { paymentId } = JSON.parse(event.body); // Rimosso txid da qui, non serve nell'approvazione
    if (!paymentId) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing paymentId' })
      };
    }

    // Incolliamo la chiave direttamente per evitare i problemi di Vercel env
    const PI_API_KEY = "8ojpc3vrvhsugmsnpwbbkqzjcgewtihe2idatmkqrptnrwscsjppbm8c0ibchn19";

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Il body deve essere vuoto nell'approvazione!
      }
    );

    const data = await response.json();
    return {
      statusCode: response.ok ? 200 : response.status,
      headers: corsHeaders(),
      body: JSON.stringify(response.ok ? { success: true, paymentId } : { error: 'Approve failed', details: data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Server error', message: error.message })
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}