/* =========================================
   ADMIN PANEL - BASE JAVASCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SIDEBAR TOGGLE =====
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // ===== ACTIVE NAV LINK =====
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });

    // ===== UTILITY FUNCTIONS =====
    window.AdminUtils = {
        showToast: function(message, type = 'info') {
            const toastContainer = document.getElementById('adminToastContainer') || this.createToastContainer();
            const toast = document.createElement('div');
            toast.className = `admin-toast admin-toast-${type}`;
            toast.innerHTML = `
                <i class="bi bi-${this.getToastIcon(type)} me-2"></i>
                <span>${message}</span>
            `;
            toastContainer.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },

        createToastContainer: function() {
            const container = document.createElement('div');
            container.id = 'adminToastContainer';
            container.style.cssText = `
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
            
            const style = document.createElement('style');
            style.textContent = `
                .admin-toast {
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    min-width: 300px;
                    opacity: 0;
                    transform: translateX(400px);
                    transition: all 0.3s ease;
                    border-left: 4px solid;
                }
                .admin-toast.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                .admin-toast-success { border-left-color: #10b981; color: #10b981; }
                .admin-toast-error { border-left-color: #ef4444; color: #ef4444; }
                .admin-toast-warning { border-left-color: #f59e0b; color: #f59e0b; }
                .admin-toast-info { border-left-color: #3b82f6; color: #3b82f6; }
            `;
            document.head.appendChild(style);
            
            return container;
        },

        getToastIcon: function(type) {
            const icons = {
                success: 'check-circle-fill',
                error: 'x-circle-fill',
                warning: 'exclamation-triangle-fill',
                info: 'info-circle-fill'
            };
            return icons[type] || icons.info;
        },

        formatDate: function(date) {
            return new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        },

        formatTime: function(time) {
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12;
            return `${formattedHour}:${minutes} ${ampm}`;
        },

        formatCurrency: function(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        },

        confirmAction: function(message, callback) {
            if (confirm(message)) {
                callback();
            }
        }
    };

    // ===== TABLE ACTIONS =====
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete')) {
            e.preventDefault();
            AdminUtils.confirmAction('Are you sure you want to delete this item?', () => {
                AdminUtils.showToast('Item deleted successfully', 'success');
            });
        }
    });

    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.querySelector('.topbar-search input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Searching for:', searchTerm);
        });
    }
});

// ===== CHART COLORS =====
window.ChartColors = {
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    gray: '#64748b'
};


/* =========================================
   ADMIN MODALS - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    // ===== UPDATE APPOINTMENT =====
    const updateAppointmentBtn = document.getElementById('updateAppointment');
    if (updateAppointmentBtn) {
        updateAppointmentBtn.addEventListener('click', () => {
            const form = document.getElementById('editAppointmentForm');
            if (form.checkValidity()) {
                AdminUtils.showToast('Appointment updated successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('editAppointmentModal')).hide();
            } else {
                form.reportValidity();
            }
        });
    }

    // ===== UPDATE SERVICE =====
    const updateServiceBtn = document.getElementById('updateService');
    if (updateServiceBtn) {
        updateServiceBtn.addEventListener('click', () => {
            const form = document.getElementById('editServiceForm');
            if (form.checkValidity()) {
                AdminUtils.showToast('Service updated successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('editServiceModal')).hide();
            } else {
                form.reportValidity();
            }
        });
    }

    // ===== UPDATE TEMPLATE =====
    const updateTemplateBtn = document.getElementById('updateTemplate');
    if (updateTemplateBtn) {
        updateTemplateBtn.addEventListener('click', () => {
            const form = document.getElementById('editTemplateForm');
            if (form.checkValidity()) {
                AdminUtils.showToast('Template updated successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('editTemplateModal')).hide();
            } else {
                form.reportValidity();
            }
        });
    }

    console.log('%c📋 Admin Modals Loaded', 'color: #6366f1; font-size: 14px; font-weight: bold;');
});