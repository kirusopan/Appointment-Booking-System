/* =========================================
   STAFF CLIENTS PAGE SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    const clientCards = document.querySelectorAll('.client-card');
    const clientsGrid = document.getElementById('clientsGrid');
    const emptyResults = document.getElementById('emptyClientsResults');

    // ===== FILTER FUNCTIONALITY =====
    const searchInput = document.getElementById('searchClients');
    const statusFilter = document.getElementById('statusFilterClients');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortSelect = document.getElementById('sortClients');

    const filterClients = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const rating = ratingFilter.value;
        
        let visibleCount = 0;

        clientCards.forEach(card => {
            const clientName = card.querySelector('.client-name').textContent.toLowerCase();
            const clientEmail = card.querySelector('.client-email').textContent.toLowerCase();
            const clientPhone = card.querySelector('.client-phone').textContent.toLowerCase();
            const cardStatus = card.getAttribute('data-status');
            const cardRating = parseInt(card.getAttribute('data-rating'));
            
            const matchesSearch = clientName.includes(searchTerm) || 
                                 clientEmail.includes(searchTerm) || 
                                 clientPhone.includes(searchTerm);
            const matchesStatus = status === 'all' || cardStatus === status;
            let matchesRating = true;
            
            if (rating !== 'all') {
                const minRating = parseInt(rating);
                matchesRating = cardRating >= minRating;
            }
            
            if (matchesSearch && matchesStatus && matchesRating) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide empty state
        if (visibleCount === 0) {
            emptyResults.style.display = 'block';
        } else {
            emptyResults.style.display = 'none';
        }

        StaffUtils.showToast(`Found ${visibleCount} clients`, 'info');
    };

    // Real-time search
    if (searchInput) {
        searchInput.addEventListener('input', filterClients);
    }

    // Filter change listeners
    [statusFilter, ratingFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', filterClients);
        }
    });

    // Clear Filters
    const clearFiltersBtn = document.getElementById('clearFiltersClients');
    const clearFiltersEmpty = document.getElementById('clearFiltersEmpty');
    
    const clearFilters = () => {
        searchInput.value = '';
        statusFilter.value = 'all';
        ratingFilter.value = 'all';
        sortSelect.value = 'name';
        filterClients();
    };

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    if (clearFiltersEmpty) {
        clearFiltersEmpty.addEventListener('click', clearFilters);
    }

    // ===== SORTING =====
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortType = this.value;
            sortClients(sortType);
        });
    }

    const sortClients = (sortType) => {
        const cards = Array.from(clientCards);

        cards.sort((a, b) => {
            if (sortType === 'name') {
                const nameA = a.querySelector('.client-name').textContent;
                const nameB = b.querySelector('.client-name').textContent;
                return nameA.localeCompare(nameB);
            } else if (sortType === 'recent') {
                // Sort by last visit (simplified for demo)
                return 0;
            } else if (sortType === 'appointments') {
                const apptsA = parseInt(a.querySelector('.client-stats-row .stat-item:first-child span').textContent);
                const apptsB = parseInt(b.querySelector('.client-stats-row .stat-item:first-child span').textContent);
                return apptsB - apptsA;
            } else if (sortType === 'revenue') {
                const revA = parseInt(a.querySelector('.client-stats-row .stat-item:last-child span').textContent.replace(/[$,]/g, ''));
                const revB = parseInt(b.querySelector('.client-stats-row .stat-item:last-child span').textContent.replace(/[$,]/g, ''));
                return revB - revA;
            }
        });

        cards.forEach(card => clientsGrid.appendChild(card));
        StaffUtils.showToast(`Sorted by: ${sortType}`, 'info');
    };

    // ===== VIEW TOGGLE =====
    const viewOptionBtns = document.querySelectorAll('.view-option-btn');

    viewOptionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewOptionBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            
            if (view === 'list') {
                clientsGrid.classList.add('list-view');
                StaffUtils.showToast('Switched to list view', 'info');
            } else {
                clientsGrid.classList.remove('list-view');
                StaffUtils.showToast('Switched to grid view', 'info');
            }
        });
    });

    // ===== CLIENT ACTIONS =====
    
    // View Profile
    clientCards.forEach(card => {
        const viewBtn = card.querySelector('.client-card-footer .btn-outline-primary:first-child');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                const clientName = card.querySelector('.client-name').textContent;
                StaffUtils.showToast(`Viewing profile: ${clientName}`, 'info');
                // Open profile modal
            });
        }
    });

    // Book Appointment
    clientCards.forEach(card => {
        const bookBtn = card.querySelector('.client-card-footer .btn-outline-primary:nth-child(2)');
        if (bookBtn) {
            bookBtn.addEventListener('click', function() {
                const clientName = card.querySelector('.client-name').textContent;
                StaffUtils.showToast(`Booking appointment for ${clientName}`, 'info');
                // Open booking modal
            });
        }
    });

    // Message Client
    clientCards.forEach(card => {
        const messageBtn = card.querySelector('.client-card-footer .btn-outline-primary:nth-child(3)');
        if (messageBtn) {
            messageBtn.addEventListener('click', function() {
                const clientName = card.querySelector('.client-name').textContent;
                StaffUtils.showToast(`Opening chat with ${clientName}`, 'info');
                // Open message modal
            });
        }
    });

    // Dropdown Actions
    const dropdownItems = document.querySelectorAll('.client-card .dropdown-item');
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.client-card');
            const clientName = card.querySelector('.client-name').textContent;
            const action = this.textContent.trim();
            
            if (action.includes('Delete')) {
                if (confirm(`Are you sure you want to delete ${clientName}?`)) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        card.remove();
                        StaffUtils.showToast(`${clientName} deleted`, 'success');
                    }, 300);
                }
            } else {
                StaffUtils.showToast(`${action}: ${clientName}`, 'info');
            }
        });
    });

    // ===== STAT CARDS CLICK =====
    const statCards = document.querySelectorAll('.client-stat-card');
    
    statCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            let filterValue = 'all';
            
            // Determine filter based on stat card
            if (index === 0) {
                filterValue = 'all';
            } else if (index === 1) {
                ratingFilter.value = '4';
                ratingFilter.dispatchEvent(new Event('change'));
                return;
            } else if (index === 2) {
                // Active this month - could set date filter
                filterValue = 'active';
            } else if (index === 3) {
                filterValue = 'new';
            }
            
            statusFilter.value = filterValue;
            filterClients();
        });
    });

    // ===== EXPORT CLIENTS =====
    const exportBtn = document.getElementById('exportClientsBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            StaffUtils.showToast('Exporting client list...', 'info');
            
            setTimeout(() => {
                StaffUtils.showToast('Client list exported successfully!', 'success');
            }, 1500);
        });
    }

    // ===== IMPORT CLIENTS =====
    const importBtn = document.getElementById('importClientsBtn');
    
    if (importBtn) {
        importBtn.addEventListener('click', function() {
            StaffUtils.showToast('Opening import dialog...', 'info');
            // Open import modal/file picker
        });
    }

    // ===== ADD CLIENT =====
    const addClientBtn = document.getElementById('addClientBtn');
    
    if (addClientBtn) {
        addClientBtn.addEventListener('click', function() {
            StaffUtils.showToast('Opening new client form...', 'info');
            // Open add client modal
        });
    }

    // ===== ANIMATE CARDS ON LOAD =====
    clientCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50 * index);
    });

    // ===== CARD HOVER EFFECTS =====
    clientCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const photo = this.querySelector('.client-photo');
            if (photo) {
                photo.style.transform = 'scale(1.1)';
                photo.style.transition = 'transform 0.3s ease';
            }
        });

        card.addEventListener('mouseleave', function() {
            const photo = this.querySelector('.client-photo');
            if (photo) {
                photo.style.transform = 'scale(1)';
            }
        });
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
            filterClients();
        }
        
        // Ctrl/Cmd + N = Add Client
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            if (addClientBtn) addClientBtn.click();
        }
    });

    console.log('%c👥 Staff Clients Page Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts:', 'color: #64748b; font-size: 12px;');
    console.log('  Ctrl/Cmd + F = Focus Search');
    console.log('  Escape = Clear Search');
    console.log('  Ctrl/Cmd + N = Add Client');
});

// ===== EXPORT UTILITIES =====
window.StaffClients = {
    filterByStatus: (status) => {
        const filter = document.getElementById('statusFilterClients');
        if (filter) {
            filter.value = status;
            filter.dispatchEvent(new Event('change'));
        }
    },
    
    refreshList: () => {
        location.reload();
    }
};