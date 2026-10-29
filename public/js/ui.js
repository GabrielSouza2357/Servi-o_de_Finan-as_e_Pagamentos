/*
    Módulo responsável pela manipulação e atualização da interface de usuário (UI).
*/
const UiManager = {
    showResult(elementId, content, isError = false) {
        const el = document.getElementById(elementId);
        
        el.classList.remove(
            'hidden', 'bg-red-50', 'bg-emerald-50', 
            'text-red-700', 'text-emerald-700'
        );

        el.classList.add(
            isError ? 'bg-red-50' : 'bg-emerald-50', 
            isError ? 'text-red-700' : 'text-emerald-700'
        );
        
        el.innerHTML = content;
    },

    renderCryptoData(data, coin) {
        if (!data[coin]) {
            this.showResult(
                'crypto-result', 'Dados não encontrados.', true
            );
            return;
        }

        const info = data[coin];
        this.showResult(
            'crypto-result', 
            `<p>
                <strong>Ativo:</strong> ${coin.toUpperCase()}
            </p>
            <p>
                <strong>USD:</strong> $ ${info.usd}
            </p>
            <p>
                <strong>BRL:</strong> R$ ${info.brl}
            </p>`
        );
    },

    renderStockData(data) {
        const quote = data['Global Quote'];
        if (!quote || Object.keys(quote).length === 0) {
            this.showResult(
                'stock-result', 'Ação não encontrada ou limite atingido.', true
            );
            return;
        }

        this.showResult(
            'stock-result', 
            `<p>
                <strong>Símbolo:</strong> ${quote['01. symbol']}
            </p>
            <p>
                <strong>Preço:</strong> $ ${quote['05. price']}
            </p>
            <p>
                <strong>Variação:</strong> ${quote['10. change percent']}
            </p>`
        );
    }
};