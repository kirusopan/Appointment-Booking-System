/* =========================================
   STAFF APPOINTMENTS PAGE SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    const appointmentItems = document.querySelectorAll('.appointment-list-item');
    const emptyResults = document.getElementById('emptyResults');

    // ===== FILTER FUNCTIONALITY =====
    const searchInput = document.getElementById('searchAppointments');
    const statusFilter = document.getElementById('statusFilterAppointments');
    const serviceFilter = document.getElementById('serviceFilterAppointments');
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    const sortByFilter = document.getElementById('sortByFilter');

    const filterAppointments = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const service = serviceFilter.value;
        const dateRange = dateRangeFilter.value;
        
        let visibleCount = 0;

        appointmentItems.forEach(item => {
            const clientName = item.querySelector('.client-name').textContent.toLowerCase();
            const itemStatus = item.getAttribute('data-status');
            const itemService = item.getAttribute('data-service');
            
            const matchesSearch = clientName.includes(searchTerm);
            const matchesStatus = status === 'all' || itemStatus === status;
            const matchesService = service === 'all' || itemService === service;
            
            if (matchesSearch && matchesStatus && matchesService) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Update results count
        updateResultsCount(visibleCount);

        // Show/hide empty state
        if (visibleCount === 0) {
            emptyResults.style.display = 'block';
        } else {
            emptyResults.style.display = 'none';
        }
    };

    const updateResultsCount = (count) => {
        const resultsCount = document.querySelector('.results-count strong');
        if (resultsCount) {
            resultsCount.textContent = count;
        }
    };

    // Apply Filters Button
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            filterAppointments();
            StaffUtils.showToast('Filters applied', 'success');
        });
    }

    // Clear Filters
    const clearFilters = () => {
        searchInput.value = '';
        statusFilter.value = 'all';
        serviceFilter.value = 'all';
        dateRangeFilter.value = 'all';
        sortByFilter.value = 'date-asc';
        filterAppointments();
    };

    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const clearFiltersEmpty = document.getElementById('clearFiltersEmpty');
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearFilters();
            StaffUtils.showToast('Filters cleared', 'info');
        });
    }

    if (clearFiltersEmpty) {
        clearFiltersEmpty.addEventListener('click', clearFilters);
    }

    // Real-time search
    if (searchInput) {
        searchInput.addEventListener('input', filterAppointments);
    }

    // ===== SORTING =====
    if (sortByFilter) {
        sortByFilter.addEventListener('change', function() {
            const sortType = this.value;
            sortAppointments(sortType);
        });
    }

    const sortAppointments = (sortType) => {
        const container = document.getElementById('appointmentsList');
        const items = Array.from(appointmentItems);

        items.sort((a, b) => {
            if (sortType === 'date-asc') {
                return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
            } else if (sortType === 'date-desc') {
                return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
            } else if (sortType === 'client') {
                const nameA = a.querySelector('.client-name').textContent;
                const nameB = b.querySelector('.client-name').textContent;
                return nameA.localeCompare(nameB);
            } else if (sortType === 'price') {
                const priceA = parseInt(a.querySelector('.price-amount').textContent.replace('$', ''));
                const priceB = parseInt(b.querySelector('.price-amount').textContent.replace('$', ''));
                return priceB - priceA;
            }
        });

        items.forEach(item => container.appendChild(item));
        StaffUtils.showToast(`Sorted by: ${sortType}`, 'info');
    };

    // ===== VIEW TOGGLE =====
    const viewOptionBtns = document.querySelectorAll('.view-option-btn');
    const appointmentsList = document.getElementById('appointmentsList');

    viewOptionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewOptionBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            
            if (view === 'grid') {
                appointmentsList.style.display = 'grid';
                appointmentsList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
                appointmentsList.style.gap = '1rem';
                appointmentItems.forEach(item => {
                    item.style.flexDirection = 'column';
                    item.style.border = '2px solid var(--light)';
                    item.style.borderRadius = '1rem';
                });
                StaffUtils.showToast('Switched to grid view', 'info');
            } else {
                appointmentsList.style.display = 'flex';
                appointmentsList.style.gridTemplateColumns = '';
                appointmentsList.style.gap = '';
                appointmentItems.forEach(item => {
                    item.style.flexDirection = '';
                    item.style.border = '';
                    item.style.borderRadius = '';
                });
                StaffUtils.showToast('Switched to list view', 'info');
            }
        });
    });

    // ===== APPOINTMENT ACTIONS =====
    
    // View Details
    const viewBtns = document.querySelectorAll('.btn-view');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.appointment-list-item');
            const clientName = item.querySelector('.client-name').textContent;
            const serviceName = item.querySelector('.service-name').textContent;
            
            StaffUtils.showToast(`Viewing details for ${clientName}`, 'info');
            // Open details modal
        });
    });

    // Edit Appointment
    const editBtns = document.querySelectorAll('.btn-edit');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.appointment-list-item');
            const serviceName = item.querySelector('.service-name').textContent;
            
            StaffUtils.showToast(`Editing: ${serviceName}`, 'info');
            // Open edit modal
        });
    });

    // Start Session
    const startBtns = document.querySelectorAll('.btn-start');
    startBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.appointment-list-item');
            const clientName = item.querySelector('.client-name').textContent;
            const serviceName = item.querySelector('.service-name').textContent;
            
            if (confirm(`Start session with ${clientName} for ${serviceName}?`)) {
                StaffUtils.showToast(`Session started with ${clientName}`, 'success');
                
                // Change button
                this.innerHTML = '<i class="bi bi-stop-circle"></i>';
                this.classList.add('btn-stop');
                this.title = 'End Session';
            }
        });
    });

    // Accept Pending
    const acceptBtns = document.querySelectorAll('.btn-accept');
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.appointment-list-item');
            const clientName = item.querySelector('.client-name').textContent;
            
            if (confirm(`Accept appointment request from ${clientName}?`)) {
                // Update status
                item.classList.remove('pending');
                item.classList.add('upcoming');
                item.setAttribute('data-status', 'confirmed');
                
                // Update status badge
                const statusBadge = item.querySelector('.status-badge');
                statusBadge.className = 'status-badge badge-confirmed';
                statusBadge.innerHTML = '<i class="bi bi-check-circle"></i> Confirmed';
                
                // Update date badge
                const dateBadge = item.querySelector('.date-badge');
                dateBadge.classList.remove('pending-badge');
                dateBadge.classList.add('upcoming-badge');
                
                // Replace action buttons
                const actionsCol = item.querySelector('.appointment-actions-col');
                actionsCol.innerHTML = `
                    <button class="action-btn btn-view" title="View Details">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn btn-edit" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn btn-start" title="Start Session">
                        <i class="bi bi-play-circle"></i>
                    </button>
                `;
                
                StaffUtils.showToast(`Accepted: ${clientName}`, 'success');
            }
        });
    });

    // Decline Pending
    const declineBtns = document.querySelectorAll('.btn-decline');
    declineBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.appointment-list-item');
            const clientName = item.querySelector('.client-name').textContent;
            
            if (confirm(`Decline appointment request from ${clientName}?`)) {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    item.remove();
                    updateResultsCount(document.querySelectorAll('.appointment-list-item:not([style*="display: none"])').length);
                    StaffUtils.showToast(`Declined: ${clientName}`, 'info');
                }, 300);
            }
        });
    });

    // Rebook
    const rebookBtns = document.querySelectorAll('.btn-rebook');
    rebookBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.appointment-list-item');
            const clientName = item.querySelector('.client-name').textContent;
            const serviceName = item.querySelector('.service-name').textContent;
            
            StaffUtils.showToast(`Rebooking ${serviceName} with ${clientName}`, 'info');
            // Open booking modal
        });
    });

    // Invoice
    const invoiceBtns = document.querySelectorAll('.btn-invoice');
    invoiceBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.appointment-list-item');
            const price = item.querySelector('.price-amount').textContent;
            
            StaffUtils.showToast(`Generating invoice for ${price}`, 'info');
            // Generate/view invoice
        });
    });

    // ===== BULK ACTIONS =====
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.className = 'form-check-input';
    
    // Select All functionality
    const checkboxes = document.querySelectorAll('.appointment-checkbox .form-check-input');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('.appointment-checkbox .form-check-input:checked').length;
            
            if (checkedCount > 0) {
                showBulkActions(checkedCount);
            } else {
                hideBulkActions();
            }
        });
    });

    const showBulkActions = (count) => {
        // You can implement bulk action toolbar here
        console.log(`${count} appointments selected`);
    };

    const hideBulkActions = () => {
        console.log('Bulk actions hidden');
    };

    // ===== STAT CARDS CLICK =====
    const statCards = document.querySelectorAll('.appointments-stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            let filterValue = 'all';
            
            if (this.classList.contains('stat-upcoming')) {
                filterValue = 'upcoming';
            } else if (this.classList.contains('stat-pending')) {
                filterValue = 'pending';
            } else if (this.classList.contains('stat-completed')) {
                filterValue = 'completed';
            }
            
            statusFilter.value = filterValue;
            filterAppointments();
            
            // Highlight selected stat
            statCards.forEach(c => c.style.border = '');
            this.style.border = '3px solid var(--primary)';
        });
    });

    // ===== EXPORT APPOINTMENTS =====
    const exportBtn = document.getElementById('exportAppointmentsBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            StaffUtils.showToast('Exporting appointments...', 'info');
            
            setTimeout(() => {
                StaffUtils.showToast('Appointments exported successfully!', 'success');
            }, 1500);
        });
    }

    // ===== ADD NEW APPOINTMENT =====
    const addNewBtn = document.getElementById('addNewAppointmentBtn');
    
    if (addNewBtn) {
        addNewBtn.addEventListener('click', function() {
            StaffUtils.showToast('Opening new appointment form...', 'info');
            // Open add appointment modal
        });
    }

    // ===== ANIMATE ITEMS ON LOAD =====
    appointmentItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 50 * index);
    });

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + F = Focus Search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape = Clear Search
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.blur();
            filterAppointments();
        }
        
        // Ctrl/Cmd + N = New Appointment
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            if (addNewBtn) addNewBtn.click();
        }
    });

    console.log('%c📅 Staff Appointments Page Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts:', 'color: #64748b; font-size: 12px;');
    console.log('  Ctrl/Cmd + F = Focus Search');
    console.log('  Escape = Clear Search');
    console.log('  Ctrl/Cmd + N = New Appointment');
});

// ===== EXPORT UTILITIES =====
window.StaffAppointments = {
    filterByStatus: (status) => {
        const filter = document.getElementById('statusFilterAppointments');
        if (filter) {
            filter.value = status;
            const event = new Event('change');
            filter.dispatchEvent(event);
        }
    },
    
    refreshList: () => {
        location.reload();
    }
};