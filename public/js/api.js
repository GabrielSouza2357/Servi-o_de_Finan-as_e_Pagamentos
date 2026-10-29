/*
    Módulo responsável por interagir com o Web Service (APIs).
*/
const ApiService = {
    async getCryptoPrice(coin) {
        const response = await fetch(`/api/crypto/${coin}`);
        return await response.json();
    },

    async getStockQuote(symbol) {
        const response = await fetch(`/api/stock/${symbol}`);
        return await response.json();
    },

    async processStripePayment(amount) {
        return new Promise(
            resolve => setTimeout(
                () => resolve(
                    { message: `Pagamento de $${amount} processado com sucesso via Stripe!` }
                ), 800
            )
        );
    },

    async processPayPalPayment(amount) {
        return new Promise(
            resolve => setTimeout(
                () => resolve(
                    { message: `Transação de $${amount} aprovada via PayPal Express!` }
                ), 800
            )
        );
    }
};