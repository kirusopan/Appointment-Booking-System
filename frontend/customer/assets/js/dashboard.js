/* =========================================
   DASHBOARD BASE JAVASCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SIDEBAR TOGGLE =====
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    const toggleSidebar = () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    };

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', toggleSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Close sidebar on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991 && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // ===== ACTIVE NAV LINK =====
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
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

    // ===== NOTIFICATION MANAGEMENT =====
    const notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.opacity = '0.5';
            setTimeout(() => {
                this.remove();
                updateNotificationCount();
            }, 300);
        });
    });

    const updateNotificationCount = () => {
        const count = document.querySelectorAll('.notification-item').length;
        const badge = document.querySelector('.notification-badge');
        
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
            } else {
                badge.style.display = 'none';
            }
        }
    };

    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.querySelector('.search-box input');
    
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.2)';
        });

        searchInput.addEventListener('blur', function() {
            this.parentElement.style.boxShadow = 'none';
        });

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            // Add your search logic here
            console.log('Searching for:', searchTerm);
        });
    }

    // ===== SMOOTH SCROLL =====
    const smoothScroll = (target) => {
        document.querySelector(target)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    // ===== DROPDOWN AUTO CLOSE =====
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu.show');
            dropdowns.forEach(dropdown => {
                const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
                if (bsDropdown) bsDropdown.hide();
            });
        }
    });

    // ===== CONSOLE WELCOME =====
    console.log('%c🎯 Dashboard Loaded', 'color: #6366f1; font-size: 18px; font-weight: bold;');
    console.log('%cWelcome to BookEase Dashboard!', 'color: #64748b; font-size: 14px;');
});

// ===== UTILITY FUNCTIONS =====
const DashboardUtils = {
    // Show toast notification
    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideIn 0.3s ease-out;
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
            <span style="font-weight: 500;">${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        // Add animations
        if (!document.getElementById('toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(400px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
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
    }
};

// Export to window
window.DashboardUtils = DashboardUtils;