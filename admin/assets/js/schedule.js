/* =========================================
   ADMIN SCHEDULE - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // ===== ENABLE/DISABLE BUSINESS HOURS =====
    const enableBusinessHours = document.getElementById('enableBusinessHours');
    if (enableBusinessHours) {
        enableBusinessHours.addEventListener('change', function() {
            const allInputs = document.querySelectorAll('.business-hours-item input, .business-hours-item select, .business-hours-item button');
            allInputs.forEach(input => {
                if (!input.id || !input.id.includes('day')) {
                    input.disabled = !this.checked;
                }
            });
        });
    }

    // ===== DAY CHECKBOX TOGGLE =====
    const dayCheckboxes = document.querySelectorAll('.business-hours-item .form-check-input[type="checkbox"]');
    dayCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const item = this.closest('.business-hours-item');
            const inputs = item.querySelectorAll('input[type="time"], select, button');
            inputs.forEach(input => {
                input.disabled = !this.checked;
            });
        });
    });

    // ===== SAVE ALL SETTINGS =====
    const saveAllBtn = document.getElementById('saveAllSettings');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', () => {
            AdminUtils.showToast('Schedule settings saved successfully!', 'success');
        });
    }

    // ===== ADD HOLIDAY =====
    const saveHolidayBtn = document.getElementById('saveHoliday');
    if (saveHolidayBtn) {
        saveHolidayBtn.addEventListener('click', () => {
            const form = document.getElementById('addHolidayForm');
            if (form.checkValidity()) {
                AdminUtils.showToast('Holiday added successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('addHolidayModal')).hide();
                form.reset();
                setTimeout(() => location.reload(), 1000);
            } else {
                form.reportValidity();
            }
        });
    }

    // ===== DELETE HOLIDAY =====
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            AdminUtils.confirmAction('Are you sure you want to delete this holiday?', () => {
                const row = btn.closest('tr');
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    AdminUtils.showToast('Holiday deleted successfully', 'success');
                }, 300);
            });
        });
    });

    // ===== AUTO-SAVE INDICATOR =====
    const allInputs = document.querySelectorAll('input, select, .form-check-input');
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

    console.log('%c⏰ Schedule Settings Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});