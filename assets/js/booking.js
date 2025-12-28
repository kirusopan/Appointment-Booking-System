/* =========================================
   BOOKING PAGE SCRIPTS
   ========================================= */

let currentStep = 1;
let bookingData = {
    service: '',
    servicePrice: 0,
    serviceDuration: 0,
    staff: 'Any Available',
    date: '',
    time: '',
    fullName: '',
    email: '',
    phone: '',
    contactMethod: 'email',
    notes: ''
};

// Current calendar month
let currentDate = new Date();
let selectedDate = null;

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== INITIALIZE =====
    initializeCalendar();
    loadPreSelectedData();
    setupEventListeners();
    
    // ===== STEP NAVIGATION =====
    window.nextStep = function() {
        if (validateCurrentStep()) {
            if (currentStep < 4) {
                // Mark current as completed
                document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('completed');
                
                currentStep++;
                updateStepDisplay();
                updateProgressBar();
                updateSummary();
                scrollToTop();
            }
        }
    };

    window.prevStep = function() {
        if (currentStep > 1) {
            // Remove completed from next step
            document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('completed');
            
            currentStep--;
            updateStepDisplay();
            updateProgressBar();
            scrollToTop();
        }
    };

    function updateStepDisplay() {
        document.querySelectorAll('.booking-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(`step${currentStep}`).classList.add('active');
    }

    function updateProgressBar() {
        document.querySelectorAll('.progress-step').forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.remove('active');
            
            if (stepNum === currentStep) {
                step.classList.add('active');
            }
        });
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===== VALIDATION =====
    function validateCurrentStep() {
        if (currentStep === 1) {
            const selected = document.querySelector('input[name="service"]:checked');
            if (!selected) {
                if (window.Utils) window.Utils.showToast('Please select a service', 'warning');
                return false;
            }
            bookingData.service = selected.value;
            const serviceOption = selected.closest('.service-option');
            bookingData.servicePrice = parseInt(serviceOption.getAttribute('data-price'));
            bookingData.serviceDuration = parseInt(serviceOption.getAttribute('data-duration'));
        }

        if (currentStep === 2) {
            const selected = document.querySelector('input[name="staff"]:checked');
            bookingData.staff = selected ? selected.value : 'Any Available';
        }

        if (currentStep === 3) {
            if (!bookingData.date || !bookingData.time) {
                if (window.Utils) window.Utils.showToast('Please select date and time', 'warning');
                return false;
            }
        }

        return true;
    }

    // ===== SERVICE SELECTION =====
    function setupEventListeners() {
        document.querySelectorAll('input[name="service"]').forEach(input => {
            input.addEventListener('change', function() {
                const serviceOption = this.closest('.service-option');
                bookingData.service = this.value;
                bookingData.servicePrice = parseInt(serviceOption.getAttribute('data-price'));
                bookingData.serviceDuration = parseInt(serviceOption.getAttribute('data-duration'));
            });
        });

        document.querySelectorAll('input[name="staff"]').forEach(input => {
            input.addEventListener('change', function() {
                bookingData.staff = this.value;
            });
        });
    }

    // ===== CALENDAR FUNCTIONALITY =====
    function initializeCalendar() {
        renderCalendar();
        
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update header
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

        // Get first day and days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        // Build calendar grid
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day header';
            header.textContent = day;
            calendar.appendChild(header);
        });

        // Add empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day disabled';
            calendar.appendChild(empty);
        }

        // Add days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const dayDate = new Date(year, month, day);
            
            // Check if past date
            if (dayDate < today.setHours(0, 0, 0, 0)) {
                dayElement.classList.add('disabled');
            } else {
                // Check if today
                if (dayDate.toDateString() === new Date().toDateString()) {
                    dayElement.classList.add('today');
                }

                // Check if selected
                if (selectedDate && dayDate.toDateString() === selectedDate.toDateString()) {
                    dayElement.classList.add('selected');
                }

                // Add click handler
                dayElement.addEventListener('click', function() {
                    document.querySelectorAll('.calendar-day.selected').forEach(d => {
                        d.classList.remove('selected');
                    });
                    this.classList.add('selected');
                    selectedDate = dayDate;
                    bookingData.date = formatDate(dayDate);
                    generateTimeSlots();
                });
            }

            calendar.appendChild(dayElement);
        }
    }

    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // ===== TIME SLOTS =====
    function generateTimeSlots() {
        const timeSlotsContainer = document.getElementById('timeSlots');
        timeSlotsContainer.innerHTML = '<div class="time-slots-grid"></div>';
        const grid = timeSlotsContainer.querySelector('.time-slots-grid');

        // Generate time slots from 9 AM to 5 PM
        const startHour = 9;
        const endHour = 17;
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute of [0, 30]) {
                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
                
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour > 12 ? hour - 12 : hour;
                const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
                
                timeSlot.textContent = timeString;
                
                // Randomly disable some slots (simulate unavailable)
                if (Math.random() > 0.7) {
                    timeSlot.classList.add('disabled');
                    timeSlot.title = 'Not available';
                } else {
                    timeSlot.addEventListener('click', function() {
                        if (!this.classList.contains('disabled')) {
                            document.querySelectorAll('.time-slot.selected').forEach(slot => {
                                slot.classList.remove('selected');
                            });
                            this.classList.add('selected');
                            bookingData.time = timeString;
                        }
                    });
                }
                
                grid.appendChild(timeSlot);
            }
        }
    }

    // ===== UPDATE SUMMARY =====
    function updateSummary() {
        document.getElementById('summaryService').textContent = bookingData.service || '-';
        document.getElementById('summaryStaff').textContent = bookingData.staff || '-';
        document.getElementById('summaryDate').textContent = bookingData.date || '-';
        document.getElementById('summaryTime').textContent = bookingData.time || '-';
        document.getElementById('summaryDuration').textContent = bookingData.serviceDuration ? `${bookingData.serviceDuration} minutes` : '-';
        document.getElementById('summaryPrice').textContent = bookingData.servicePrice ? `$${bookingData.servicePrice}` : '$0';
    }

    // ===== FORM SUBMISSION =====
    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        bookingData.fullName = formData.get('fullName');
        bookingData.email = formData.get('email');
        bookingData.phone = formData.get('phone');
        bookingData.contactMethod = formData.get('contactMethod');
        bookingData.notes = formData.get('notes');

        // Validate
        if (!bookingData.fullName || !bookingData.email || !bookingData.phone) {
            if (window.Utils) window.Utils.showToast('Please fill in all required fields', 'error');
            return;
        }

        // Generate booking ID
        const bookingId = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
        document.getElementById('bookingId').textContent = `#${bookingId}`;

        // Show success modal
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();

        // Log booking data (in real app, send to server)
        console.log('Booking Data:', bookingData);
        console.log('Booking ID:', bookingId);

        // Reset form
        setTimeout(() => {
            resetBooking();
        }, 1000);
    });

    // ===== RESET BOOKING =====
    function resetBooking() {
        currentStep = 1;
        bookingData = {
            service: '',
            servicePrice: 0,
            serviceDuration: 0,
            staff: 'Any Available',
            date: '',
            time: '',
            fullName: '',
            email: '',
            phone: '',
            contactMethod: 'email',
            notes: ''
        };
        selectedDate = null;
        
        form.reset();
        document.querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        document.querySelector('.progress-step[data-step="1"]').classList.add('active');
        updateStepDisplay();
    }

    // ===== LOAD PRE-SELECTED DATA =====
    function loadPreSelectedData() {
        // Check if service was selected from services page
        const preSelectedService = sessionStorage.getItem('selectedService');
        if (preSelectedService) {
            const serviceData = JSON.parse(preSelectedService);
            console.log('Pre-selected service:', serviceData);
            // Auto-select the service if it matches
            sessionStorage.removeItem('selectedService');
        }

        // Check if staff was selected from staff page
        const preSelectedStaff = sessionStorage.getItem('selectedStaff');
        if (preSelectedStaff) {
            console.log('Pre-selected staff:', preSelectedStaff);
            // Auto-select the staff member
            const staffInput = document.querySelector(`input[value="${preSelectedStaff}"]`);
            if (staffInput) {
                staffInput.checked = true;
                bookingData.staff = preSelectedStaff;
            }
            sessionStorage.removeItem('selectedStaff');
        }
    }

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Alt + Right Arrow = Next Step
        if (e.altKey && e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentStep < 4) nextStep();
        }
        
        // Alt + Left Arrow = Previous Step
        if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentStep > 1) prevStep();
        }
    });

    // ===== AUTOFILL TEST DATA (for development) =====
    window.fillTestData = function() {
        document.querySelector('input[name="fullName"]').value = 'John Doe';
        document.querySelector('input[name="email"]').value = 'john@example.com';
        document.querySelector('input[name="phone"]').value = '+1 234 567 8900';
        document.querySelector('textarea[name="notes"]').value = 'This is a test booking.';
        console.log('Test data filled!');
    };

    // ===== REAL-TIME VALIDATION =====
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                if (this.value.trim() !== '') {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                }
            }
        });
    });

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

    console.log('%c📅 Booking Page Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts: Alt+→ Next, Alt+← Previous', 'color: #64748b; font-size: 12px;');
    console.log('%cDev Tool: fillTestData() to auto-fill form', 'color: #64748b; font-size: 12px;');
});

// ===== EXPORT UTILITIES =====
window.BookingUtils = {
    goToStep: (step) => {
        if (step >= 1 && step <= 4) {
            currentStep = step;
            updateStepDisplay();
            updateProgressBar();
        }
    },
    
    getBookingData: () => {
        return { ...bookingData };
    },
    
    setBookingData: (data) => {
        bookingData = { ...bookingData, ...data };
        updateSummary();
    }
};