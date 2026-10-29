/*
    Servidor Web principal da aplicação (Node.js + Express).
    Atua como Web Service proxy para mascarar credenciais 
    e servir os arquivos do cliente.
*/
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota Proxy: CoinGecko API (Criptomoedas)
app.get('/api/crypto/:coin', async (req, res) => {
    const { coin } = req.params;
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd,brl`
        );
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados na CoinGecko API' });
    }
});

// Rota Proxy: Alpha Vantage API (Mercado de Ações)
app.get('/api/stock/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    try {
        const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
        );

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados na Alpha Vantage API' });
    }
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando e acessível remotamente na porta ${PORT}`);
});