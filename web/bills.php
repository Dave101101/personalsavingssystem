<?php
require_once 'config/session.php';
$pageTitle = 'Bills - First Groups Accounting';
$user = getCurrentUser();

include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content-wrapper">
    <?php include 'includes/topnav.php'; ?>
    
    <main>
        <div class="page-header">
            <div>
                <h1>Bills Payment</h1>
                <p>Manage and pay your bills</p>
            </div>
            <button class="btn btn-primary" onclick="openModal('addBillModal')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                Add Bill
            </button>
        </div>

        <!-- Filter Tabs -->
        <div class="flex gap-2 mb-6">
            <button class="btn btn-sm" id="filter-all-bills" onclick="filterBills(null)">All</button>
            <button class="btn btn-sm btn-outline" id="filter-pending" onclick="filterBills('pending')">Pending</button>
            <button class="btn btn-sm btn-outline" id="filter-paid" onclick="filterBills('paid')">Paid</button>
        </div>

        <div id="billsContainer">
            <div class="text-center text-muted">Loading bills...</div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>
</div>

<!-- Add Bill Modal -->
<div id="addBillModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Add Bill</h3>
            <button class="modal-close" onclick="closeModal('addBillModal')">&times;</button>
        </div>
        <form id="addBillForm" onsubmit="handleAddBill(event)">
            <div class="form-group">
                <label class="form-label">Bill Type</label>
                <select class="form-select" name="bill_type" required>
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Internet">Internet</option>
                    <option value="Cable TV">Cable TV</option>
                    <option value="Phone">Phone</option>
                    <option value="Rent">Rent</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Biller Name</label>
                <input type="text" class="form-input" name="biller_name" placeholder="E.g., PHCN" required>
            </div>
            <div class="form-group">
                <label class="form-label">Amount</label>
                <input type="number" class="form-input" name="amount" placeholder="0.00" step="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Due Date</label>
                <input type="date" class="form-input" name="due_date" required>
            </div>
            <div class="form-group">
                <label class="form-label">Account Number (Optional)</label>
                <input type="text" class="form-input" name="account_number" placeholder="Customer/Account number">
            </div>
            <div class="form-group flex items-center justify-between">
                <label class="form-label" style="margin-bottom: 0;">Recurring Payment</label>
                <div class="toggle" onclick="toggleElement(this)">
                    <div class="toggle-thumb"></div>
                    <input type="hidden" name="is_recurring" value="0">
                </div>
            </div>
            <div id="recurrenceOptions" style="display: none;">
                <div class="form-group">
                    <label class="form-label">Recurrence Frequency</label>
                    <select class="form-select" name="recurrence_frequency">
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Add Bill</button>
        </form>
    </div>
</div>

<script>
let currentBillFilter = null;

async function loadBills(status = null) {
    const container = document.getElementById('billsContainer');
    container.innerHTML = '<div class="text-center text-muted">Loading bills...</div>';

    try {
        const response = await api.getBills(status);
        if (response.success) {
            displayBills(response.data);
        } else {
            container.innerHTML = '<div class="text-center text-muted">Failed to load bills</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="text-center text-muted">Error loading bills</div>';
    }
}

function displayBills(bills) {
    const container = document.getElementById('billsContainer');
    
    if (bills.length === 0) {
        container.innerHTML = `
            <div class="card text-center" style="padding: 64px 32px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 24px; color: var(--text-muted);"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
                <h3 class="font-bold mb-4">No Bills Found</h3>
                <p class="text-muted mb-6">Add your bills to keep track and never miss a payment</p>
                <button class="btn btn-primary" onclick="openModal('addBillModal')">Add First Bill</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">Your Bills</div>
            </div>
            <ul class="list-group">
                ${bills.map(bill => {
                    const statusBadge = bill.status === 'paid' ? 'success' : 
                                       bill.status === 'overdue' ? 'danger' : 
                                       'warning';
                    const dueDate = new Date(bill.due_date);
                    const isOverdue = dueDate < new Date() && bill.status === 'pending';
                    
                    return `
                        <li class="list-item">
                            <div class="flex items-center gap-4">
                                <div class="icon-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
                                </div>
                                <div class="list-item-content">
                                    <div class="list-item-title">${bill.biller_name}</div>
                                    <div class="list-item-subtitle">
                                        ${bill.bill_type} • Due ${formatDate(bill.due_date)}
                                        ${bill.is_recurring ? ' • Recurring ' + bill.recurrence_frequency : ''}
                                    </div>
                                    ${bill.account_number ? `<div class="text-sm text-muted">Account: ${bill.account_number}</div>` : ''}
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="text-right">
                                    <div class="font-bold">${formatCurrency(bill.amount)}</div>
                                    <span class="badge badge-${statusBadge}">${bill.status}</span>
                                </div>
                                ${bill.status === 'pending' ? `
                                    <button class="btn btn-primary btn-sm" onclick="payBill(${bill.id}, '${bill.biller_name}', ${bill.amount})">
                                        Pay Now
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

function filterBills(status) {
    currentBillFilter = status;
    
    // Update button states
    document.getElementById('filter-all-bills').className = status === null ? 'btn btn-sm' : 'btn btn-sm btn-outline';
    document.getElementById('filter-pending').className = status === 'pending' ? 'btn btn-sm' : 'btn btn-sm btn-outline';
    document.getElementById('filter-paid').className = status === 'paid' ? 'btn btn-sm' : 'btn btn-sm btn-outline';
    
    loadBills(status);
}

async function handleAddBill(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const toggleElement = form.querySelector('.toggle');
    const isRecurring = toggleElement.classList.contains('active') ? 1 : 0;
    
    const data = {
        bill_type: formData.get('bill_type'),
        biller_name: formData.get('biller_name'),
        amount: parseFloat(formData.get('amount')),
        due_date: formData.get('due_date'),
        account_number: formData.get('account_number') || null,
        is_recurring: isRecurring,
        recurrence_frequency: isRecurring ? formData.get('recurrence_frequency') : null
    };

    try {
        const response = await api.createBill(data);
        if (response.success) {
            showToast('Bill added successfully!', 'success');
            closeModal('addBillModal');
            form.reset();
            loadBills(currentBillFilter);
        } else {
            showToast(response.message || 'Failed to add bill', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

async function payBill(billId, billerName, amount) {
    if (!confirm(`Pay ${formatCurrency(amount)} to ${billerName}?`)) {
        return;
    }

    try {
        const response = await api.payBill(billId);
        if (response.success) {
            showToast('Bill paid successfully!', 'success');
            refreshBalances();
            loadBills(currentBillFilter);
        } else {
            showToast(response.message || 'Failed to pay bill', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

// Show/hide recurrence options
document.addEventListener('click', (e) => {
    if (e.target.closest('.toggle')) {
        const toggle = e.target.closest('.toggle');
        const form = toggle.closest('form');
        if (form && form.id === 'addBillForm') {
            const recurrenceOptions = document.getElementById('recurrenceOptions');
            const input = toggle.querySelector('input[type="hidden"]');
            
            setTimeout(() => {
                if (toggle.classList.contains('active')) {
                    recurrenceOptions.style.display = 'block';
                    if (input) input.value = '1';
                } else {
                    recurrenceOptions.style.display = 'none';
                    if (input) input.value = '0';
                }
            }, 0);
        }
    }
});

// Load bills on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBills(null);
});
</script>
