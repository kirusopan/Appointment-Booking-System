/* =========================================
   STAFF DASHBOARD BASE JAVASCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SIDEBAR TOGGLE =====
    const sidebarToggle = document.getElementById('sidebarToggle');
    const staffSidebar = document.getElementById('staffSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    const toggleSidebar = () => {
        staffSidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = staffSidebar.classList.contains('active') ? 'hidden' : '';
    };

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Close sidebar on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991 && staffSidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // ===== ACTIVE NAV LINK =====
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'staff-dashboard.html';
        const navLinks = document.querySelectorAll('.staff-nav .nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const parentItem = link.closest('.nav-item');
            
            if (linkHref === currentPage) {
                parentItem.classList.add('active');
            } else {
                parentItem.classList.remove('active');
            }
        });
    };

    setActiveNavLink();

    // ===== UPDATE CURRENT DATE =====
    const updateCurrentDate = () => {
        const dateElement = document.getElementById('currentDate');
        if (!dateElement) return;

        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const currentDate = new Date().toLocaleDateString('en-US', options);
        dateElement.textContent = currentDate;
    };

    updateCurrentDate();

    // ===== STATUS TOGGLE =====
    const statusButtons = document.querySelectorAll('.status-btn');
    
    statusButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all
            statusButtons.forEach(b => b.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            const status = this.getAttribute('data-status');
            const statusText = this.querySelector('span').textContent;
            
            StaffUtils.showToast(`Status changed to: ${statusText}`, 'success');
            
            // Update notification badge based on status
            updateStatusIndicator(status);
        });
    });

    const updateStatusIndicator = (status) => {
        // You can add visual indicators throughout the interface
        console.log('Staff status updated to:', status);
    };

    // ===== NOTIFICATION MANAGEMENT =====
    const notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            // Mark as read
            this.classList.remove('unread');
            
            // Update count
            updateNotificationCount();
        });
    });

    const updateNotificationCount = () => {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const countBadges = document.querySelectorAll('.header-icon-btn .notification-count');
        
        countBadges.forEach(badge => {
            if (badge.closest('.header-icon-btn').querySelector('.bi-bell')) {
                badge.textContent = unreadCount;
                if (unreadCount === 0) {
                    badge.style.display = 'none';
                } else {
                    badge.style.display = 'block';
                }
            }
        });
    };

    // Mark all as read functionality
    const markAllReadBtn = document.querySelector('.notification-dropdown .dropdown-header a');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            notificationItems.forEach(item => item.classList.remove('unread'));
            updateNotificationCount();
            StaffUtils.showToast('All notifications marked as read', 'success');
        });
    }

    // ===== AUTO-CLOSE DROPDOWNS =====
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu.show');
            dropdowns.forEach(dropdown => {
                const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
                if (bsDropdown) bsDropdown.hide();
            });
        }
    });

    // ===== SMOOTH SCROLL =====
    const smoothScroll = (target) => {
        document.querySelector(target)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Alt + D = Dashboard
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
            window.location.href = 'staff-dashboard.html';
        }
        
        // Alt + A = Appointments
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            window.location.href = 'staff-appointments.html';
        }
        
        // Alt + S = Schedule
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            window.location.href = 'staff-schedule.html';
        }
    });

    // ===== ACTIVITY TRACKING =====
    let lastActivityTime = Date.now();
    
    const trackActivity = () => {
        lastActivityTime = Date.now();
    };
    
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, trackActivity);
    });

    // Check for inactivity every minute
    setInterval(() => {
        const inactiveTime = Date.now() - lastActivityTime;
        const inactiveMinutes = Math.floor(inactiveTime / 60000);
        
        if (inactiveMinutes >= 30) {
            console.warn('User inactive for 30+ minutes');
            // You can show a modal or warning here
        }
    }, 60000);

    // ===== REAL-TIME CLOCK =====
    const updateClock = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        // You can add a clock element if needed
        console.log(`Current time: ${hours}:${minutes}:${seconds}`);
    };

    // Update clock every second
    setInterval(updateClock, 1000);

    // ===== CONSOLE WELCOME =====
    console.log('%c🎯 Staff Dashboard Loaded', 'color: #6366f1; font-size: 18px; font-weight: bold;');
    console.log('%cWelcome to BookEase Staff Panel!', 'color: #64748b; font-size: 14px;');
    console.log('%cKeyboard Shortcuts:', 'color: #64748b; font-size: 12px;');
    console.log('  Alt + D = Dashboard');
    console.log('  Alt + A = Appointments');
    console.log('  Alt + S = Schedule');
});

// ===== UTILITY FUNCTIONS =====
const StaffUtils = {
    // Show toast notification
    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `staff-toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 1rem;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        const icons = {
            success: 'check-circle-fill',
            error: 'x-circle-fill',
            warning: 'exclamation-triangle-fill',
            info: 'info-circle-fill'
        };

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        toast.innerHTML = `
            <i class="bi bi-${icons[type]}" style="font-size: 1.5rem; color: ${colors[type]}"></i>
            <span style="font-weight: 500; flex: 1;">${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: var(--gray);">
                <i class="bi bi-x-lg"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // Add animations
        if (!document.getElementById('staff-toast-animations')) {
            const style = document.createElement('style');
            style.id = 'staff-toast-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(400px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    // Format date
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format time
    formatTime: function(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    },

    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Calculate duration
    calculateDuration: function(startTime, endTime) {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const duration = endMinutes - startMinutes;
        
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        
        if (hours > 0 && minutes > 0) {
            return `${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${minutes}m`;
        }
    },

    // Get time until appointment
    getTimeUntil: function(dateStr, timeStr) {
        const appointmentDate = new Date(`${dateStr} ${timeStr}`);
        const now = new Date();
        const diff = appointmentDate - now;
        
        if (diff < 0) return 'Past';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `in ${days} day${days !== 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `in ${hours}h ${minutes}m`;
        } else {
            return `in ${minutes}m`;
        }
    }
};

// Export to window
window.StaffUtils = StaffUtils;