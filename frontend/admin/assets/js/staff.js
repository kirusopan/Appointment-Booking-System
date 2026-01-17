/* =========================================
   ADMIN STAFF - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // ===== SEARCH & FILTER =====
    const searchInput = document.getElementById('searchStaff');
    const statusFilter = document.getElementById('filterStatus');
    const roleFilter = document.getElementById('filterRole');
    const resetBtn = document.getElementById('resetFilters');
    const tableRows = document.querySelectorAll('#staffTable tbody tr');

    const filterTable = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value.toLowerCase();
        const roleValue = roleFilter.value.toLowerCase();
        let visibleCount = 0;

        tableRows.forEach(row => {
            const staffName = row.querySelector('.fw-semibold').textContent.toLowerCase();
            const staffEmail = row.querySelector('small.text-muted').textContent.toLowerCase();
            const role = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const status = row.querySelector('td:nth-child(8)').textContent.toLowerCase();

            const matchesSearch = staffName.includes(searchTerm) || staffEmail.includes(searchTerm);
            const matchesStatus = !statusValue || status.includes(statusValue);
            const matchesRole = !roleValue || role.includes(roleValue);

            if (matchesSearch && matchesStatus && matchesRole) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        document.getElementById('staffCount').textContent = `${visibleCount} Staff`;
    };

    if (searchInput) searchInput.addEventListener('input', filterTable);
    if (statusFilter) statusFilter.addEventListener('change', filterTable);
    if (roleFilter) roleFilter.addEventListener('change', filterTable);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            statusFilter.value = '';
            roleFilter.value = '';
            filterTable();
        });
    }

    // ===== SELECT ALL CHECKBOX =====
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('#staffTable tbody input[type="checkbox"]');

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
            const anyChecked = Array.from(rowCheckboxes).some(cb => cb.checked);
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = anyChecked && !allChecked;
        });
    });

    // ===== SAVE STAFF =====
    const saveStaffBtn = document.getElementById('saveStaff');
    if (saveStaffBtn) {
        saveStaffBtn.addEventListener('click', () => {
            const form = document.getElementById('addStaffForm');
            if (form.checkValidity()) {
                AdminUtils.showToast('Staff member added successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('addStaffModal')).hide();
                form.reset();
                setTimeout(() => location.reload(), 1000);
            } else {
                form.reportValidity();
            }
        });
    }

    // ===== DELETE STAFF =====
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            AdminUtils.confirmAction('Are you sure you want to delete this staff member?', () => {
                const row = btn.closest('tr');
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    AdminUtils.showToast('Staff member deleted successfully', 'success');
                    filterTable();
                }, 300);
            });
        });
    });

    // ===== TABLE ROW HOVER =====
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--light)';
        });
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    console.log('%c👥 Staff Management Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});