

/* =========================================
   CUSTOMER DASHBOARD SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ANIMATE STAT COUNTERS =====
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    };

    // Trigger counter animation on page load
    const statValues = document.querySelectorAll('.stat-value[data-target]');
    statValues.forEach(element => {
        setTimeout(() => animateCounter(element), 200);
    });

    // ===== APPOINTMENT ACTIONS =====
    const setupAppointmentActions = () => {
        const appointmentItems = document.querySelectorAll('.appointment-item');

        appointmentItems.forEach(item => {
            const rescheduleBtn = item.querySelector('.btn-action:nth-child(1)');
            const cancelBtn = item.querySelector('.btn-action:nth-child(2)');
            const moreBtn = item.querySelector('.btn-action:nth-child(3)');

            if (rescheduleBtn) {
                rescheduleBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const appointmentTitle = item.querySelector('.appointment-title').textContent;
                    DashboardUtils.showToast(`Rescheduling: ${appointmentTitle}`, 'info');
                    // Add your reschedule logic here
                });
            }

            if (cancelBtn) {
                cancelBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const appointmentTitle = item.querySelector('.appointment-title').textContent;
                    
                    if (confirm(`Are you sure you want to cancel "${appointmentTitle}"?`)) {
                        item.style.opacity = '0.5';
                        item.style.transform = 'scale(0.95)';
                        
                        setTimeout(() => {
                            item.remove();
                            DashboardUtils.showToast('Appointment cancelled successfully', 'success');
                            checkEmptyState();
                        }, 300);
                    }
                });
            }

            if (moreBtn) {
                moreBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    showAppointmentDetails(item);
                });
            }
        });
    };

    setupAppointmentActions();

    // ===== SHOW APPOINTMENT DETAILS MODAL =====
    const showAppointmentDetails = (item) => {
        const title = item.querySelector('.appointment-title').textContent;
        const time = item.querySelector('.appointment-meta span:first-child').textContent;
        const provider = item.querySelector('.appointment-meta span:nth-child(2)').textContent;
        const location = item.querySelector('.appointment-meta span:nth-child(3)').textContent;

        alert(`Appointment Details:
        
Service: ${title}
Time: ${time}
Provider: ${provider}
Location: ${location}

You can view full details in the appointments page.`);
    };

    // ===== CHECK EMPTY STATE =====
    const checkEmptyState = () => {
        const appointmentsList = document.querySelector('.appointment-item');
        const emptyState = document.querySelector('.empty-state');

        if (!appointmentsList) {
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        }
    };

    // ===== CALENDAR NAVIGATION =====
    const calendarPrev = document.querySelector('.calendar-controls .btn:first-child');
    const calendarNext = document.querySelector('.calendar-controls .btn:last-child');
    const currentMonthSpan = document.querySelector('.current-month');

    if (calendarPrev && calendarNext && currentMonthSpan) {
        let currentDate = new Date(2024, 11, 27); // December 2024

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const updateCalendar = () => {
            currentMonthSpan.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
            // Here you would regenerate calendar days
            DashboardUtils.showToast(`Viewing ${currentMonthSpan.textContent}`, 'info');
        };

        calendarPrev.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        });

        calendarNext.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
        });
    }

    // ===== CALENDAR DAY CLICK =====
    const calendarDays = document.querySelectorAll('.calendar-day:not(.other-month)');
    
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // Remove active class from all days
            calendarDays.forEach(d => d.classList.remove('selected'));
            
            // Add active to clicked day (if not today)
            if (!this.classList.contains('today')) {
                this.classList.add('selected');
            }
            
            const dayNum = this.textContent;
            const hasAppointment = this.classList.contains('has-appointment');
            
            if (hasAppointment) {
                DashboardUtils.showToast(`You have appointments on Dec ${dayNum}`, 'info');
            } else {
                DashboardUtils.showToast(`No appointments on Dec ${dayNum}`, 'info');
            }
        });
    });

    // Add selected style
    const addSelectedStyle = () => {
        const style = document.createElement('style');
        style.textContent = `
            .calendar-day.selected {
                background: var(--primary-light) !important;
                color: white !important;
                font-weight: 700;
            }
        `;
        document.head.appendChild(style);
    };

    addSelectedStyle();

    // ===== QUICK ACTION HOVER EFFECTS =====
    const quickActionItems = document.querySelectorAll('.quick-action-item');
    
    quickActionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // ===== ACTIVITY ITEM ANIMATIONS =====
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.3s ease-out';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (index * 100));
    });

    // ===== STAT CARD HOVER EFFECTS =====
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.stat-icon');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.stat-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // ===== REFRESH DATA SIMULATION =====
    const simulateDataRefresh = () => {
        // Simulate fetching new data every 30 seconds
        setInterval(() => {
            // Update notification badge randomly
            const notifBadge = document.querySelector('.notification-badge');
            if (notifBadge) {
                const currentCount = parseInt(notifBadge.textContent);
                const newCount = currentCount + Math.floor(Math.random() * 2);
                notifBadge.textContent = newCount;
            }
        }, 30000);
    };

    // Uncomment to enable auto-refresh
    // simulateDataRefresh();

    // ===== APPOINTMENT ITEM CLICK =====
    const appointmentItems = document.querySelectorAll('.appointment-item');
    
    appointmentItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on action buttons
            if (e.target.closest('.btn-action')) return;
            
            // Toggle expanded state
            this.classList.toggle('expanded');
            
            // Add/remove border highlight
            if (this.classList.contains('expanded')) {
                this.style.borderColor = 'var(--primary)';
                this.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.2)';
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    });

    // ===== EXPORT FUNCTIONALITY =====
    const exportBtn = document.querySelector('.page-actions .btn-outline-primary');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            DashboardUtils.showToast('Exporting your data...', 'info');
            
            // Simulate export
            setTimeout(() => {
                DashboardUtils.showToast('Data exported successfully!', 'success');
            }, 1500);
        });
    }

    // ===== NEW APPOINTMENT BUTTON =====
    const newAppointmentBtn = document.querySelector('.page-actions .btn-primary');
    
    if (newAppointmentBtn) {
        newAppointmentBtn.addEventListener('click', function(e) {
            // Add ripple effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    }

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + N = New Appointment
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            window.location.href = 'booking.html';
        }
        
        // Ctrl/Cmd + A = View All Appointments
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            window.location.href = 'dashboard-appointments.html';
        }
    });

    // ===== WELCOME ANIMATION =====
    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');
    
    if (pageTitle && pageSubtitle) {
        pageTitle.style.opacity = '0';
        pageTitle.style.transform = 'translateY(-20px)';
        pageSubtitle.style.opacity = '0';
        pageSubtitle.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            pageTitle.style.transition = 'all 0.5s ease-out';
            pageTitle.style.opacity = '1';
            pageTitle.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                pageSubtitle.style.transition = 'all 0.5s ease-out';
                pageSubtitle.style.opacity = '1';
                pageSubtitle.style.transform = 'translateY(0)';
            }, 100);
        }, 200);
    }

    // ===== LOG DASHBOARD INFO =====
    console.log('%c📊 Customer Dashboard Loaded', 'color: #6366f1; font-size: 18px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts:', 'color: #64748b; font-size: 14px;');
    console.log('  Ctrl/Cmd + N = New Appointment');
    console.log('  Ctrl/Cmd + A = View All Appointments');
    
    // ===== SHOW WELCOME MESSAGE (FIRST TIME) =====
    const isFirstVisit = !localStorage.getItem('dashboardVisited');
    
    if (isFirstVisit) {
        setTimeout(() => {
            DashboardUtils.showToast('Welcome to your dashboard! 👋', 'success');
            localStorage.setItem('dashboardVisited', 'true');
        }, 1000);
    }
});

// ===== EXPORT DASHBOARD UTILITIES =====
window.CustomerDashboard = {
    refreshStats: () => {
        const statValues = document.querySelectorAll('.stat-value[data-target]');
        statValues.forEach(element => {
            element.textContent = '0';
            setTimeout(() => animateCounter(element), 100);
        });
    },
    
    addNotification: (message, time) => {
        const notificationList = document.querySelector('.notification-dropdown');
        if (notificationList) {
            const item = document.createElement('div');
            item.className = 'notification-item';
            item.innerHTML = `
                <i class="bi bi-bell text-primary"></i>
                <div>
                    <p class="mb-0">${message}</p>
                    <small class="text-muted">${time}</small>
                </div>
            `;
            notificationList.insertBefore(item, notificationList.querySelector('.dropdown-footer'));
        }
    }
};