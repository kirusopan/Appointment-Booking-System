/* =========================================
   ADMIN USERS - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // ===== SEARCH & FILTER =====
    const searchInput = document.getElementById('searchUsers');
    const roleFilter = document.getElementById('filterRole');
    const statusFilter = document.getElementById('filterStatus');
    const resetBtn = document.getElementById('resetFilters');
    const tableRows = document.querySelectorAll('#usersTable tbody tr');

    const filterTable = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const roleValue = roleFilter.value.toLowerCase();
        const statusValue = statusFilter.value.toLowerCase();
        let visibleCount = 0;

        tableRows.forEach(row => {
            const userName = row.querySelector('.fw-semibold').textContent.toLowerCase();
            const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const role = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            const status = row.querySelector('td:nth-child(7)').textContent.toLowerCase();

            const matchesSearch = userName.includes(searchTerm) || email.includes(searchTerm);
            const matchesRole = !roleValue || role.includes(roleValue);
            const matchesStatus = !statusValue || status.includes(statusValue);

            if (matchesSearch && matchesRole && matchesStatus) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        document.getElementById('usersCount').textContent = `${visibleCount} Users`;
    };

    if (searchInput) searchInput.addEventListener('input', filterTable);
    if (roleFilter) roleFilter.addEventListener('change', filterTable);
    if (statusFilter) statusFilter.addEventListener('change', filterTable);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            roleFilter.value = '';
            statusFilter.value = '';
            filterTable();
        });
    }

    // ===== SELECT ALL CHECKBOX =====
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('#usersTable tbody input[type="checkbox"]');

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

    // ===== SAVE USER =====
    const saveUserBtn = document.getElementById('saveUser');
    if (saveUserBtn) {
        saveUserBtn.addEventListener('click', () => {
            const form = document.getElementById('addUserForm');
            if (form.checkValidity()) {
                AdminUtils.showToast('User added successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
                form.reset();
                setTimeout(() => location.reload(), 1000);
            } else {
                form.reportValidity();
            }
        });
    }

    // ===== DELETE USER =====
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.disabled) return;
            
            AdminUtils.confirmAction('Are you sure you want to delete this user?', () => {
                const row = btn.closest('tr');
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    AdminUtils.showToast('User deleted successfully', 'success');
                    filterTable();
                }, 300);
            });
        });
    });

    // ===== EXPORT USERS =====
    const exportBtn = document.getElementById('exportUsers');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            AdminUtils.showToast('Exporting users data...', 'info');
        });
    }

    // ===== TABLE ROW HOVER =====
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--light)';
        });
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    console.log('%c👤 Users Management Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});