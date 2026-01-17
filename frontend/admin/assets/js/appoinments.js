/* =========================================
   ADMIN APPOINTMENTS - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // ===== SEARCH & FILTER =====
    const searchInput = document.getElementById('searchAppointments');
    const statusFilter = document.getElementById('filterStatus');
    const staffFilter = document.getElementById('filterStaff');
    const dateFilter = document.getElementById('filterDate');
    const serviceFilter = document.getElementById('filterService');
    const resetBtn = document.getElementById('resetFilters');
    const tableRows = document.querySelectorAll('#appointmentsTable tbody tr');

    const filterTable = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value.toLowerCase();
        const staffValue = staffFilter.value.toLowerCase();
        const dateValue = dateFilter.value;
        const serviceValue = serviceFilter.value.toLowerCase();
        let visibleCount = 0;

        tableRows.forEach(row => {
            const customerName = row.querySelector('.fw-semibold').textContent.toLowerCase();
            const service = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
            const staff = row.querySelector('td:nth-child(6)').textContent.toLowerCase();
            const status = row.querySelector('td:nth-child(9)').textContent.toLowerCase();
            const appointmentDate = row.querySelector('td:nth-child(3) .fw-semibold').textContent;

            const matchesSearch = customerName.includes(searchTerm) || service.includes(searchTerm);
            const matchesStatus = !statusValue || status.includes(statusValue);
            const matchesStaff = !staffValue || staff.toLowerCase().includes(staffValue);
            const matchesService = !serviceValue || service.includes(serviceValue);
            const matchesDate = !dateValue || appointmentDate.includes(dateValue);

            if (matchesSearch && matchesStatus && matchesStaff && matchesService && matchesDate) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        document.getElementById('appointmentsCount').textContent = `${visibleCount} Appointments`;
    };

    if (searchInput) searchInput.addEventListener('input', filterTable);
    if (statusFilter) statusFilter.addEventListener('change', filterTable);
    if (staffFilter) staffFilter.addEventListener('change', filterTable);
    if (dateFilter) dateFilter.addEventListener('change', filterTable);
    if (serviceFilter) serviceFilter.addEventListener('change', filterTable);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            statusFilter.value = '';
            staffFilter.value = '';
            dateFilter.value = '';
            serviceFilter.value = '';
            filterTable();
        });
    }

    // ===== SELECT ALL CHECKBOX =====
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('#appointmentsTable tbody input[type="checkbox"]');

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

    // ===== SAVE APPOINTMENT =====
    const saveAppointmentBtn = document.getElementById('saveAppointment');
    if (saveAppointmentBtn) {
        saveAppointmentBtn.addEventListener('click', () => {
            const form = document.getElementById('addAppointmentForm');
            if (form.checkValidity()) {
                AdminUtils.showToast('Appointment created successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('addAppointmentModal')).hide();
                form.reset();
                setTimeout(() => location.reload(), 1000);
            } else {
                form.reportValidity();
            }
        });
    }

    // ===== CANCEL APPOINTMENT =====
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            AdminUtils.confirmAction('Are you sure you want to cancel this appointment?', () => {
                const row = btn.closest('tr');
                const statusBadge = row.querySelector('td:nth-child(9) .badge');
                statusBadge.className = 'badge bg-danger';
                statusBadge.textContent = 'Cancelled';
                AdminUtils.showToast('Appointment cancelled successfully', 'success');
            });
        });
    });

    // ===== DELETE APPOINTMENT =====
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            AdminUtils.confirmAction('Are you sure you want to delete this appointment?', () => {
                const row = btn.closest('tr');
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    AdminUtils.showToast('Appointment deleted successfully', 'success');
                    filterTable();
                }, 300);
            });
        });
    });

    // ===== CALENDAR VIEW =====
    const calendarViewBtn = document.getElementById('calendarViewBtn');
    if (calendarViewBtn) {
        calendarViewBtn.addEventListener('click', () => {
            AdminUtils.showToast('Calendar view coming soon!', 'info');
        });
    }

    // ===== EXPORT =====
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            AdminUtils.showToast('Exporting appointments...', 'info');
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

    // ===== SET TODAY'S DATE AS DEFAULT =====
    if (dateFilter) {
        const today = new Date().toISOString().split('T')[0];
        dateFilter.max = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
    }

    console.log('%c📅 Appointments Management Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});