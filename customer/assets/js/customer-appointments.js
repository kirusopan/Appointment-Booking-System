/* =========================================
   MY APPOINTMENTS PAGE SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== FILTER FUNCTIONALITY =====
    const searchInput = document.getElementById('appointmentSearch');
    const statusFilter = document.getElementById('statusFilter');
    const serviceFilter = document.getElementById('serviceFilter');
    const dateFilter = document.getElementById('dateFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const appointmentCards = document.querySelectorAll('.appointment-card');
    const resultsCount = document.getElementById('resultsCount');

    const filterAppointments = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value;
        const selectedService = serviceFilter.value;
        const selectedDate = dateFilter.value;
        
        let visibleCount = 0;

        appointmentCards.forEach(card => {
            const service = card.querySelector('.appointment-service').textContent.toLowerCase();
            const notes = card.querySelector('.appointment-notes p')?.textContent.toLowerCase() || '';
            const status = card.getAttribute('data-status');
            const serviceType = card.getAttribute('data-service');
            const date = card.getAttribute('data-date');

            // Search filter
            const matchesSearch = service.includes(searchTerm) || notes.includes(searchTerm);

            // Status filter
            const matchesStatus = selectedStatus === 'all' || status === selectedStatus;

            // Service filter
            const matchesService = selectedService === 'all' || serviceType === selectedService;

            // Date filter
            let matchesDate = true;
            if (selectedDate !== 'all') {
                const appointmentDate = new Date(date);
                const today = new Date();
                
                if (selectedDate === 'upcoming') {
                    matchesDate = appointmentDate >= today;
                } else if (selectedDate === 'past') {
                    matchesDate = appointmentDate < today;
                } else if (selectedDate === 'today') {
                    matchesDate = appointmentDate.toDateString() === today.toDateString();
                }
                // Add more date filters as needed
            }

            // Show or hide card
            if (matchesSearch && matchesStatus && matchesService && matchesDate) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Update results count
        if (resultsCount) {
            resultsCount.textContent = visibleCount;
        }

        // Show/hide empty state
        checkEmptyState(visibleCount);
    };

    // Event listeners for filters
    if (searchInput) searchInput.addEventListener('input', filterAppointments);
    if (statusFilter) statusFilter.addEventListener('change', filterAppointments);
    if (serviceFilter) serviceFilter.addEventListener('change', filterAppointments);
    if (dateFilter) dateFilter.addEventListener('change', filterAppointments);

    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            searchInput.value = '';
            statusFilter.value = 'all';
            serviceFilter.value = 'all';
            dateFilter.value = 'all';
            filterAppointments();
            DashboardUtils.showToast('Filters cleared', 'info');
        });
    }

    // ===== EMPTY STATE CHECK =====
    const checkEmptyState = (visibleCount) => {
        const emptyState = document.querySelector('.empty-state-appointments');
        const appointmentsList = document.querySelector('.appointments-list');
        
        if (visibleCount === 0) {
            if (appointmentsList) appointmentsList.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
        } else {
            if (appointmentsList) appointmentsList.style.display = 'flex';
            if (emptyState) emptyState.style.display = 'none';
        }
    };

    // ===== APPOINTMENT ACTIONS =====
    const setupAppointmentActions = () => {
        // View Details buttons
        document.querySelectorAll('.btn-action').forEach(btn => {
            if (btn.textContent.includes('View Details')) {
                btn.addEventListener('click', function() {
                    const card = this.closest('.appointment-card');
                    const service = card.querySelector('.appointment-service').textContent;
                    showAppointmentModal(card);
                });
            }
        });

        // Reschedule buttons
        document.querySelectorAll('.btn-action').forEach(btn => {
            if (btn.textContent.includes('Reschedule')) {
                btn.addEventListener('click', function() {
                    const card = this.closest('.appointment-card');
                    const service = card.querySelector('.appointment-service').textContent;
                    
                    if (confirm(`Would you like to reschedule "${service}"?`)) {
                        DashboardUtils.showToast('Redirecting to reschedule page...', 'info');
                        // Redirect to booking page with reschedule data
                        setTimeout(() => {
                            // window.location.href = 'booking.html?reschedule=true';
                        }, 1000);
                    }
                });
            }
        });

        // Cancel buttons
        document.querySelectorAll('.btn-action').forEach(btn => {
            if (btn.textContent.includes('Cancel')) {
                btn.addEventListener('click', function() {
                    const card = this.closest('.appointment-card');
                    const service = card.querySelector('.appointment-service').textContent;
                    
                    if (confirm(`Are you sure you want to cancel "${service}"?\n\nCancellation policy: Free cancellation up to 24 hours before appointment.`)) {
                        cancelAppointment(card);
                    }
                });
            }
        });

        // Book Again buttons
        document.querySelectorAll('.btn-action').forEach(btn => {
            if (btn.textContent.includes('Book Again')) {
                btn.addEventListener('click', function() {
                    const card = this.closest('.appointment-card');
                    const service = card.querySelector('.appointment-service').textContent;
                    
                    DashboardUtils.showToast(`Booking ${service} again...`, 'success');
                    setTimeout(() => {
                        window.location.href = 'booking.html';
                    }, 1000);
                });
            }
        });

        // Rate Service buttons
        document.querySelectorAll('.btn.btn-warning').forEach(btn => {
            if (btn.textContent.includes('Rate Service')) {
                btn.addEventListener('click', function() {
                    const card = this.closest('.appointment-card');
                    showRatingModal(card);
                });
            }
        });

        // Join Meeting buttons
        document.querySelectorAll('.btn-primary').forEach(btn => {
            if (btn.textContent.includes('Join Meeting')) {
                btn.addEventListener('click', function() {
                    DashboardUtils.showToast('Launching meeting...', 'info');
                    setTimeout(() => {
                        // window.open('meeting-link-here', '_blank');
                        DashboardUtils.showToast('Meeting link would open here', 'success');
                    }, 1000);
                });
            }
        });

        // Get Directions buttons
        document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
            if (btn.textContent.includes('Get Directions')) {
                btn.addEventListener('click', function() {
                    const card = this.closest('.appointment-card');
                    const location = card.querySelector('.detail-item:nth-child(2) .detail-value').textContent;
                    
                    DashboardUtils.showToast(`Opening directions to ${location}...`, 'info');
                    // window.open(`https://maps.google.com/?q=${encodeURIComponent(location)}`, '_blank');
                });
            }
        });

        // Rebook Service buttons
        document.querySelectorAll('.btn.btn-success').forEach(btn => {
            if (btn.textContent.includes('Rebook')) {
                btn.addEventListener('click', function() {
                    DashboardUtils.showToast('Redirecting to booking...', 'success');
                    setTimeout(() => {
                        window.location.href = 'booking.html';
                    }, 1000);
                });
            }
        });
    };

    setupAppointmentActions();

    // ===== CANCEL APPOINTMENT =====
    const cancelAppointment = (card) => {
        card.style.opacity = '0.5';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            card.remove();
            DashboardUtils.showToast('Appointment cancelled successfully', 'success');
            updateTabCounts();
            filterAppointments();
        }, 500);
    };

    // ===== UPDATE TAB COUNTS =====
    const updateTabCounts = () => {
        const upcomingCount = document.querySelectorAll('[data-status="confirmed"][data-bs-target="#upcoming-tab"]').length;
        const completedCount = document.querySelectorAll('[data-status="completed"]').length;
        const cancelledCount = document.querySelectorAll('[data-status="cancelled"]').length;
        const totalCount = appointmentCards.length;

        // Update badge counts
        const badges = document.querySelectorAll('.appointments-tabs .badge');
        if (badges[0]) badges[0].textContent = upcomingCount;
        if (badges[1]) badges[1].textContent = completedCount;
        if (badges[2]) badges[2].textContent = cancelledCount;
        if (badges[3]) badges[3].textContent = totalCount;
    };

    // ===== CALENDAR VIEW TOGGLE =====
    const calendarViewBtn = document.getElementById('calendarViewBtn');
    if (calendarViewBtn) {
        calendarViewBtn.addEventListener('click', function() {
            DashboardUtils.showToast('Calendar view coming soon!', 'info');
            // Toggle between list and calendar view
        });
    }

    // ===== CARD HOVER EFFECTS =====
    appointmentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const dateBadge = this.querySelector('.appointment-date-badge');
            if (dateBadge) {
                dateBadge.style.transform = 'scale(1.05) rotate(-2deg)';
                dateBadge.style.transition = 'all 0.3s ease';
            }
        });

        card.addEventListener('mouseleave', function() {
            const dateBadge = this.querySelector('.appointment-date-badge');
            if (dateBadge) {
                dateBadge.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // ===== ANIMATE CARDS ON LOAD =====
    const animateCards = () => {
        appointmentCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    };

    animateCards();

    // ===== TAB CHANGE ANIMATION =====
    const tabButtons = document.querySelectorAll('.appointments-tabs .nav-link');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-bs-target');
            
            // Animate tab content
            setTimeout(() => {
                const activeCards = document.querySelectorAll(`${targetTab} .appointment-card`);
                activeCards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease-out';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 80);
                });
            }, 150);
        });
    });

    // ===== EXPORT APPOINTMENTS =====
    const exportAppointments = () => {
        const appointments = [];
        
        appointmentCards.forEach(card => {
            if (card.style.display !== 'none') {
                appointments.push({
                    service: card.querySelector('.appointment-service').textContent,
                    date: card.getAttribute('data-date'),
                    status: card.getAttribute('data-status'),
                    provider: card.querySelector('.detail-item:nth-child(1) .detail-value').textContent
                });
            }
        });

        console.log('Exporting appointments:', appointments);
        DashboardUtils.showToast(`Exporting ${appointments.length} appointments...`, 'info');
    };

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + F = Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Ctrl/Cmd + E = Export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportAppointments();
        }
        
        // Esc = Clear search
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.blur();
            filterAppointments();
        }
    });

    // ===== BULK ACTIONS (Future Feature) =====
    const enableBulkActions = () => {
        // Add checkboxes to cards for bulk operations
        // This would be implemented when needed
    };

    // ===== PRINT APPOINTMENTS =====
    const printAppointments = () => {
        window.print();
    };

    // ===== INITIAL COUNT =====
    filterAppointments();

    // ===== LOG INFO =====
    console.log('%c📅 My Appointments Page Loaded', 'color: #6366f1; font-size: 18px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts:', 'color: #64748b; font-size: 14px;');
    console.log('  Ctrl/Cmd + F = Focus search');
    console.log('  Ctrl/Cmd + E = Export appointments');
    console.log('  Esc = Clear search');
});

// ===== EXPORT UTILITIES =====
window.MyAppointmentsUtils = {
    refreshAppointments: () => {
        DashboardUtils.showToast('Refreshing appointments...', 'info');
        // Reload appointments from server
    },
    
    filterByStatus: (status) => {
        const filter = document.getElementById('statusFilter');
        if (filter) {
            filter.value = status;
            filter.dispatchEvent(new Event('change'));
        }
    },
    
    filterByService: (service) => {
        const filter = document.getElementById('serviceFilter');
        if (filter) {
            filter.value = service;
            filter.dispatchEvent(new Event('change'));
        }
    }
};