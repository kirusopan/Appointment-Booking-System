/* =========================================
   BOOKEASE - MAIN JAVASCRIPT
   Common utilities and interactions
   ========================================= */

// ===== GLOBAL UTILITIES =====
const Utils = {
    // Smooth scroll to element
    smoothScroll: function(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Show toast notification
    showToast: function(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
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
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
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

    // Format date
    formatDate: function(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
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
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone
    validatePhone: function(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    // Show loading
    showLoading: function(element) {
        const loader = document.createElement('div');
        loader.className = 'spinner-overlay';
        loader.innerHTML = '<div class="spinner"></div>';
        element.style.position = 'relative';
        element.appendChild(loader);
    },

    // Hide loading
    hideLoading: function(element) {
        const loader = element.querySelector('.spinner-overlay');
        if (loader) loader.remove();
    }
};

// ===== NAVBAR SCROLL EFFECT =====
class NavbarHandler {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('navbar-scrolled');
        } else {
            this.navbar.classList.remove('navbar-scrolled');
        }
    }
}

// ===== ANIMATE ON SCROLL =====
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        this.elements.forEach(el => this.observer.observe(el));
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.dataset.animate;
                entry.target.classList.add(animation);
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ===== FORM VALIDATION =====
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.addRealTimeValidation();
    }

    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.validateForm()) {
            return true;
        }
        return false;
    }

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let message = '';

        // Required check
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email check
        if (input.type === 'email' && value && !Utils.validateEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email';
        }

        // Phone check
        if (input.type === 'tel' && value && !Utils.validatePhone(value)) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }

        // Min length check
        if (input.minLength && value.length < input.minLength) {
            isValid = false;
            message = `Minimum ${input.minLength} characters required`;
        }

        if (!isValid) {
            this.showError(input, message);
        } else {
            this.clearError(input);
        }

        return isValid;
    }

    showError(input, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        
        let errorDiv = input.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            input.parentNode.insertBefore(errorDiv, input.nextSibling);
        }
        errorDiv.textContent = message;
    }

    clearError(input) {
        input.classList.remove('is-invalid');
        if (input.value.trim()) {
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
        }
        
        const errorDiv = input.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
            errorDiv.textContent = '';
        }
    }
}

// ===== MODAL HANDLER =====
class ModalHandler {
    static show(modalId) {
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
    }

    static hide(modalId) {
        const modalElement = document.getElementById(modalId);
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    }
}

// ===== INITIALIZE ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar handler
    new NavbarHandler();

    // Initialize scroll animations
    new ScrollAnimations();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                Utils.smoothScroll(href);
            }
        });
    });

    // Auto-close mobile menu on link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getInstance(navbarCollapse).hide();
            }
        });
    });

    // Add active class to current page nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// ===== EXPORT UTILITIES FOR GLOBAL USE =====
window.Utils = Utils;
window.FormValidator = FormValidator;
window.ModalHandler = ModalHandler;


/* =========================================
   HOME PAGE SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ANIMATED COUNTER =====
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };

    // Trigger counter animation when stats are visible
    const observeStats = () => {
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = [
                        { element: document.querySelector('.hero-stats .stat-item:nth-child(1) h4'), value: 5000 },
                        { element: document.querySelector('.hero-stats .stat-item:nth-child(2) h4'), value: 15000 },
                    ];

                    counters.forEach(counter => {
                        if (counter.element && !counter.element.classList.contains('counted')) {
                            counter.element.classList.add('counted');
                            animateCounter(counter.element, counter.value);
                        }
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    };

    observeStats();

    // ===== TESTIMONIAL CAROUSEL AUTO-ROTATE =====
    const testimonialAutoRotate = () => {
        const testimonials = document.querySelectorAll('.testimonial-card');
        if (testimonials.length === 0) return;

        let currentIndex = 0;

        const highlightTestimonial = () => {
            testimonials.forEach((card, index) => {
                if (index === currentIndex) {
                    card.style.transform = 'scale(1.05)';
                    card.style.zIndex = '10';
                } else {
                    card.style.transform = 'scale(1)';
                    card.style.zIndex = '1';
                }
            });

            currentIndex = (currentIndex + 1) % testimonials.length;
        };

        // Initial highlight
        highlightTestimonial();

        // Auto-rotate every 5 seconds
        setInterval(highlightTestimonial, 5000);
    };

    // Uncomment to enable auto-rotate
    // testimonialAutoRotate();

    // ===== SERVICE CARDS HOVER EFFECT =====
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // ===== STAFF AVAILABILITY STATUS =====
    const updateStaffAvailability = () => {
        const staffStatuses = document.querySelectorAll('.staff-status');
        
        staffStatuses.forEach(status => {
            // Add pulse animation to available status
            if (status.classList.contains('available')) {
                status.style.animation = 'pulse 2s infinite';
            }
        });

        // Add pulse keyframes dynamically
        if (!document.getElementById('pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `;
            document.head.appendChild(style);
        }
    };

    updateStaffAvailability();

    // ===== SMOOTH REVEAL ON SCROLL =====
    const revealOnScroll = () => {
        const reveals = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
            observer.observe(element);
        });
    };

    revealOnScroll();

    // ===== DYNAMIC GREETING =====
    const setDynamicGreeting = () => {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const hour = new Date().getHours();
        let greeting = 'Book Your Perfect';

        if (hour >= 5 && hour < 12) {
            greeting = 'Start Your Day With';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Book Your Perfect';
        } else if (hour >= 17 && hour < 22) {
            greeting = 'Plan Your Next';
        } else {
            greeting = 'Schedule Your';
        }

        // Optional: Update greeting text (disabled by default)
        // heroTitle.innerHTML = `${greeting}<span class="text-gradient d-block">Appointment Today</span>`;
    };

    setDynamicGreeting();

    // ===== HERO CTA BUTTONS ANIMATION =====
    const animateCTAButtons = () => {
        const ctaButtons = document.querySelectorAll('.hero-buttons .btn, .cta-buttons .btn');
        
        ctaButtons.forEach((button, index) => {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                button.style.transition = 'all 0.5s ease-out';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 300 + (index * 150));
        });
    };

    animateCTAButtons();

    // ===== PARALLAX EFFECT FOR HERO =====
    const parallaxEffect = () => {
        const hero = document.querySelector('.hero-section');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.container');
            
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    };

    // Uncomment to enable parallax
    // parallaxEffect();

    // ===== INTERACTIVE FEATURES CARDS =====
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'rotate(360deg) scale(1.1)';
                icon.style.transition = 'all 0.6s ease';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });

    // ===== BOOKING BUTTON CLICK TRACKING =====
    const trackBookingClicks = () => {
        const bookingButtons = document.querySelectorAll('a[href="booking.html"]');
        
        bookingButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Add a small visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);

                // You can add analytics tracking here
                console.log('Booking button clicked from:', this.closest('section')?.className || 'unknown section');
            });
        });
    };

    trackBookingClicks();

    // ===== SCROLL PROGRESS INDICATOR =====
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            width: 0%;
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    };

    createScrollProgress();

    // ===== ADD RIPPLE EFFECT TO BUTTONS =====
    const addRippleEffect = () => {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    left: ${x}px;
                    top: ${y}px;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    };

    addRippleEffect();

    // ===== LAZY LOADING IMAGES =====
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    };

    lazyLoadImages();

    // ===== CONSOLE WELCOME MESSAGE =====
    console.log('%c🚀 BookEase Appointment System', 'color: #6366f1; font-size: 20px; font-weight: bold;');
    console.log('%cWelcome! This is a professional booking platform.', 'color: #64748b; font-size: 14px;');
});

// ===== UTILITY: GET BOOKING STATS (FOR FUTURE USE) =====
const getBookingStats = () => {
    return {
        totalClients: 5000,
        totalBookings: 15000,
        averageRating: 4.9,
        timestamp: new Date().toISOString()
    };
};

// Export for use in other scripts
window.HomePageUtils = {
    getBookingStats
};