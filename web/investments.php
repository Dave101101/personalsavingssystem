<?php
require_once 'config/session.php';
$pageTitle = 'Investments - First Groups Accounting';
$user = getCurrentUser();

include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content-wrapper">
    <?php include 'includes/topnav.php'; ?>
    
    <main>
        <div class="page-header">
            <div>
                <h1>Investment Portfolio</h1>
                <p>Track and manage your investments</p>
            </div>
            <button class="btn btn-primary" onclick="openModal('createInvestmentModal')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                Add Investment
            </button>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-3 mb-6">
            <div class="card">
                <div class="text-sm text-muted mb-2">Total Invested</div>
                <div class="text-lg font-bold" id="totalInvested">₦0.00</div>
            </div>
            <div class="card">
                <div class="text-sm text-muted mb-2">Current Value</div>
                <div class="text-lg font-bold" id="currentValue">₦0.00</div>
            </div>
            <div class="card">
                <div class="text-sm text-muted mb-2">Total Return</div>
                <div class="text-lg font-bold" id="totalReturn">0%</div>
            </div>
        </div>

        <div id="investmentsContainer">
            <div class="text-center text-muted">Loading investments...</div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>
</div>

<!-- Create Investment Modal -->
<div id="createInvestmentModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Add Investment</h3>
            <button class="modal-close" onclick="closeModal('createInvestmentModal')">&times;</button>
        </div>
        <form id="createInvestmentForm" onsubmit="handleCreateInvestment(event)">
            <div class="form-group">
                <label class="form-label">Investment Name</label>
                <input type="text" class="form-input" name="investment_name" placeholder="E.g., Apple Stocks" required>
            </div>
            <div class="form-group">
                <label class="form-label">Investment Type</label>
                <select class="form-select" name="investment_type" required>
                    <option value="Stocks">Stocks</option>
                    <option value="Bonds">Bonds</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Cryptocurrency">Cryptocurrency</option>
                    <option value="Mutual Funds">Mutual Funds</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Amount Invested</label>
                <input type="number" class="form-input" name="amount_invested" placeholder="0.00" step="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Purchase Date</label>
                <input type="date" class="form-input" name="purchase_date" required>
            </div>
            <div class="form-group">
                <label class="form-label">Maturity Date (Optional)</label>
                <input type="date" class="form-input" name="maturity_date">
            </div>
            <div class="form-group">
                <label class="form-label">Description (Optional)</label>
                <textarea class="form-textarea" name="description" placeholder="Additional details about this investment"></textarea>
            </div>
            <p class="text-sm text-muted mb-4">Funds will be transferred from your main balance</p>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Add Investment</button>
        </form>
    </div>
</div>

<script>
async function loadInvestments() {
    try {
        const response = await api.getInvestments();
        if (response.success) {
            displayInvestments(response.data);
        } else {
            document.getElementById('investmentsContainer').innerHTML = 
                '<div class="text-center text-muted">Failed to load investments</div>';
        }
    } catch (error) {
        document.getElementById('investmentsContainer').innerHTML = 
            '<div class="text-center text-muted">Error loading investments</div>';
    }
}

function displayInvestments(data) {
    const container = document.getElementById('investmentsContainer');
    const investments = data.investments || [];
    const summary = data.summary || { total_invested: 0, total_current_value: 0, total_return_percentage: 0 };

    // Update summary
    document.getElementById('totalInvested').textContent = formatCurrency(summary.total_invested);
    document.getElementById('currentValue').textContent = formatCurrency(summary.total_current_value);
    document.getElementById('totalReturn').textContent = summary.total_return_percentage.toFixed(2) + '%';

    if (investments.length === 0) {
        container.innerHTML = `
            <div class="card text-center" style="padding: 64px 32px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 24px; color: var(--text-muted);"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                <h3 class="font-bold mb-4">No Investments Yet</h3>
                <p class="text-muted mb-6">Start building your investment portfolio today</p>
                <button class="btn btn-primary" onclick="openModal('createInvestmentModal')">Add First Investment</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">Your Investments</div>
            </div>
            <ul class="list-group">
                ${investments.map(inv => {
                    const returnClass = inv.return_percentage >= 0 ? 'text-success' : 'text-danger';
                    const statusBadge = inv.status === 'active' ? 'success' : inv.status === 'matured' ? 'primary' : 'warning';
                    
                    return `
                        <li class="list-item">
                            <div class="list-item-content">
                                <div class="list-item-title">${inv.investment_name}</div>
                                <div class="list-item-subtitle">
                                    ${inv.investment_type} • Purchased ${formatDate(inv.purchase_date)}
                                </div>
                                <div class="flex gap-4 mt-2">
                                    <div>
                                        <div class="text-sm text-muted">Invested</div>
                                        <div class="font-bold text-sm">${formatCurrency(inv.amount_invested)}</div>
                                    </div>
                                    <div>
                                        <div class="text-sm text-muted">Current Value</div>
                                        <div class="font-bold text-sm">${formatCurrency(inv.current_value)}</div>
                                    </div>
                                    <div>
                                        <div class="text-sm text-muted">Return</div>
                                        <div class="font-bold text-sm ${returnClass}">${inv.return_percentage.toFixed(2)}%</div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col items-end gap-2">
                                <span class="badge badge-${statusBadge}">${inv.status}</span>
                                ${inv.status === 'active' ? `
                                    <button class="btn btn-outline btn-sm" onclick="liquidateInvestment(${inv.id}, '${inv.investment_name}', ${inv.current_value})">
                                        Liquidate
                                    </button>
                                ` : ''}
                            </div>
                        </li>
                    `;
                }).join('')}
            </ul>
        </div>
    `;
}

async function handleCreateInvestment(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        investment_name: formData.get('investment_name'),
        investment_type: formData.get('investment_type'),
        amount_invested: parseFloat(formData.get('amount_invested')),
        purchase_date: formData.get('purchase_date'),
        maturity_date: formData.get('maturity_date') || null,
        description: formData.get('description')
    };

    try {
        const response = await api.createInvestment(data);
        if (response.success) {
            showToast('Investment added successfully!', 'success');
            closeModal('createInvestmentModal');
            form.reset();
            refreshBalances();
            loadInvestments();
        } else {
            showToast(response.message || 'Failed to add investment', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

async function liquidateInvestment(investmentId, name, value) {
    if (!confirm(`Are you sure you want to liquidate ${name}? You will receive ${formatCurrency(value)}`)) {
        return;
    }

    try {
        const response = await api.liquidateInvestment(investmentId);
        if (response.success) {
            showToast(`Investment liquidated! ${formatCurrency(value)} added to your account`, 'success');
            refreshBalances();
            loadInvestments();
        } else {
            showToast(response.message || 'Failed to liquidate investment', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

// Load investments on page load
document.addEventListener('DOMContentLoaded', () => {
    loadInvestments();
});
</script>
