/*
    Módulo principal de inicialização, controle de autenticação e escuta de eventos.
*/
document.addEventListener('DOMContentLoaded', () => {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const userInfo = document.getElementById('user-info');
    const welcomeMsg = document.getElementById('welcome-msg');
    const btnLogout = document.getElementById('btn-logout');

    // Controle de Abas
    tabLogin.addEventListener('click', () => {
        tabLogin.className = "w-1/2 pb-3 font-semibold text-indigo-600 border-b-2 border-indigo-600 transition";
        tabRegister.className = "w-1/2 pb-3 font-semibold text-slate-400 border-b-2 border-transparent transition";
        formLogin.classList.remove('hidden');
        formRegister.classList.add('hidden');
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.className = "w-1/2 pb-3 font-semibold text-indigo-600 border-b-2 border-indigo-600 transition";
        tabLogin.className = "w-1/2 pb-3 font-semibold text-slate-400 border-b-2 border-transparent transition";
        formRegister.classList.remove('hidden');
        formLogin.classList.add('hidden');
    });

    // Cadastro
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const feedback = document.getElementById('reg-feedback');

        localStorage.setItem(`user_${email}`, JSON.stringify({ name, email, password }));
        feedback.textContent = "Conta criada com sucesso! Faça login.";
        feedback.className = "text-sm text-emerald-600 bg-emerald-50 p-2 rounded-lg text-center mt-2";
        feedback.classList.remove('hidden');

        setTimeout(() => { tabLogin.click(); feedback.classList.add('hidden'); }, 1500);
    });

    // Login
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const feedback = document.getElementById('login-feedback');
        const stored = localStorage.getItem(`user_${email}`);

        if (stored) {
            const user = JSON.parse(stored);
            if (user.password === password) {
                sessionStorage.setItem('logged_user', user.name);
                checkAuthSession();
                return;
            }
        }
        
        feedback.textContent = "E-mail ou senha incorretos.";
        feedback.className = "text-sm text-red-600 bg-red-50 p-2 rounded-lg text-center mt-2";
        feedback.classList.remove('hidden');
    });

    // Logout
    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('logged_user');
        checkAuthSession();
    });

    function checkAuthSession() {
        const logged = sessionStorage.getItem('logged_user');
        if (logged) {
            authSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            userInfo.classList.remove('hidden');
            welcomeMsg.textContent = `Olá, ${logged}`;
        } else {
            authSection.classList.remove('hidden');
            dashboardSection.classList.add('hidden');
            userInfo.classList.add('hidden');
        }
    }

    checkAuthSession();

    // Eventos das APIs
    document.getElementById('btn-fetch-crypto')?.addEventListener('click', async () => {
        try {
            const coin = document.getElementById('crypto-select').value;
            UiManager.renderCryptoData(await ApiService.getCryptoPrice(coin), coin);
        } catch { UiManager.showResult('crypto-result', 'Erro ao buscar criptomoeda.', true); }
    });

    document.getElementById('btn-fetch-stock')?.addEventListener('click', async () => {
        try {
            const symbol = document.getElementById('stock-symbol').value.trim();
            if (symbol) UiManager.renderStockData(await ApiService.getStockQuote(symbol));
        } catch { UiManager.showResult('stock-result', 'Erro ao buscar ações.', true); }
    });

    document.getElementById('btn-pay-stripe')?.addEventListener('click', async () => {
        const amount = document.getElementById('stripe-amount').value;
        UiManager.showResult('stripe-result', (await ApiService.processStripePayment(amount)).message);
    });

    document.getElementById('btn-pay-paypal')?.addEventListener('click', async () => {
        const amount = document.getElementById('paypal-amount').value;
        UiManager.showResult('paypal-result', (await ApiService.processPayPalPayment(amount)).message);
    });
});