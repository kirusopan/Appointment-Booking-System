/* =========================================
   ADMIN CUSTOMERS - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // ===== SEARCH & FILTER =====
    const searchInput = document.getElementById('searchCustomers');
    const statusFilter = document.getElementById('filterStatus');
    const sortFilter = document.getElementById('filterSort');
    const resetBtn = document.getElementById('resetFilters');
    const tableRows = document.querySelectorAll('#customersTable tbody tr');

    const filterTable = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value.toLowerCase();
        let visibleCount = 0;

        tableRows.forEach(row => {
            const customerName = row.querySelector('.fw-semibold').textContent.toLowerCase();
            const email = row.querySelector('.customer-contact div:first-child').textContent.toLowerCase();
            const phone = row.querySelector('.customer-contact div:last-child').textContent.toLowerCase();
            const status = row.querySelector('td:nth-child(8)').textContent.toLowerCase();

            const matchesSearch = customerName.includes(searchTerm) || 
                                email.includes(searchTerm) || 
                                phone.includes(searchTerm);
            const matchesStatus = !statusValue || status.includes(statusValue);

            if (matchesSearch && matchesStatus) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        document.getElementById('customersCount').textContent = `${visibleCount} Customers`;
    };

    if (searchInput) searchInput.addEventListener('input', filterTable);
    if (statusFilter) statusFilter.addEventListener('change', filterTable);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            statusFilter.value = '';
            sortFilter.value = '';
            filterTable();
        });
    }

    // ===== SORT FUNCTIONALITY =====
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            const sortValue = this.value;
            const tbody = document.querySelector('#customersTable tbody');
            const rowsArray = Array.from(tableRows);

            if (sortValue === 'name') {
                rowsArray.sort((a, b) => {
                    const nameA = a.querySelector('.fw-semibold').textContent;
                    const nameB = b.querySelector('.fw-semibold').textContent;
                    return nameA.localeCompare(nameB);
                });
            } else if (sortValue === 'bookings') {
                rowsArray.sort((a, b) => {
                    const bookingsA = parseInt(a.querySelector('td:nth-child(5) .fw-semibold').textContent);
                    const bookingsB = parseInt(b.querySelector('td:nth-child(5) .fw-semibold').textContent);
                    return bookingsB - bookingsA;
                });
            } else if (sortValue === 'revenue') {
                rowsArray.sort((a, b) => {
                    const revenueA = parseFloat(a.querySelector('td:nth-child(6)').textContent.replace(/[$,]/g, ''));
                    const revenueB = parseFloat(b.querySelector('td:nth-child(6)').textContent.replace(/[$,]/g, ''));
                    return revenueB - revenueA;
                });
            }

            rowsArray.forEach(row => tbody.appendChild(row));
        });
    }

    // ===== SELECT ALL CHECKBOX =====
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('#customersTable tbody input[type="checkbox"]');

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

    // ===== SAVE CUSTOMER =====
    const saveCustomerBtn = document.getElementById('saveCustomer');
    if (saveCustomerBtn) {
        saveCustomerBtn.addEventListener('click', () => {
            const form = document.getElementById('addCustomerForm');
            if (form.checkValidity()) {
                AdminUtils.showToast('Customer added successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('addCustomerModal')).hide();
                form.reset();
                setTimeout(() => location.reload(), 1000);
            } else {
                form.reportValidity();
            }
        });
    }

    // ===== DELETE CUSTOMER =====
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            AdminUtils.confirmAction('Are you sure you want to delete this customer?', () => {
                const row = btn.closest('tr');
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    AdminUtils.showToast('Customer deleted successfully', 'success');
                    filterTable();
                }, 300);
            });
        });
    });

    // ===== EXPORT CUSTOMERS =====
    const exportBtn = document.getElementById('exportCustomers');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            AdminUtils.showToast('Exporting customers data...', 'info');
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

    console.log('%c👥 Customers Management Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});