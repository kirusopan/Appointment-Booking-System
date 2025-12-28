/* =========================================
   CONTACT PAGE SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Initialize form validator
        new FormValidator('contactForm');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateContactForm()) {
                return;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
            
            // Simulate API call (replace with actual API in production)
            setTimeout(() => {
                console.log('Contact Form Data:', data);
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-loading');
                
                // Show success modal
                const successModal = new bootstrap.Modal(document.getElementById('contactSuccessModal'));
                successModal.show();
                
                // Reset form
                contactForm.reset();
                removeValidationClasses();
                
                // Show success toast
                if (window.Utils) {
                    window.Utils.showToast('Message sent successfully!', 'success');
                }
            }, 2000);
        });
    }
    
    // ===== FORM VALIDATION =====
    function validateContactForm() {
        const firstName = contactForm.querySelector('[name="firstName"]');
        const lastName = contactForm.querySelector('[name="lastName"]');
        const email = contactForm.querySelector('[name="email"]');
        const subject = contactForm.querySelector('[name="subject"]');
        const message = contactForm.querySelector('[name="message"]');
        
        let isValid = true;
        
        // Validate first name
        if (!firstName.value.trim()) {
            showError(firstName, 'First name is required');
            isValid = false;
        }
        
        // Validate last name
        if (!lastName.value.trim()) {
            showError(lastName, 'Last name is required');
            isValid = false;
        }
        
        // Validate email
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        }
        
        // Validate subject
        if (!subject.value) {
            showError(subject, 'Please select a subject');
            isValid = false;
        }
        
        // Validate message
        if (!message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'Message must be at least 10 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(input, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        
        let feedback = input.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            input.parentNode.insertBefore(feedback, input.nextSibling);
        }
        feedback.textContent = message;
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function removeValidationClasses() {
        const inputs = contactForm.querySelectorAll('.form-control, .form-select');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
        
        const feedbacks = contactForm.querySelectorAll('.invalid-feedback');
        feedbacks.forEach(feedback => feedback.remove());
    }
    
    // ===== REAL-TIME VALIDATION =====
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else if (this.type === 'email' && this.value.trim()) {
                if (isValidEmail(this.value)) {
                    this.classList.add('is-valid');
                    this.classList.remove('is-invalid');
                } else {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                }
            } else if (this.value.trim()) {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    });
    
    // ===== CHARACTER COUNTER =====
    const messageTextarea = contactForm.querySelector('[name="message"]');
    if (messageTextarea) {
        const counter = document.createElement('div');
        counter.className = 'character-counter text-muted small mt-1';
        counter.textContent = '0 / 1000 characters';
        messageTextarea.parentNode.appendChild(counter);
        
        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length} / 1000 characters`;
            
            if (length > 1000) {
                counter.classList.add('text-danger');
                this.classList.add('is-invalid');
            } else {
                counter.classList.remove('text-danger');
                if (length >= 10) {
                    this.classList.remove('is-invalid');
                }
            }
        });
    }
    
    // ===== SCROLL TO FORM FUNCTION =====
    window.scrollToForm = function() {
        const formSection = document.querySelector('.contact-form-section');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus first input after scroll
            setTimeout(() => {
                const firstInput = contactForm.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 1000);
        }
    };
    
    // ===== OPEN LIVE CHAT FUNCTION =====
    window.openLiveChat = function() {
        // In production, integrate with your live chat provider (Intercom, Drift, etc.)
        if (window.Utils) {
            window.Utils.showToast('Live chat opening...', 'info');
        }
        
        // Simulate chat opening
        setTimeout(() => {
            console.log('Live chat would open here');
            alert('Live chat feature would be integrated here with services like Intercom, Drift, or Tawk.to');
        }, 500);
    };
    
    // ===== ACCORDION SMOOTH SCROLL =====
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                if (!this.classList.contains('collapsed')) {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 350);
        });
    });
    
    // ===== FAQ SEARCH =====
    const createFAQSearch = () => {
        const faqSection = document.querySelector('.faq-section');
        if (!faqSection) return;
        
        const titleDiv = faqSection.querySelector('.text-center');
        const searchDiv = document.createElement('div');
        searchDiv.className = 'faq-search-container mx-auto mb-4';
        searchDiv.style.maxWidth = '600px';
        searchDiv.innerHTML = `
            <div class="search-box">
                <i class="bi bi-search"></i>
                <input type="text" id="faqSearch" class="form-control" placeholder="Search FAQs...">
            </div>
        `;
        titleDiv.after(searchDiv);
        
        const searchInput = document.getElementById('faqSearch');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const accordionItems = document.querySelectorAll('.accordion-item');
            let visibleCount = 0;
            
            accordionItems.forEach(item => {
                const question = item.querySelector('.accordion-button').textContent.toLowerCase();
                const answer = item.querySelector('.accordion-body').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show no results message
            let noResults = document.querySelector('.faq-no-results');
            if (visibleCount === 0 && searchTerm) {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.className = 'faq-no-results text-center py-5';
                    noResults.innerHTML = `
                        <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                        <h5>No FAQs Found</h5>
                        <p class="text-muted">Try different keywords or contact us directly</p>
                    `;
                    document.querySelector('.accordion').after(noResults);
                }
                noResults.style.display = 'block';
            } else if (noResults) {
                noResults.style.display = 'none';
            }
        });
    };
    
    createFAQSearch();
    
    // ===== COPY CONTACT INFO =====
    const addCopyButtons = () => {
        const contactLinks = document.querySelectorAll('.contact-link[href^="tel:"], .contact-link[href^="mailto:"]');
        
        contactLinks.forEach(link => {
            if (link.href.startsWith('tel:') || link.href.startsWith('mailto:')) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'btn btn-sm btn-outline-secondary ms-2';
                copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
                copyBtn.title = 'Copy to clipboard';
                copyBtn.style.padding = '0.25rem 0.5rem';
                
                copyBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const text = link.textContent.trim();
                    navigator.clipboard.writeText(text).then(() => {
                        if (window.Utils) {
                            window.Utils.showToast('Copied to clipboard!', 'success');
                        }
                        this.innerHTML = '<i class="bi bi-check"></i>';
                        setTimeout(() => {
                            this.innerHTML = '<i class="bi bi-clipboard"></i>';
                        }, 2000);
                    });
                });
                
                link.parentNode.style.display = 'flex';
                link.parentNode.style.alignItems = 'center';
                link.parentNode.style.justifyContent = 'center';
                link.after(copyBtn);
            }
        });
    };
    
    addCopyButtons();
    
    // ===== LAZY LOAD MAP =====
    const observeMap = () => {
        const mapSection = document.querySelector('.map-section');
        if (!mapSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = mapSection.querySelector('iframe');
                    if (iframe && iframe.dataset.src) {
                        iframe.src = iframe.dataset.src;
                        iframe.removeAttribute('data-src');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(mapSection);
    };
    
    observeMap();
    
    // ===== SMOOTH ANIMATIONS =====
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-animate]').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    };
    
    observeElements();
    
    // ===== ANALYTICS TRACKING =====
    const trackContactInteractions = () => {
        // Track method card clicks
        const methodCards = document.querySelectorAll('.contact-method-card');
        methodCards.forEach(card => {
            card.addEventListener('click', function() {
                const method = this.querySelector('h4').textContent;
                console.log('Contact method clicked:', method);
                // Send to analytics here
            });
        });
        
        // Track form submission
        if (contactForm) {
            contactForm.addEventListener('submit', function() {
                console.log('Contact form submitted');
                // Send to analytics here
            });
        }
    };
    
    trackContactInteractions();
    
    // ===== AUTO-FILL FROM URL PARAMS =====
    const autoFillFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('subject')) {
            const subjectSelect = contactForm.querySelector('[name="subject"]');
            const subject = urlParams.get('subject');
            if (subjectSelect) {
                subjectSelect.value = subject;
            }
        }
        
        if (urlParams.has('message')) {
            const messageTextarea = contactForm.querySelector('[name="message"]');
            const message = urlParams.get('message');
            if (messageTextarea) {
                messageTextarea.value = decodeURIComponent(message);
            }
        }
    };
    
    autoFillFromURL();
    
    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus FAQ search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const faqSearch = document.getElementById('faqSearch');
            if (faqSearch) {
                faqSearch.focus();
                faqSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    console.log('%c📧 Contact Page Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts: Ctrl+K to search FAQs', 'color: #64748b; font-size: 12px;');
});

// ===== EXPORT UTILITIES =====
window.ContactPageUtils = {
    scrollToForm: () => {
        window.scrollToForm();
    },
    
    openLiveChat: () => {
        window.openLiveChat();
    },
    
    prefillForm: (data) => {
        const form = document.getElementById('contactForm');
        if (form && data) {
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) input.value = data[key];
            });
        }
    }
};