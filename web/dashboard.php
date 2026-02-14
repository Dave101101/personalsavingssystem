<?php
require_once 'config/session.php';
$pageTitle = 'Dashboard - First Groups Accounting';
$user = getCurrentUser();

// Get accounts data
$conn = getDB();
$userId = $_SESSION['user_id'];

// Get recent transactions
$transQuery = "SELECT t.*, a.account_type FROM transactions t 
               INNER JOIN accounts a ON t.account_id = a.id 
               WHERE t.user_id = ? 
               ORDER BY t.transaction_date DESC LIMIT 5";
$transStmt = $conn->prepare($transQuery);
$transStmt->bind_param("i", $userId);
$transStmt->execute();
$transactions = $transStmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Get savings plans summary
$planQuery = "SELECT COUNT(*) as count, COALESCE(SUM(current_amount), 0) as total FROM savings_plans WHERE user_id = ? AND status = 'active'";
$planStmt = $conn->prepare($planQuery);
$planStmt->bind_param("i", $userId);
$planStmt->execute();
$plansSummary = $planStmt->get_result()->fetch_assoc();

include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content-wrapper">
    <?php include 'includes/topnav.php'; ?>
    
    <main>
        <div class="page-header">
            <h1>Welcome back, <?php echo htmlspecialchars(explode(' ', $user['name'])[0]); ?>!</h1>
            <p>Here's your financial overview for today</p>
        </div>

        <!-- Balance Cards -->
        <div class="balance-cards">
            <div class="balance-card">
                <div class="balance-label">Main Balance</div>
                <div class="balance-amount" id="balance-main">
                    <?php echo formatCurrency($user['main_balance'] ?? 0); ?>
                </div>
                <div class="balance-actions">
                    <button class="btn btn-secondary btn-sm" onclick="openModal('addMoneyModal')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5-5 5 5"/><path d="M12 7v14"/></svg>
                        Add Money
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="openModal('sendMoneyModal')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 12-5 5-5-5"/><path d="M12 17V3"/></svg>
                        Send
                    </button>
                </div>
            </div>

            <div class="balance-card" style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);">
                <div class="balance-label">Stash Balance</div>
                <div class="balance-amount" id="balance-stash">
                    <?php echo formatCurrency($user['stash_balance'] ?? 0); ?>
                </div>
                <div class="balance-actions">
                    <button class="btn btn-secondary btn-sm" onclick="openModal('topUpStashModal')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                        Top Up
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="openModal('withdrawStashModal')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                        Withdraw
                    </button>
                </div>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-3 mb-6">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Active Plans</div>
                </div>
                <div class="text-lg font-bold"><?php echo $plansSummary['count']; ?> Plans</div>
                <div class="text-sm text-muted">Total Saved: <?php echo formatCurrency($plansSummary['total']); ?></div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-title">Quick Actions</div>
                </div>
                <div class="flex flex-col gap-2">
                    <button class="btn btn-outline btn-sm" onclick="window.location.href='plans.php'">Create Savings Plan</button>
                    <button class="btn btn-outline btn-sm" onclick="window.location.href='bills.php'">Pay Bills</button>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-title">This Month</div>
                </div>
                <div class="text-sm text-muted">Track your spending and savings goals</div>
                <a href="plans.php" class="btn btn-primary btn-sm mt-4">View Plans</a>
            </div>
        </div>

        <!-- Recent Transactions -->
        <div class="card">
            <div class="card-header">
                <div class="card-title">Recent Transactions</div>
                <a href="transactions.php" class="text-sm text-primary">View All</a>
            </div>

            <?php if (empty($transactions)): ?>
                <div class="text-center py-8 text-muted">
                    <p>No transactions yet</p>
                    <button class="btn btn-primary btn-sm mt-4" onclick="openModal('addMoneyModal')">Add Money to Get Started</button>
                </div>
            <?php else: ?>
                <ul class="list-group">
                    <?php foreach ($transactions as $trans): ?>
                    <li class="list-item">
                        <div class="flex items-center gap-4">
                            <div class="icon-btn <?php echo $trans['type'] === 'credit' ? 'text-success' : 'text-danger'; ?>">
                                <?php if ($trans['type'] === 'credit'): ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5-5 5 5"/><path d="M12 7v14"/></svg>
                                <?php else: ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 12-5 5-5-5"/><path d="M12 17V3"/></svg>
                                <?php endif; ?>
                            </div>
                            <div class="list-item-content">
                                <div class="list-item-title"><?php echo htmlspecialchars($trans['category']); ?></div>
                                <div class="list-item-subtitle">
                                    <?php echo htmlspecialchars($trans['description'] ?: 'No description'); ?> • 
                                    <?php echo formatDate($trans['transaction_date']); ?>
                                </div>
                            </div>
                        </div>
                        <div class="font-bold <?php echo $trans['type'] === 'credit' ? 'text-success' : 'text-danger'; ?>">
                            <?php echo $trans['type'] === 'credit' ? '+' : '-'; ?><?php echo formatCurrency($trans['amount']); ?>
                        </div>
                    </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>
</div>

<!-- Add Money Modal -->
<div id="addMoneyModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Add Money</h3>
            <button class="modal-close" onclick="closeModal('addMoneyModal')">&times;</button>
        </div>
        <form id="addMoneyForm" onsubmit="handleAddMoney(event)">
            <div class="form-group">
                <label class="form-label">Amount</label>
                <input type="number" class="form-input" name="amount" placeholder="0.00" step="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" name="category" required>
                    <option value="Income">Income</option>
                    <option value="Refund">Refund</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Description (Optional)</label>
                <input type="text" class="form-input" name="description" placeholder="E.g., Salary payment">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Add Money</button>
        </form>
    </div>
</div>

<!-- Top Up Stash Modal -->
<div id="topUpStashModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Top Up Stash</h3>
            <button class="modal-close" onclick="closeModal('topUpStashModal')">&times;</button>
        </div>
        <form id="topUpStashForm" onsubmit="handleTopUpStash(event)">
            <div class="form-group">
                <label class="form-label">Amount</label>
                <input type="number" class="form-input" name="amount" placeholder="0.00" step="0.01" required>
            </div>
            <p class="text-sm text-muted mb-4">Funds will be transferred from your main balance</p>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Top Up Stash</button>
        </form>
    </div>
</div>

<script>
async function handleAddMoney(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const amount = parseFloat(formData.get('amount'));
    const category = formData.get('category');
    const description = formData.get('description');

    try {
        const response = await api.updateBalance('main', amount, 'add', category, description);
        if (response.success) {
            showToast('Money added successfully!', 'success');
            closeModal('addMoneyModal');
            form.reset();
            refreshBalances();
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast(response.message || 'Failed to add money', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

async function handleTopUpStash(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const amount = parseFloat(formData.get('amount'));

    try {
        // First, deduct from main
        const deduct = await api.updateBalance('main', amount, 'subtract', 'Stash Transfer', 'Transfer to Stash');
        if (!deduct.success) {
            showToast(deduct.message || 'Insufficient balance', 'error');
            return;
        }

        // Then add to stash
        const add = await api.updateBalance('stash', amount, 'add', 'Stash Transfer', 'Transfer from Main');
        if (add.success) {
            showToast('Stash topped up successfully!', 'success');
            closeModal('topUpStashModal');
            form.reset();
            refreshBalances();
            setTimeout(() => location.reload(), 1000);
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}
</script>
