<?php
require_once 'config/session.php';
$pageTitle = 'Savings Plans - First Groups Accounting';
$user = getCurrentUser();

// Get savings plans
$conn = getDB();
$userId = $_SESSION['user_id'];

$planQuery = "SELECT * FROM savings_plans WHERE user_id = ? ORDER BY created_at DESC";
$planStmt = $conn->prepare($planQuery);
$planStmt->bind_param("i", $userId);
$planStmt->execute();
$plans = $planStmt->get_result()->fetch_all(MYSQLI_ASSOC);

include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content-wrapper">
    <?php include 'includes/topnav.php'; ?>
    
    <main>
        <div class="page-header">
            <div>
                <h1>Savings Plans</h1>
                <p>Create and manage your financial goals</p>
            </div>
            <button class="btn btn-primary" onclick="openModal('createPlanModal')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                Create Plan
            </button>
        </div>

        <?php if (empty($plans)): ?>
            <div class="card text-center" style="padding: 64px 32px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 24px; color: var(--text-muted);"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                <h3 class="font-bold mb-4">No Savings Plans Yet</h3>
                <p class="text-muted mb-6">Create your first savings plan to start building towards your financial goals</p>
                <button class="btn btn-primary" onclick="openModal('createPlanModal')">Create Your First Plan</button>
            </div>
        <?php else: ?>
            <div class="grid grid-3">
                <?php foreach ($plans as $plan): 
                    $progress = $plan['target_amount'] > 0 ? ($plan['current_amount'] / $plan['target_amount']) * 100 : 0;
                    $progressPercent = min($progress, 100);
                ?>
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title"><?php echo htmlspecialchars($plan['plan_name']); ?></div>
                            <div class="text-sm text-muted"><?php echo ucfirst($plan['frequency']); ?> • <?php echo ucfirst($plan['status']); ?></div>
                        </div>
                        <span class="badge badge-<?php echo $plan['status'] === 'active' ? 'success' : ($plan['status'] === 'completed' ? 'primary' : 'warning'); ?>">
                            <?php echo ucfirst($plan['status']); ?>
                        </span>
                    </div>

                    <div class="mb-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-sm text-muted">Progress</span>
                            <span class="text-sm font-bold"><?php echo round($progressPercent, 1); ?>%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: <?php echo $progressPercent; ?>%;"></div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <div class="flex justify-between mb-1">
                            <span class="text-sm text-muted">Current</span>
                            <span class="font-bold"><?php echo formatCurrency($plan['current_amount']); ?></span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-muted">Target</span>
                            <span class="font-bold"><?php echo formatCurrency($plan['target_amount']); ?></span>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button class="btn btn-primary btn-sm" onclick="depositToPlan(<?php echo $plan['id']; ?>, '<?php echo htmlspecialchars($plan['plan_name']); ?>')">Deposit</button>
                        <button class="btn btn-outline btn-sm" onclick="viewPlanDetails(<?php echo $plan['id']; ?>)">Details</button>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </main>

    <?php include 'includes/footer.php'; ?>
</div>

<!-- Create Plan Modal -->
<div id="createPlanModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Create Savings Plan</h3>
            <button class="modal-close" onclick="closeModal('createPlanModal')">&times;</button>
        </div>
        <form id="createPlanForm" onsubmit="handleCreatePlan(event)">
            <div class="form-group">
                <label class="form-label">Plan Name</label>
                <input type="text" class="form-input" name="plan_name" placeholder="E.g., Emergency Fund" required>
            </div>
            <div class="form-group">
                <label class="form-label">Target Amount</label>
                <input type="number" class="form-input" name="target_amount" placeholder="0.00" step="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Frequency</label>
                <select class="form-select" name="frequency" required>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="date" class="form-input" name="start_date" required>
            </div>
            <div class="form-group">
                <label class="form-label">End Date</label>
                <input type="date" class="form-input" name="end_date" required>
            </div>
            <div class="form-group">
                <label class="form-label">Description (Optional)</label>
                <textarea class="form-textarea" name="description" placeholder="What are you saving for?"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Create Plan</button>
        </form>
    </div>
</div>

<!-- Deposit Modal -->
<div id="depositModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title" id="depositModalTitle">Deposit to Plan</h3>
            <button class="modal-close" onclick="closeModal('depositModal')">&times;</button>
        </div>
        <form id="depositForm" onsubmit="handleDeposit(event)">
            <input type="hidden" name="plan_id" id="depositPlanId">
            <div class="form-group">
                <label class="form-label">Amount</label>
                <input type="number" class="form-input" name="amount" placeholder="0.00" step="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Notes (Optional)</label>
                <input type="text" class="form-input" name="notes" placeholder="Monthly savings">
            </div>
            <p class="text-sm text-muted mb-4">Funds will be transferred from your main balance</p>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Deposit</button>
        </form>
    </div>
</div>

<script>
async function handleCreatePlan(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        plan_name: formData.get('plan_name'),
        target_amount: parseFloat(formData.get('target_amount')),
        frequency: formData.get('frequency'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        description: formData.get('description')
    };

    try {
        const response = await api.createSavingsPlan(data);
        if (response.success) {
            showToast('Savings plan created successfully!', 'success');
            closeModal('createPlanModal');
            form.reset();
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast(response.message || 'Failed to create plan', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

function depositToPlan(planId, planName) {
    document.getElementById('depositPlanId').value = planId;
    document.getElementById('depositModalTitle').textContent = `Deposit to ${planName}`;
    openModal('depositModal');
}

async function handleDeposit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const planId = formData.get('plan_id');
    const amount = parseFloat(formData.get('amount'));
    const notes = formData.get('notes');

    try {
        const response = await api.savingsTransaction(planId, 'deposit', amount, notes);
        if (response.success) {
            showToast('Deposit successful!', 'success');
            closeModal('depositModal');
            form.reset();
            refreshBalances();
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast(response.message || 'Failed to deposit', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

function viewPlanDetails(planId) {
    // You can implement a detailed view modal here
    showToast('Detailed view coming soon!', 'success');
}
</script>
