# Pi Network - Testnet Login & Payment

App di prova per login e pagamenti su Pi Network Testnet, deploy su Vercel.

## Setup

```bash
npm install
```

## Deploy su Vercel

1. Collega il repo GitHub a Vercel
2. Imposta la variabile d'ambiente `PI_API_KEY` con la tua API key sandbox
3. Deploya

## Struttura

```
pi-app/
├── public/           # Frontend (Pi SDK, login, pagamento)
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── config.js
│       ├── auth.js
│       ├── payment.js
│       ├── ui.js
│       └── app.js
├── api/              # Serverless (approve + complete)
│   ├── approve-payment.js
│   └── complete-payment.js
├── vercel.json
└── package.json
```

## Flusso

1. Login con Pi Network (Pi Browser)
2. Inserisci importo e memo
3. Il server approva e completa il pagamento via API Pi
4. Tutto su **Testnet**