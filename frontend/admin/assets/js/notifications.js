/* =========================================
   ADMIN NOTIFICATIONS - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // ===== SAVE EMAIL SETTINGS =====
    const saveEmailSettingsBtn = document.getElementById('saveEmailSettings');
    if (saveEmailSettingsBtn) {
        saveEmailSettingsBtn.addEventListener('click', () => {
            AdminUtils.showToast('Email settings saved successfully!', 'success');
        });
    }

    // ===== SAVE NOTIFICATION SETTINGS =====
    const saveNotificationSettingsBtn = document.getElementById('saveNotificationSettings');
    if (saveNotificationSettingsBtn) {
        saveNotificationSettingsBtn.addEventListener('click', () => {
            AdminUtils.showToast('Notification settings saved successfully!', 'success');
        });
    }

    // ===== SEND TEST EMAIL =====
    const sendTestEmailBtn = document.getElementById('sendTestEmail');
    if (sendTestEmailBtn) {
        sendTestEmailBtn.addEventListener('click', () => {
            AdminUtils.showToast('Sending test email...', 'info');
            setTimeout(() => {
                AdminUtils.showToast('Test email sent successfully!', 'success');
            }, 2000);
        });
    }

    // ===== SAVE TEMPLATE =====
    const saveTemplateBtn = document.getElementById('saveTemplate');
    if (saveTemplateBtn) {
        saveTemplateBtn.addEventListener('click', () => {
            const form = document.getElementById('addTemplateForm');
            if (form.checkValidity()) {
                AdminUtils.showToast('Email template created successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('addTemplateModal')).hide();
                form.reset();
                setTimeout(() => location.reload(), 1000);
            } else {
                form.reportValidity();
            }
        });
    }

    // ===== DELETE TEMPLATE =====
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            AdminUtils.confirmAction('Are you sure you want to delete this template?', () => {
                const row = btn.closest('tr');
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    AdminUtils.showToast('Template deleted successfully', 'success');
                }, 300);
            });
        });
    });

    // ===== TABLE ROW HOVER =====
    const tableRows = document.querySelectorAll('#templatesTable tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--light)';
        });
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    console.log('%c📧 Notifications Management Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});