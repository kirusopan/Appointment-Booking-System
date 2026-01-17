/* =========================================
   ADMIN SETTINGS - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // ===== SAVE ALL SETTINGS =====
    const saveAllBtn = document.getElementById('saveAllSettings');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', () => {
            AdminUtils.showToast('All settings saved successfully!', 'success');
        });
    }

    // ===== TRACK UNSAVED CHANGES =====
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('change', () => {
            const saveBtn = document.getElementById('saveAllSettings');
            if (saveBtn && !saveBtn.classList.contains('btn-warning')) {
                saveBtn.classList.remove('btn-primary');
                saveBtn.classList.add('btn-warning');
                saveBtn.innerHTML = '<i class="bi bi-exclamation-circle me-2"></i>Unsaved Changes';
            }
        });
    });

    // ===== CLEAR CACHE =====
    const clearCacheBtn = document.querySelector('.btn-outline-primary');
    if (clearCacheBtn && clearCacheBtn.textContent.includes('Clear Cache')) {
        clearCacheBtn.addEventListener('click', () => {
            AdminUtils.showToast('Clearing cache...', 'info');
            setTimeout(() => {
                AdminUtils.showToast('Cache cleared successfully!', 'success');
            }, 1500);
        });
    }

    // ===== OPTIMIZE DATABASE =====
    const optimizeDbBtn = document.querySelector('.btn-outline-warning');
    if (optimizeDbBtn && optimizeDbBtn.textContent.includes('Optimize')) {
        optimizeDbBtn.addEventListener('click', () => {
            AdminUtils.showToast('Optimizing database...', 'info');
            setTimeout(() => {
                AdminUtils.showToast('Database optimized successfully!', 'success');
            }, 2000);
        });
    }

    // ===== BACKUP DATABASE =====
    const backupBtn = document.querySelector('.btn-outline-success');
    if (backupBtn && backupBtn.textContent.includes('Backup')) {
        backupBtn.addEventListener('click', () => {
            AdminUtils.showToast('Creating database backup...', 'info');
            setTimeout(() => {
                AdminUtils.showToast('Backup created successfully!', 'success');
            }, 2500);
        });
    }

    // ===== RESTORE DATABASE =====
    const restoreBtn = document.querySelector('.btn-outline-danger');
    if (restoreBtn && restoreBtn.textContent.includes('Restore')) {
        restoreBtn.addEventListener('click', () => {
            AdminUtils.confirmAction('Are you sure you want to restore the database? This will overwrite current data.', () => {
                AdminUtils.showToast('Restoring database...', 'info');
            });
        });
    }

    // ===== UPLOAD LOGO =====
    const uploadLogoBtn = document.querySelectorAll('.logo-upload .btn');
    uploadLogoBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            AdminUtils.showToast('Upload functionality will be implemented in backend', 'info');
        });
    });

    // ===== MAINTENANCE MODE WARNING =====
    const maintenanceMode = document.getElementById('maintenanceMode');
    if (maintenanceMode) {
        maintenanceMode.addEventListener('change', function() {
            if (this.checked) {
                AdminUtils.confirmAction('Are you sure you want to enable maintenance mode? Users will not be able to access the site.', () => {
                    AdminUtils.showToast('Maintenance mode enabled', 'warning');
                });
            } else {
                AdminUtils.showToast('Maintenance mode disabled', 'success');
            }
        });
    }

    // ===== DEBUG MODE WARNING =====
    const debugMode = document.getElementById('enableDebug');
    if (debugMode) {
        debugMode.addEventListener('change', function() {
            if (this.checked) {
                AdminUtils.showToast('Debug mode enabled - Not recommended for production!', 'warning');
            }
        });
    }

    console.log('%c⚙️ System Settings Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});