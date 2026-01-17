/* =========================================
   ADMIN PROFILE - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // ===== SAVE PROFILE =====
    const saveProfileBtn = document.getElementById('saveProfile');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            AdminUtils.showToast('Profile updated successfully!', 'success');
        });
    }

    // ===== UPLOAD AVATAR =====
    const uploadAvatarBtn = document.getElementById('uploadAvatar');
    if (uploadAvatarBtn) {
        uploadAvatarBtn.addEventListener('click', () => {
            AdminUtils.showToast('Avatar upload functionality will be implemented in backend', 'info');
        });
    }

    // ===== CHANGE PASSWORD =====
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            AdminUtils.showToast('Password updated successfully!', 'success');
            passwordForm.reset();
        });
    }

    // ===== DISABLE 2FA =====
    const disable2FABtn = document.querySelector('.btn-outline-danger');
    if (disable2FABtn && disable2FABtn.textContent.includes('Disable 2FA')) {
        disable2FABtn.addEventListener('click', () => {
            AdminUtils.confirmAction('Are you sure you want to disable two-factor authentication?', () => {
                AdminUtils.showToast('2FA disabled', 'warning');
            });
        });
    }

    // ===== REVOKE SESSION =====
    const revokeButtons = document.querySelectorAll('.session-item .btn-outline-danger');
    revokeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            AdminUtils.confirmAction('Are you sure you want to revoke this session?', () => {
                const sessionItem = btn.closest('.session-item');
                sessionItem.style.transition = 'all 0.3s ease';
                sessionItem.style.opacity = '0';
                setTimeout(() => {
                    sessionItem.remove();
                    AdminUtils.showToast('Session revoked successfully', 'success');
                }, 300);
            });
        });
    });

    // ===== REVOKE ALL SESSIONS =====
    const revokeAllBtn = document.querySelector('.btn-outline-danger');
    if (revokeAllBtn && revokeAllBtn.textContent.includes('Revoke All')) {
        revokeAllBtn.addEventListener('click', () => {
            AdminUtils.confirmAction('Are you sure you want to revoke all sessions? You will need to log in again.', () => {
                AdminUtils.showToast('All sessions revoked', 'success');
            });
        });
    }

    // ===== DELETE ACCOUNT =====
    const deleteAccountBtn = document.getElementById('deleteAccount');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            AdminUtils.confirmAction('Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.', () => {
                AdminUtils.showToast('Account deletion process initiated', 'warning');
            });
        });
    }

    // ===== TRACK UNSAVED CHANGES =====
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('change', () => {
            const saveBtn = document.getElementById('saveProfile');
            if (saveBtn && !saveBtn.classList.contains('btn-warning')) {
                saveBtn.classList.remove('btn-primary');
                saveBtn.classList.add('btn-warning');
                saveBtn.innerHTML = '<i class="bi bi-exclamation-circle me-2"></i>Unsaved Changes';
            }
        });
    });

    console.log('%c👤 Profile Page Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});