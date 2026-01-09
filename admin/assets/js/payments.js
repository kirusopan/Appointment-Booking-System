/* =========================================
   ADMIN PAYMENTS - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // ===== REVENUE CHART =====
    const revenueChartCtx = document.getElementById('revenueChart');
    if (revenueChartCtx) {
        new Chart(revenueChartCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [5200, 6800, 5900, 7200, 8100, 9500],
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            borderDash: [5, 5],
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // ===== SEARCH & FILTER =====
    const searchInput = document.getElementById('searchPayments');
    const statusFilter = document.getElementById('filterStatus');
    const methodFilter = document.getElementById('filterMethod');
    const dateFilter = document.getElementById('filterDate');
    const amountFilter = document.getElementById('filterAmount');
    const resetBtn = document.getElementById('resetFilters');
    const tableRows = document.querySelectorAll('#paymentsTable tbody tr');

    const filterTable = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value.toLowerCase();
        const methodValue = methodFilter.value.toLowerCase();
        const dateValue = dateFilter.value;
        const amountValue = amountFilter.value;
        let visibleCount = 0;

        tableRows.forEach(row => {
            const txnId = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const customerName = row.querySelector('.fw-semibold').textContent.toLowerCase();
            const status = row.querySelector('td:nth-child(8)').textContent.toLowerCase();
            const method = row.querySelector('.payment-method span').textContent.toLowerCase();
            const amount = parseFloat(row.querySelector('td:nth-child(7)').textContent.replace(/[$,]/g, ''));

            const matchesSearch = txnId.includes(searchTerm) || customerName.includes(searchTerm);
            const matchesStatus = !statusValue || status.includes(statusValue);
            const matchesMethod = !methodValue || method.includes(methodValue);
            
            let matchesAmount = true;
            if (amountValue) {
                if (amountValue === '0-50') matchesAmount = amount >= 0 && amount <= 50;
                else if (amountValue === '50-100') matchesAmount = amount > 50 && amount <= 100;
                else if (amountValue === '100-200') matchesAmount = amount > 100 && amount <= 200;
                else if (amountValue === '200+') matchesAmount = amount > 200;
            }

            if (matchesSearch && matchesStatus && matchesMethod && matchesAmount) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        document.getElementById('paymentsCount').textContent = `${visibleCount} Payments`;
    };

    if (searchInput) searchInput.addEventListener('input', filterTable);
    if (statusFilter) statusFilter.addEventListener('change', filterTable);
    if (methodFilter) methodFilter.addEventListener('change', filterTable);
    if (dateFilter) dateFilter.addEventListener('change', filterTable);
    if (amountFilter) amountFilter.addEventListener('change', filterTable);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            statusFilter.value = '';
            methodFilter.value = '';
            dateFilter.value = '';
            amountFilter.value = '';
            filterTable();
        });
    }

    // ===== SELECT ALL CHECKBOX =====
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('#paymentsTable tbody input[type="checkbox"]');

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

    // ===== REFUND PAYMENT =====
    document.querySelectorAll('.btn-refund').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            AdminUtils.confirmAction('Are you sure you want to refund this payment?', () => {
                const row = btn.closest('tr');
                const statusBadge = row.querySelector('td:nth-child(8) .badge');
                statusBadge.className = 'badge bg-secondary';
                statusBadge.textContent = 'Refunded';
                AdminUtils.showToast('Payment refunded successfully', 'success');
            });
        });
    });

    // ===== DELETE PAYMENT =====
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            AdminUtils.confirmAction('Are you sure you want to delete this payment record?', () => {
                const row = btn.closest('tr');
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    AdminUtils.showToast('Payment record deleted successfully', 'success');
                    filterTable();
                }, 300);
            });
        });
    });

    // ===== EXPORT PAYMENTS =====
    const exportBtn = document.getElementById('exportPayments');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            AdminUtils.showToast('Exporting payment data...', 'info');
        });
    }

    // ===== SAVE PAYMENT SETTINGS =====
    const savePaymentSettingsBtn = document.getElementById('savePaymentSettings');
    if (savePaymentSettingsBtn) {
        savePaymentSettingsBtn.addEventListener('click', () => {
            AdminUtils.showToast('Payment settings saved successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('paymentSettingsModal')).hide();
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

    console.log('%c💳 Payments Management Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});