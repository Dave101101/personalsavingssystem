<?php
require_once 'config/session.php';
$pageTitle = 'Investment Circles - First Groups Accounting';
$user = getCurrentUser();

include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content-wrapper">
    <?php include 'includes/topnav.php'; ?>
    
    <main>
        <div class="page-header">
            <div>
                <h1>Investment Circles</h1>
                <p>Join or create collaborative savings groups</p>
            </div>
            <button class="btn btn-primary" onclick="openModal('createCircleModal')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                Create Circle
            </button>
        </div>

        <!-- Filter Tabs -->
        <div class="flex gap-2 mb-6">
            <button class="btn btn-sm" id="filter-all" onclick="filterCircles('all')">All Circles</button>
            <button class="btn btn-sm btn-outline" id="filter-my-circles" onclick="filterCircles('my-circles')">My Circles</button>
            <button class="btn btn-sm btn-outline" id="filter-public" onclick="filterCircles('public')">Public</button>
        </div>

        <div id="circlesContainer" class="grid grid-3">
            <div class="text-center text-muted">Loading circles...</div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>
</div>

<!-- Create Circle Modal -->
<div id="createCircleModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Create Circle</h3>
            <button class="modal-close" onclick="closeModal('createCircleModal')">&times;</button>
        </div>
        <form id="createCircleForm" onsubmit="handleCreateCircle(event)">
            <div class="form-group">
                <label class="form-label">Circle Name</label>
                <input type="text" class="form-input" name="circle_name" placeholder="E.g., Real Estate Fund" required>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" name="description" placeholder="What is this circle about?"></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Target Amount</label>
                <input type="number" class="form-input" name="target_amount" placeholder="0.00" step="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Max Members (Optional)</label>
                <input type="number" class="form-input" name="max_members" placeholder="Leave empty for unlimited">
            </div>
            <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" name="category">
                    <option value="Real Estate">Real Estate</option>
                    <option value="Education">Education</option>
                    <option value="Business">Business</option>
                    <option value="Travel">Travel</option>
                    <option value="General">General</option>
                </select>
            </div>
            <div class="form-group flex items-center justify-between">
                <label class="form-label" style="margin-bottom: 0;">Make Public</label>
                <div class="toggle active" onclick="toggleElement(this)">
                    <div class="toggle-thumb"></div>
                    <input type="hidden" name="is_public" value="1">
                </div>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Create Circle</button>
        </form>
    </div>
</div>

<!-- Join Circle Modal -->
<div id="joinCircleModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title" id="joinCircleTitle">Join Circle</h3>
            <button class="modal-close" onclick="closeModal('joinCircleModal')">&times;</button>
        </div>
        <div id="joinCircleContent"></div>
        <form id="joinCircleForm" onsubmit="handleJoinCircle(event)">
            <input type="hidden" name="circle_id" id="joinCircleId">
            <button type="submit" class="btn btn-primary" style="width: 100%;">Join Circle</button>
        </form>
    </div>
</div>

<!-- Contribute Modal -->
<div id="contributeModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title" id="contributeModalTitle">Contribute</h3>
            <button class="modal-close" onclick="closeModal('contributeModal')">&times;</button>
        </div>
        <form id="contributeForm" onsubmit="handleContribute(event)">
            <input type="hidden" name="circle_id" id="contributeCircleId">
            <div class="form-group">
                <label class="form-label">Amount</label>
                <input type="number" class="form-input" name="amount" placeholder="0.00" step="0.01" required>
            </div>
            <p class="text-sm text-muted mb-4">Funds will be transferred from your main balance</p>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Contribute</button>
        </form>
    </div>
</div>

<script>
let currentFilter = 'all';

async function loadCircles(filter = 'all') {
    const container = document.getElementById('circlesContainer');
    container.innerHTML = '<div class="text-center text-muted">Loading circles...</div>';

    try {
        const response = await api.getCircles(filter);
        if (response.success) {
            displayCircles(response.data);
        } else {
            container.innerHTML = '<div class="text-center text-muted">Failed to load circles</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="text-center text-muted">Error loading circles</div>';
    }
}

function displayCircles(circles) {
    const container = document.getElementById('circlesContainer');
    
    if (circles.length === 0) {
        container.innerHTML = `
            <div class="card text-center" style="grid-column: 1 / -1; padding: 64px 32px;">
                <h3 class="font-bold mb-4">No Circles Found</h3>
                <p class="text-muted mb-6">Create your first circle or explore public circles</p>
                <button class="btn btn-primary" onclick="openModal('createCircleModal')">Create Circle</button>
            </div>
        `;
        return;
    }

    container.innerHTML = circles.map(circle => {
        const progress = circle.target_amount > 0 ? (circle.current_amount / circle.target_amount) * 100 : 0;
        const progressPercent = Math.min(progress, 100);
        
        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">${circle.circle_name}</div>
                        <div class="text-sm text-muted">${circle.category || 'General'}</div>
                    </div>
                    <span class="badge badge-${circle.status === 'active' ? 'success' : 'primary'}">
                        ${circle.status}
                    </span>
                </div>

                <p class="text-sm text-muted mb-4">${circle.description || 'No description'}</p>

                <div class="mb-4">
                    <div class="flex justify-between mb-2">
                        <span class="text-sm text-muted">Progress</span>
                        <span class="text-sm font-bold">${progressPercent.toFixed(1)}%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar" style="width: ${progressPercent}%;"></div>
                    </div>
                </div>

                <div class="flex justify-between mb-4">
                    <div>
                        <div class="text-sm text-muted">Raised</div>
                        <div class="font-bold">${formatCurrency(circle.current_amount)}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-muted">Members</div>
                        <div class="font-bold">${circle.member_count}</div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button class="btn btn-primary btn-sm" onclick="contributeToCircle(${circle.id}, '${circle.circle_name}')">Contribute</button>
                    <button class="btn btn-outline btn-sm" onclick="viewCircle(${circle.id})">View</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterCircles(filter) {
    currentFilter = filter;
    
    // Update button states
    document.getElementById('filter-all').className = filter === 'all' ? 'btn btn-sm' : 'btn btn-sm btn-outline';
    document.getElementById('filter-my-circles').className = filter === 'my-circles' ? 'btn btn-sm' : 'btn btn-sm btn-outline';
    document.getElementById('filter-public').className = filter === 'public' ? 'btn btn-sm' : 'btn btn-sm btn-outline';
    
    loadCircles(filter);
}

async function handleCreateCircle(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const toggleElement = form.querySelector('.toggle');
    const isPublic = toggleElement.classList.contains('active') ? 1 : 0;
    
    const data = {
        circle_name: formData.get('circle_name'),
        description: formData.get('description'),
        target_amount: parseFloat(formData.get('target_amount')),
        max_members: formData.get('max_members') || null,
        category: formData.get('category'),
        is_public: isPublic
    };

    try {
        const response = await api.createCircle(data);
        if (response.success) {
            showToast('Circle created successfully!', 'success');
            closeModal('createCircleModal');
            form.reset();
            loadCircles(currentFilter);
        } else {
            showToast(response.message || 'Failed to create circle', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

function contributeToCircle(circleId, circleName) {
    document.getElementById('contributeCircleId').value = circleId;
    document.getElementById('contributeModalTitle').textContent = `Contribute to ${circleName}`;
    openModal('contributeModal');
}

async function handleContribute(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const circleId = formData.get('circle_id');
    const amount = parseFloat(formData.get('amount'));

    try {
        const response = await api.contributeToCircle(circleId, amount);
        if (response.success) {
            showToast('Contribution successful!', 'success');
            closeModal('contributeModal');
            form.reset();
            refreshBalances();
            loadCircles(currentFilter);
        } else {
            showToast(response.message || 'Failed to contribute', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

async function viewCircle(circleId) {
    showToast('Detailed circle view coming soon!', 'success');
}

// Handle toggle in form
document.addEventListener('click', (e) => {
    if (e.target.closest('.toggle')) {
        const toggle = e.target.closest('.toggle');
        const input = toggle.querySelector('input[type="hidden"]');
        if (input) {
            input.value = toggle.classList.contains('active') ? '1' : '0';
        }
    }
});

// Load circles on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCircles('all');
});
</script>
