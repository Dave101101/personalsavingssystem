// API Base URL (update this to your backend location)
const API_BASE_URL = '/php-backend/api';

// API Helper Functions
const api = {
    // Generic fetch wrapper
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                credentials: 'include'
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            showToast('Network error occurred', 'error');
            throw error;
        }
    },

    // Accounts
    async getAccounts() {
        return this.request('accounts.php');
    },

    async updateBalance(accountType, amount, operation, category = 'General', description = '') {
        return this.request('accounts.php', {
            method: 'PUT',
            body: JSON.stringify({
                account_type: accountType,
                amount,
                operation,
                category,
                description
            })
        });
    },

    // Transactions
    async getTransactions(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`transactions.php?${params}`);
    },

    async createTransaction(data) {
        return this.request('transactions.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Savings Plans
    async getSavingsPlans(status = null) {
        const params = status ? `?status=${status}` : '';
        return this.request(`savings.php${params}`);
    },

    async createSavingsPlan(data) {
        return this.request('savings.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateSavingsPlan(planId, data) {
        return this.request('savings.php', {
            method: 'PUT',
            body: JSON.stringify({ plan_id: planId, ...data })
        });
    },

    async savingsTransaction(planId, transactionType, amount, notes = '') {
        return this.request('savings.php', {
            method: 'PUT',
            body: JSON.stringify({
                plan_id: planId,
                transaction_type: transactionType,
                amount,
                notes
            })
        });
    },

    // Circles
    async getCircles(filter = 'all') {
        const params = filter !== 'all' ? `?filter=${filter}` : '';
        return this.request(`circles.php${params}`);
    },

    async getCircleDetails(circleId) {
        return this.request(`circles.php?id=${circleId}`);
    },

    async createCircle(data) {
        return this.request('circles.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async joinCircle(circleId) {
        return this.request('circles.php', {
            method: 'PUT',
            body: JSON.stringify({
                circle_id: circleId,
                action: 'join'
            })
        });
    },

    async contributeToCircle(circleId, amount) {
        return this.request('circles.php', {
            method: 'PUT',
            body: JSON.stringify({
                circle_id: circleId,
                action: 'contribute',
                amount
            })
        });
    },

    // Investments
    async getInvestments(status = null) {
        const params = status ? `?status=${status}` : '';
        return this.request(`investments.php${params}`);
    },

    async createInvestment(data) {
        return this.request('investments.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateInvestment(investmentId, data) {
        return this.request('investments.php', {
            method: 'PUT',
            body: JSON.stringify({ investment_id: investmentId, ...data })
        });
    },

    async liquidateInvestment(investmentId) {
        return this.request(`investments.php?id=${investmentId}`, {
            method: 'DELETE'
        });
    },

    // Bills
    async getBills(status = null) {
        const params = status ? `?status=${status}` : '';
        return this.request(`bills.php${params}`);
    },

    async createBill(data) {
        return this.request('bills.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async payBill(billId) {
        return this.request('bills.php', {
            method: 'PUT',
            body: JSON.stringify({
                bill_id: billId,
                action: 'pay'
            })
        });
    },

    // User
    async getUserProfile() {
        return this.request('user.php');
    },

    async updateUserProfile(data) {
        return this.request('user.php', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // Settings
    async getSettings() {
        return this.request('settings.php');
    },

    async updateSettings(data) {
        return this.request('settings.php', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};
