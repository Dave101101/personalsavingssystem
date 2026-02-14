// Main JavaScript Functions

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format Currency
function formatCurrency(amount) {
    return '₦' + parseFloat(amount).toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Toggle Functions
function toggleElement(element) {
    if (element.classList.contains('active')) {
        element.classList.remove('active');
    } else {
        element.classList.add('active');
    }
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Loading State
function setLoading(element, loading = true) {
    if (loading) {
        element.disabled = true;
        element.innerHTML = '<div class="spinner"></div>';
    } else {
        element.disabled = false;
    }
}

// Calculate Progress
function calculateProgress(current, target) {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
}

// Update Progress Bar
function updateProgressBar(element, percentage) {
    if (element) {
        element.style.width = percentage + '%';
    }
}

// Search Filter
function searchFilter(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    
    if (!input || !list) return;
    
    input.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = list.querySelectorAll('[data-searchable]');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Auto-refresh balances
async function refreshBalances() {
    try {
        const response = await api.getAccounts();
        if (response.success) {
            response.data.forEach(account => {
                const element = document.getElementById(`balance-${account.account_type}`);
                if (element) {
                    element.textContent = formatCurrency(account.balance);
                }
            });
        }
    } catch (error) {
        console.error('Failed to refresh balances:', error);
    }
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const text = e.target.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
    }
}

// Quick Save Function
async function quickSave() {
    const amount = prompt('Enter amount to save:');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    try {
        const response = await api.updateBalance('stash', parseFloat(amount), 'add', 'Quick Save', 'Quick save deposit');
        
        if (response.success) {
            showToast(`Successfully saved ${formatCurrency(amount)}!`, 'success');
            refreshBalances();
        } else {
            showToast(response.message || 'Failed to save', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initTooltips();
    
    // Auto-refresh balances every 30 seconds
    setInterval(refreshBalances, 30000);
    
    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop().replace('.php', '') || 'dashboard';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('.php', '');
        if (href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
});
