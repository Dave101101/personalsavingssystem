<?php
$user = getCurrentUser();
?>
<header class="top-nav">
    <div class="search-box">
        <input type="text" class="search-input" placeholder="Search transactions, plans, or investments..." id="globalSearch">
    </div>
    
    <div class="top-nav-actions">
        <button class="icon-btn" data-tooltip="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </button>
        
        <button class="icon-btn" onclick="quickSave()" data-tooltip="Quick Save">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        </button>
        
        <div class="user-avatar" data-tooltip="<?php echo htmlspecialchars($user['name']); ?>">
            <?php echo strtoupper(substr($user['name'], 0, 2)); ?>
        </div>
    </div>
</header>
