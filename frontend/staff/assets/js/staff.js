/* =========================================
   STAFF DASHBOARD MAIN CONTENT SCRIPTS
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

    // Trigger counter animations
    const statValues = document.querySelectorAll('.stat-value[data-target], .stat-value span[data-target]');
    statValues.forEach(element => {
        setTimeout(() => animateCounter(element), 300);
    });

    // ===== DYNAMIC GREETING =====
    const updateGreeting = () => {
        const hour = new Date().getHours();
        const greetingElement = document.querySelector('.page-title');
        let greeting = 'Good Day';
        
        if (hour >= 5 && hour < 12) {
            greeting = 'Good Morning';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good Afternoon';
        } else if (hour >= 17 && hour < 22) {
            greeting = 'Good Evening';
        } else {
            greeting = 'Working Late';
        }
        
        if (greetingElement && greetingElement.textContent.includes('Sarah')) {
            greetingElement.textContent = `${greeting}, Sarah! 👋`;
        }
    };

    updateGreeting();

    // ===== APPOINTMENT SLOT ACTIONS =====
    
    // Start Session Button
    const startSessionBtns = document.querySelectorAll('.slot-actions .btn-primary');
    startSessionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const slot = this.closest('.appointment-slot');
            const clientName = slot.querySelector('.slot-client span').textContent;
            const serviceName = slot.querySelector('.slot-title').textContent;
            
            if (confirm(`Start session with ${clientName} for ${serviceName}?`)) {
                StaffUtils.showToast(`Session started with ${clientName}`, 'success');
                
                // Update button
                this.innerHTML = '<i class="bi bi-play-fill me-2"></i>In Progress';
                this.classList.remove('btn-primary');
                this.classList.add('btn-success');
                this.disabled = true;
            }
        });
    });

    // Reschedule Button
    const rescheduleBtns = document.querySelectorAll('.slot-actions .btn-outline-secondary');
    rescheduleBtns.forEach(btn => {
        if (btn.textContent.includes('Reschedule')) {
            btn.addEventListener('click', function() {
                const slot = this.closest('.appointment-slot');
                const clientName = slot.querySelector('.slot-client span').textContent;
                const serviceName = slot.querySelector('.slot-title').textContent;
                
                StaffUtils.showToast(`Rescheduling appointment with ${clientName}`, 'info');
                // Add your reschedule modal logic here
            });
        }
    });

    // Cancel Button
    const cancelBtns = document.querySelectorAll('.slot-actions .btn-outline-danger');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const slot = this.closest('.appointment-slot');
            const clientName = slot.querySelector('.slot-client span').textContent;
            
            if (confirm(`Are you sure you want to cancel this appointment with ${clientName}?`)) {
                slot.style.opacity = '0.5';
                slot.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    slot.remove();
                    StaffUtils.showToast('Appointment cancelled', 'success');
                }, 300);
            }
        });
    });

    // View Details Button
    const viewDetailsBtns = document.querySelectorAll('.slot-actions .btn-outline-primary');
    viewDetailsBtns.forEach(btn => {
        if (btn.textContent.includes('View Details')) {
            btn.addEventListener('click', function() {
                const slot = this.closest('.appointment-slot');
                const serviceName = slot.querySelector('.slot-title').textContent;
                const clientName = slot.querySelector('.slot-client span').textContent;
                const time = slot.querySelector('.slot-time .time').textContent;
                const location = slot.querySelector('.slot-details span:first-child').textContent;
                
                alert(`Appointment Details:
                
Service: ${serviceName}
Client: ${clientName}
Time: ${time}
Location: ${location}

Full details coming soon...`);
            });
        }
    });

    // ===== PENDING REQUESTS ACTIONS =====
    
    // Accept Request
    const acceptBtns = document.querySelectorAll('.request-actions .btn-success');
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const requestItem = this.closest('.request-item');
            const clientName = requestItem.querySelector('h6').textContent;
            
            if (confirm(`Accept appointment request from ${clientName}?`)) {
                requestItem.style.opacity = '0';
                requestItem.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    requestItem.remove();
                    updatePendingCount();
                    StaffUtils.showToast(`Request from ${clientName} accepted!`, 'success');
                }, 300);
            }
        });
    });

    // Decline Request
    const declineBtns = document.querySelectorAll('.request-actions .btn-danger');
    declineBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const requestItem = this.closest('.request-item');
            const clientName = requestItem.querySelector('h6').textContent;
            
            if (confirm(`Decline appointment request from ${clientName}?`)) {
                requestItem.style.opacity = '0';
                requestItem.style.transform = 'translateX(20px)';
                
                setTimeout(() => {
                    requestItem.remove();
                    updatePendingCount();
                    StaffUtils.showToast(`Request from ${clientName} declined`, 'info');
                }, 300);
            }
        });
    });

    const updatePendingCount = () => {
        const remainingRequests = document.querySelectorAll('.request-item').length;
        const badge = document.querySelector('.staff-card .card-header .badge-warning');
        
        if (badge) {
            badge.textContent = remainingRequests;
            if (remainingRequests === 0) {
                badge.style.display = 'none';
                const requestList = document.querySelector('.request-list');
                requestList.innerHTML = `
                    <div class="text-center py-4">
                        <i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
                        <p class="mt-3 text-muted">No pending requests</p>
                    </div>
                `;
            }
        }
    };

    // ===== QUICK ACTIONS =====
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionName = this.querySelector('span').textContent;
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px)';
            }, 100);
            
            StaffUtils.showToast(`${actionName} clicked`, 'info');
            
            // Add your specific action logic here based on button text
            if (actionName === 'Add Appointment') {
                // Open add appointment modal
            } else if (actionName === 'Set Break') {
                // Open break time modal
            } else if (actionName === 'Block Time') {
                // Open block time modal
            } else if (actionName === 'View Clients') {
                window.location.href = 'staff-clients.html';
            }
        });
    });

    // ===== APPOINTMENT SLOT HOVER EFFECTS =====
    const appointmentSlots = document.querySelectorAll('.appointment-slot.upcoming');
    
    appointmentSlots.forEach(slot => {
        slot.addEventListener('mouseenter', function() {
            const dot = this.querySelector('.slot-dot');
            if (dot && !dot.classList.contains('active')) {
                dot.style.transform = 'scale(1.2)';
            }
        });

        slot.addEventListener('mouseleave', function() {
            const dot = this.querySelector('.slot-dot');
            if (dot && !dot.classList.contains('active')) {
                dot.style.transform = 'scale(1)';
            }
        });
    });

    // ===== AUTO-UPDATE TIME UNTIL APPOINTMENTS =====
    const updateTimeUntil = () => {
        const upcomingBadges = document.querySelectorAll('.badge-upcoming');
        
        upcomingBadges.forEach(badge => {
            const slot = badge.closest('.appointment-slot');
            const timeElement = slot.querySelector('.slot-time .time');
            
            if (timeElement) {
                const appointmentTime = timeElement.textContent;
                // You can calculate and update the "In X minutes" text here
                // For demo, we're keeping it static
            }
        });
    };

    // Update every minute
    setInterval(updateTimeUntil, 60000);

    // ===== PERFORMANCE BARS ANIMATION =====
    const animatePerformanceBars = () => {
        const perfFills = document.querySelectorAll('.perf-fill');
        
        perfFills.forEach((fill, index) => {
            fill.style.width = '0%';
            const targetWidth = fill.style.width || '0%';
            
            setTimeout(() => {
                fill.style.transition = 'width 1s ease-out';
                fill.style.width = fill.getAttribute('style').match(/width:\s*(\d+%)/)[1];
            }, 100 + (index * 150));
        });
    };

    const observePerformanceCard = () => {
        const perfCard = document.querySelector('.performance-stat');
        if (!perfCard) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animatePerformanceBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(perfCard);
    };

    observePerformanceCard();

    // ===== ACTIVITY TIMELINE ANIMATION =====
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (index * 100));
    });

    // ===== STAT CARD HOVER EFFECTS =====
    const statCards = document.querySelectorAll('.staff-stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.stat-icon');
            if (icon) {
                icon.style.transform = 'rotate(5deg) scale(1.05)';
                icon.style.transition = 'all 0.3s ease';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.stat-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });

    // ===== AUTO-REFRESH SIMULATION =====
    const simulateRealTimeUpdates = () => {
        // Simulate new notification every 2 minutes
        setInterval(() => {
            const notificationCount = document.querySelector('.header-icon-btn .notification-count');
            if (notificationCount) {
                const currentCount = parseInt(notificationCount.textContent);
                notificationCount.textContent = currentCount + 1;
                
                // Flash animation
                notificationCount.style.animation = 'pulse 0.5s ease-out';
                setTimeout(() => {
                    notificationCount.style.animation = '';
                }, 500);
            }
        }, 120000); // Every 2 minutes
    };

    // Uncomment to enable
    // simulateRealTimeUpdates();

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + N = Add New Appointment
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            const addBtn = document.querySelector('.page-header-right .btn-primary');
            if (addBtn) addBtn.click();
        }
        
        // Ctrl/Cmd + R = Refresh Dashboard
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            location.reload();
        }
    });

    // ===== WELCOME MESSAGE (FIRST TIME) =====
    const isFirstVisit = !sessionStorage.getItem('staffDashboardVisited');
    
    if (isFirstVisit) {
        setTimeout(() => {
            StaffUtils.showToast('Welcome to your Staff Dashboard! 🎉', 'success');
            sessionStorage.setItem('staffDashboardVisited', 'true');
        }, 1000);
    }

    console.log('%c📊 Staff Dashboard Content Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts:', 'color: #64748b; font-size: 12px;');
    console.log('  Ctrl/Cmd + N = New Appointment');
    console.log('  Ctrl/Cmd + R = Refresh Dashboard');
});

// ===== EXPORT UTILITIES =====
window.StaffDashboard = {
    refreshStats: () => {
        const statValues = document.querySelectorAll('.stat-value[data-target], .stat-value span[data-target]');
        statValues.forEach(element => {
            element.textContent = '0';
            setTimeout(() => animateCounter(element), 100);
        });
    },
    
    addNewRequest: (clientName, datetime, service) => {
        const requestList = document.querySelector('.request-list');
        const newRequest = document.createElement('div');
        newRequest.className = 'request-item';
        newRequest.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=${clientName}" alt="Client" class="request-avatar">
            <div class="request-info">
                <h6>${clientName}</h6>
                <p>${datetime} - ${service}</p>
            </div>
            <div class="request-actions">
                <button class="btn-icon btn-success" title="Accept">
                    <i class="bi bi-check-lg"></i>
                </button>
                <button class="btn-icon btn-danger" title="Decline">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `;
        requestList.prepend(newRequest);
        StaffUtils.showToast(`New request from ${clientName}`, 'info');
    }
};