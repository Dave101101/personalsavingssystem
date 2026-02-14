<?php
require_once 'config/session.php';
$pageTitle = 'Settings - First Groups Accounting';
$user = getCurrentUser();

include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content-wrapper">
    <?php include 'includes/topnav.php'; ?>
    
    <main>
        <div class="page-header">
            <h1>Settings</h1>
            <p>Manage your profile and app preferences</p>
        </div>

        <!-- Profile Card -->
        <div class="card mb-6" style="max-width: 600px;">
            <div class="text-center">
                <div class="user-avatar" style="width: 96px; height: 96px; font-size: 32px; margin: 0 auto 24px;">
                    <?php echo strtoupper(substr($user['name'], 0, 2)); ?>
                </div>
                <h3 class="font-bold mb-2"><?php echo htmlspecialchars($user['name']); ?></h3>
                <p class="text-muted text-sm mb-6"><?php echo htmlspecialchars($user['email']); ?></p>
                <div class="flex gap-3 justify-center">
                    <button class="btn btn-primary" onclick="openModal('editProfileModal')">Edit Profile</button>
                    <button class="btn btn-outline">Account Status</button>
                </div>
            </div>
        </div>

        <!-- Settings Sections -->
        <div style="max-width: 800px;">
            <h3 class="font-bold mb-4">Preferences</h3>
            
            <div class="grid grid-2 gap-4" id="settingsContainer">
                <div class="text-center text-muted">Loading settings...</div>
            </div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>
</div>

<!-- Edit Profile Modal -->
<div id="editProfileModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Edit Profile</h3>
            <button class="modal-close" onclick="closeModal('editProfileModal')">&times;</button>
        </div>
        <form id="editProfileForm" onsubmit="handleEditProfile(event)">
            <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" name="name" value="<?php echo htmlspecialchars($user['name']); ?>" required>
            </div>
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
            </div>
            <div class="form-group">
                <label class="form-label">Phone</label>
                <input type="tel" class="form-input" name="phone" value="<?php echo htmlspecialchars($user['phone'] ?? ''); ?>">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Save Changes</button>
        </form>
    </div>
</div>

<script>
const settingsConfig = [
    {
        key: 'notifications_enabled',
        label: 'Email Notifications',
        description: 'Receive weekly reports',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
        color: 'blue'
    },
    {
        key: 'push_notifications',
        label: 'Push Notifications',
        description: 'Real-time alerts',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
        color: 'purple'
    },
    {
        key: 'biometric_auth',
        label: 'Biometric Login',
        description: 'Use fingerprint or face ID',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>`,
        color: 'green'
    },
    {
        key: 'auto_save',
        label: 'Auto Save',
        description: 'Automatic savings deposits',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
        color: 'orange'
    }
];

let currentSettings = {};

async function loadSettings() {
    try {
        const response = await api.getSettings();
        if (response.success) {
            currentSettings = response.data;
            displaySettings();
        } else {
            document.getElementById('settingsContainer').innerHTML = 
                '<div class="text-center text-muted">Failed to load settings</div>';
        }
    } catch (error) {
        document.getElementById('settingsContainer').innerHTML = 
            '<div class="text-center text-muted">Error loading settings</div>';
    }
}

function displaySettings() {
    const container = document.getElementById('settingsContainer');
    
    container.innerHTML = settingsConfig.map(setting => {
        const isActive = currentSettings[setting.key] === 'true';
        
        return `
            <div class="card">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="icon-btn" style="background: ${getColorBg(setting.color)}; color: ${getColor(setting.color)};">
                            ${setting.icon}
                        </div>
                        <div>
                            <div class="font-bold text-sm">${setting.label}</div>
                            <div class="text-muted text-sm">${setting.description}</div>
                        </div>
                    </div>
                    <div class="toggle ${isActive ? 'active' : ''}" onclick="toggleSetting('${setting.key}', this)">
                        <div class="toggle-thumb"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getColor(color) {
    const colors = {
        blue: '#2563EB',
        purple: '#9333EA',
        green: '#16A34A',
        orange: '#EA580C'
    };
    return colors[color] || '#6366F1';
}

function getColorBg(color) {
    const colors = {
        blue: '#DBEAFE',
        purple: '#F3E8FF',
        green: '#DCFCE7',
        orange: '#FFEDD5'
    };
    return colors[color] || '#E0E7FF';
}

async function toggleSetting(key, element) {
    const isActive = element.classList.contains('active');
    const newValue = isActive ? 'false' : 'true';
    
    try {
        const response = await api.updateSettings({ [key]: newValue });
        if (response.success) {
            currentSettings[key] = newValue;
            showToast('Setting updated', 'success');
        } else {
            showToast('Failed to update setting', 'error');
            // Revert toggle
            if (isActive) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        }
    } catch (error) {
        showToast('An error occurred', 'error');
        // Revert toggle
        if (isActive) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    }
}

async function handleEditProfile(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };

    try {
        const response = await api.updateUserProfile(data);
        if (response.success) {
            showToast('Profile updated successfully!', 'success');
            closeModal('editProfileModal');
            setTimeout(() => location.reload(), 1000);
        } else {
            showToast(response.message || 'Failed to update profile', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});
</script>
