/* =========================================
   AUTHENTICATION SCRIPTS (LOGIN & REGISTER)
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== LOGIN FORM HANDLING =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const data = {
                email: formData.get('email'),
                password: formData.get('password'),
                rememberMe: formData.get('rememberMe') === 'on'
            };
            
            // Validate
            if (!validateEmail(data.email)) {
                showFieldError(loginForm.querySelector('[name="email"]'), 'Please enter a valid email');
                return;
            }
            
            if (!data.password) {
                showFieldError(loginForm.querySelector('[name="password"]'), 'Password is required');
                return;
            }
            
            // Show loading
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
            
            // Simulate API call
            setTimeout(() => {
                console.log('Login Data:', data);
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-loading');
                
                // Store session (in real app, handle JWT token)
                sessionStorage.setItem('userLoggedIn', 'true');
                sessionStorage.setItem('userEmail', data.email);
                
                // Show success modal
                const modal = new bootstrap.Modal(document.getElementById('loginSuccessModal'));
                modal.show();
                
                // Show toast
                if (window.Utils) {
                    window.Utils.showToast('Login successful!', 'success');
                }
            }, 2000);
        });
    }
    
    // ===== REGISTER FORM HANDLING =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                agreeTerms: formData.get('agreeTerms') === 'on'
            };
            
            // Validate
            if (!data.firstName || !data.lastName) {
                if (window.Utils) window.Utils.showToast('Please fill in your name', 'error');
                return;
            }
            
            if (!validateEmail(data.email)) {
                showFieldError(registerForm.querySelector('[name="email"]'), 'Please enter a valid email');
                return;
            }
            
            if (data.password.length < 8) {
                showFieldError(registerForm.querySelector('[name="password"]'), 'Password must be at least 8 characters');
                return;
            }
            
            if (data.password !== data.confirmPassword) {
                showFieldError(registerForm.querySelector('[name="confirmPassword"]'), 'Passwords do not match');
                return;
            }
            
            if (!data.agreeTerms) {
                if (window.Utils) window.Utils.showToast('Please agree to the terms', 'error');
                return;
            }
            
            // Show loading
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating account...';
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
            
            // Simulate API call
            setTimeout(() => {
                console.log('Register Data:', data);
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-loading');
                
                // Store session
                sessionStorage.setItem('userLoggedIn', 'true');
                sessionStorage.setItem('userEmail', data.email);
                sessionStorage.setItem('userName', `${data.firstName} ${data.lastName}`);
                
                // Show success modal
                const modal = new bootstrap.Modal(document.getElementById('registerSuccessModal'));
                modal.show();
                
                // Show toast
                if (window.Utils) {
                    window.Utils.showToast('Account created successfully!', 'success');
                }
            }, 2000);
        });
    }
    
    // ===== PASSWORD TOGGLE =====
    window.togglePassword = function(inputId) {
        const input = document.getElementById(inputId);
        const toggle = input.nextElementSibling;
        const icon = toggle.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    };
    
    // ===== PASSWORD STRENGTH METER =====
    const passwordInput = document.getElementById('registerPassword');
    if (passwordInput) {
        const strengthIndicator = document.getElementById('passwordStrength');
        const strengthFill = strengthIndicator.querySelector('.strength-fill');
        const strengthText = strengthIndicator.querySelector('.strength-text');
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            
            if (password.length === 0) {
                strengthIndicator.classList.remove('active');
                return;
            }
            
            strengthIndicator.classList.add('active');
            
            let strength = calculatePasswordStrength(password);
            
            strengthFill.className = 'strength-fill';
            strengthText.className = 'strength-text';
            
            if (strength < 40) {
                strengthFill.classList.add('weak');
                strengthText.classList.add('weak');
                strengthText.textContent = 'Weak password';
            } else if (strength < 70) {
                strengthFill.classList.add('medium');
                strengthText.classList.add('medium');
                strengthText.textContent = 'Medium password';
            } else {
                strengthFill.classList.add('strong');
                strengthText.classList.add('strong');
                strengthText.textContent = 'Strong password';
            }
        });
    }
    
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 20;
        if (password.length >= 12) strength += 10;
        if (/[a-z]/.test(password)) strength += 15;
        if (/[A-Z]/.test(password)) strength += 15;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
        
        return strength;
    }
    
    // ===== CONFIRM PASSWORD VALIDATION =====
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value && this.value !== passwordInput.value) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                showFieldError(this, 'Passwords do not match');
            } else if (this.value === passwordInput.value) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                clearFieldError(this);
            }
        });
    }
    
    // ===== FORGOT PASSWORD =====
    window.showForgotPassword = function() {
        const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
        modal.show();
    };
    
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(forgotPasswordForm);
            const email = formData.get('resetEmail');
            
            if (!validateEmail(email)) {
                if (window.Utils) window.Utils.showToast('Please enter a valid email', 'error');
                return;
            }
            
            // Simulate API call
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                console.log('Reset password for:', email);
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                if (window.Utils) {
                    window.Utils.showToast('Reset link sent to your email!', 'success');
                }
                
                // Close modal
                bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal')).hide();
                
                // Reset form
                forgotPasswordForm.reset();
            }, 2000);
        });
    }
    
    // ===== REDIRECT TO DASHBOARD =====
    window.redirectToDashboard = function() {
        // In production, redirect to actual dashboard
        if (window.Utils) {
            window.Utils.showToast('Redirecting to dashboard...', 'info');
        }
        setTimeout(() => {
            window.location.href = 'index.html'; // Change to dashboard.html when created
        }, 1000);
    };
    
    // ===== VALIDATION HELPERS =====
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showFieldError(input, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        
        let feedback = input.parentNode.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            input.parentNode.after(feedback);
        }
        feedback.textContent = message;
    }
    
    function clearFieldError(input) {
        input.classList.remove('is-invalid');
        const feedback = input.parentNode.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.remove();
        }
    }
    
    // ===== REAL-TIME VALIDATION =====
    const formInputs = document.querySelectorAll('#loginForm input, #registerForm input');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('is-invalid');
            } else if (this.type === 'email' && this.value.trim()) {
                if (validateEmail(this.value)) {
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
                clearFieldError(this);
            }
        });
    });
    
    // ===== SOCIAL LOGIN (PLACEHOLDER) =====
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('btn-google') ? 'Google' : 'Facebook';
            if (window.Utils) {
                window.Utils.showToast(`${provider} login coming soon!`, 'info');
            }
            console.log(`${provider} OAuth would be triggered here`);
        });
    });
    
    // ===== CHECK IF ALREADY LOGGED IN =====
    const checkLoginStatus = () => {
        if (sessionStorage.getItem('userLoggedIn') === 'true') {
            console.log('User already logged in');
            // Optionally redirect to dashboard
            // window.location.href = 'dashboard.html';
        }
    };
    
    checkLoginStatus();
    
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
    
    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Enter to submit when focused on input
        if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
            const form = document.activeElement.closest('form');
            if (form) {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
    
    console.log('%c🔐 Auth Page Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});

// ===== EXPORT UTILITIES =====
window.AuthUtils = {
    login: (email, password) => {
        console.log('Login:', email);
        // Implement login logic
    },
    
    register: (userData) => {
        console.log('Register:', userData);
        // Implement registration logic
    },
    
    logout: () => {
        sessionStorage.removeItem('userLoggedIn');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userName');
        window.location.href = 'login.html';
    },
    
    isLoggedIn: () => {
        return sessionStorage.getItem('userLoggedIn') === 'true';
    },
    
    getCurrentUser: () => {
        return {
            email: sessionStorage.getItem('userEmail'),
            name: sessionStorage.getItem('userName')
        };
    }
};