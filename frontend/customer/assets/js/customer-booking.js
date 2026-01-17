/* =========================================
   BOOKING PAGE SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== BOOKING STATE =====
    const bookingData = {
        service: null,
        serviceName: null,
        servicePrice: 0,
        serviceDuration: 0,
        provider: null,
        providerName: null,
        date: null,
        time: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: '',
        smsReminder: false
    };

    let currentStep = 1;
    const totalSteps = 5;

    // ===== STEP NAVIGATION =====
    const showStep = (stepNumber) => {
        // Hide all steps
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        document.getElementById(`step${stepNumber}`).classList.add('active');

        // Update progress indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const step = index + 1;
            if (step < stepNumber) {
                indicator.classList.add('completed');
                indicator.classList.remove('active');
            } else if (step === stepNumber) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else {
                indicator.classList.remove('active', 'completed');
            }
        });

        // Update progress lines
        document.querySelectorAll('.progress-line').forEach((line, index) => {
            if (index < stepNumber - 1) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        });

        // Update navigation buttons
        updateNavigationButtons(stepNumber);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateNavigationButtons = (stepNumber) => {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // Show/hide previous button
        if (stepNumber > 1) {
            prevBtn.style.display = 'block';
        } else {
            prevBtn.style.display = 'none';
        }

        // Show/hide next button (hide on last step)
        if (stepNumber < totalSteps) {
            nextBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'none';
        }

        // Disable next button initially for steps that require selection
        if (stepNumber === 1 || stepNumber === 2 || stepNumber === 3) {
            nextBtn.disabled = true;
        }
    };

    // ===== STEP 1: SELECT SERVICE =====
    const serviceCards = document.querySelectorAll('.service-card-wizard');
    
    serviceCards.forEach(card => {
        card.querySelector('.select-service-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            selectService(card);
        });

        card.addEventListener('click', function() {
            selectService(card);
        });
    });

    const selectService = (card) => {
        // Remove selected from all cards
        serviceCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected to clicked card
        card.classList.add('selected');
        
        // Store service data
        bookingData.service = card.getAttribute('data-service');
        bookingData.serviceName = card.querySelector('h4').textContent;
        bookingData.servicePrice = parseInt(card.getAttribute('data-price'));
        bookingData.serviceDuration = parseInt(card.getAttribute('data-duration'));
        
        // Enable next button
        document.getElementById('nextBtn').disabled = false;
        
        // Show feedback
        DashboardUtils.showToast(`Selected: ${bookingData.serviceName}`, 'success');
    };

    // ===== STEP 2: SELECT PROVIDER =====
    const providerCards = document.querySelectorAll('.provider-card-wizard');
    
    providerCards.forEach(card => {
        card.querySelector('.select-provider-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            selectProvider(card);
        });

        card.addEventListener('click', function() {
            selectProvider(card);
        });
    });

    const selectProvider = (card) => {
        // Remove selected from all cards
        providerCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected to clicked card
        card.classList.add('selected');
        
        // Store provider data
        bookingData.provider = card.getAttribute('data-provider');
        bookingData.providerName = card.querySelector('h4').textContent;
        
        // Enable next button
        document.getElementById('nextBtn').disabled = false;
        
        // Show feedback
        DashboardUtils.showToast(`Selected: ${bookingData.providerName}`, 'success');
    };

    // ===== STEP 3: CALENDAR & TIME SLOTS =====
    let currentDate = new Date();
    let selectedDate = null;

    const generateCalendar = (year, month) => {
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);

        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDay();
        const nextDays = 7 - lastDayIndex - 1;

        // Update header
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        document.querySelector('.current-month-year').textContent = `${monthNames[month]} ${year}`;

        // Previous month days
        for (let x = firstDayIndex; x > 0; x--) {
            const day = document.createElement('div');
            day.className = 'calendar-day disabled';
            day.textContent = prevLastDay.getDate() - x + 1;
            calendarDays.appendChild(day);
        }

        // Current month days
        const today = new Date();
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day';
            day.textContent = i;

            const dayDate = new Date(year, month, i);
            
            // Disable past dates
            if (dayDate < today.setHours(0, 0, 0, 0)) {
                day.classList.add('disabled');
            }

            // Mark today
            if (dayDate.toDateString() === new Date().toDateString()) {
                day.classList.add('today');
            }

            // Click event
            if (!day.classList.contains('disabled')) {
                day.addEventListener('click', function() {
                    selectDate(year, month, i, this);
                });
            }

            calendarDays.appendChild(day);
        }

        // Next month days
        for (let j = 1; j <= nextDays; j++) {
            const day = document.createElement('div');
            day.className = 'calendar-day disabled';
            day.textContent = j;
            calendarDays.appendChild(day);
        }
    };

    const selectDate = (year, month, day, element) => {
        // Remove selected from all days
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        
        // Add selected to clicked day
        element.classList.add('selected');
        
        // Store date
        selectedDate = new Date(year, month, day);
        bookingData.date = selectedDate.toISOString().split('T')[0];
        
        // Update display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        document.querySelector('.selected-date-display').textContent = 
            `${monthNames[month]} ${day}, ${year}`;
        
        // Generate time slots
        generateTimeSlots();
    };

    const generateTimeSlots = () => {
        const timeslotsGrid = document.getElementById('timeslotsGrid');
        timeslotsGrid.innerHTML = '';

        // Generate slots from 9 AM to 5 PM
        const startHour = 9;
        const endHour = 17;

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeSlot = document.createElement('div');
                timeSlot.className = 'timeslot';
                
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour > 12 ? hour - 12 : hour;
                const displayMinute = minute === 0 ? '00' : minute;
                const timeString = `${displayHour}:${displayMinute} ${period}`;
                
                timeSlot.textContent = timeString;
                timeSlot.setAttribute('data-time', `${hour.toString().padStart(2, '0')}:${displayMinute}`);

                // Randomly mark some as booked (for demo)
                if (Math.random() > 0.7) {
                    timeSlot.classList.add('booked');
                }

                timeSlot.addEventListener('click', function() {
                    if (!this.classList.contains('booked')) {
                        selectTimeSlot(this, timeString);
                    }
                });

                timeslotsGrid.appendChild(timeSlot);
            }
        }
    };

    const selectTimeSlot = (element, timeString) => {
        // Remove selected from all slots
        document.querySelectorAll('.timeslot').forEach(slot => slot.classList.remove('selected'));
        
        // Add selected to clicked slot
        element.classList.add('selected');
        
        // Store time
        bookingData.time = element.getAttribute('data-time');
        
        // Enable next button
        document.getElementById('nextBtn').disabled = false;
        
        // Show feedback
        DashboardUtils.showToast(`Selected: ${timeString}`, 'success');
    };

    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    // Initialize calendar
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

    // ===== STEP 4: COLLECT DETAILS =====
    const detailsForm = document.querySelector('.details-form');
    
    // Enable next button when form is valid
    const validateDetailsForm = () => {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const termsAgree = document.getElementById('termsAgree').checked;

        if (firstName && lastName && email && phone && termsAgree) {
            document.getElementById('nextBtn').disabled = false;
        } else {
            document.getElementById('nextBtn').disabled = true;
        }
    };

    document.getElementById('firstName').addEventListener('input', validateDetailsForm);
    document.getElementById('lastName').addEventListener('input', validateDetailsForm);
    document.getElementById('email').addEventListener('input', validateDetailsForm);
    document.getElementById('phone').addEventListener('input', validateDetailsForm);
    document.getElementById('termsAgree').addEventListener('change', validateDetailsForm);

    const collectDetailsData = () => {
        bookingData.firstName = document.getElementById('firstName').value.trim();
        bookingData.lastName = document.getElementById('lastName').value.trim();
        bookingData.email = document.getElementById('email').value.trim();
        bookingData.phone = document.getElementById('phone').value.trim();
        bookingData.notes = document.getElementById('notes').value.trim();
        bookingData.smsReminder = document.getElementById('smsReminder').checked;
    };

    // ===== STEP 5: SHOW CONFIRMATION =====
    const showConfirmation = () => {
        // Update summary
        document.getElementById('summaryService').textContent = bookingData.serviceName;
        document.getElementById('summaryProvider').textContent = bookingData.providerName;
        
        const dateObj = new Date(bookingData.date);
        const dateString = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        document.getElementById('summaryDate').textContent = dateString;
        
        const [hours, minutes] = bookingData.time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        document.getElementById('summaryTime').textContent = `${displayHour}:${minutes} ${period}`;
        
        document.getElementById('summaryDuration').textContent = `${bookingData.serviceDuration} minutes`;
        
        document.getElementById('summaryCustomer').textContent = 
            `${bookingData.firstName} ${bookingData.lastName}`;
        document.getElementById('summaryEmail').textContent = bookingData.email;
        document.getElementById('summaryPhone').textContent = bookingData.phone;
        
        document.getElementById('summaryTotal').textContent = `$${bookingData.servicePrice}.00`;
    };

    // ===== CONFIRM BOOKING =====
    document.getElementById('confirmBookingBtn').addEventListener('click', function() {
        this.disabled = true;
        this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
        
        // Simulate API call
        setTimeout(() => {
            console.log('Booking data:', bookingData);
            
            // Show success modal
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
            
            // Reset button
            this.disabled = false;
            this.innerHTML = '<i class="bi bi-check-circle me-2"></i>Confirm Booking';
        }, 2000);
    });

    // ===== NAVIGATION BUTTONS =====
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentStep < totalSteps) {
            // Collect data before moving to next step
            if (currentStep === 4) {
                collectDetailsData();
            }
            
            currentStep++;
            showStep(currentStep);
            
            // Show confirmation on last step
            if (currentStep === 5) {
                showConfirmation();
            }
        }
    });

    // ===== INITIALIZE =====
    showStep(currentStep);
    
    // Check for pre-selected service (from other pages)
    const preSelectedService = sessionStorage.getItem('selectedService');
    if (preSelectedService) {
        try {
            const serviceData = JSON.parse(preSelectedService);
            // Auto-select matching service
            serviceCards.forEach(card => {
                if (card.querySelector('h4').textContent === serviceData.name) {
                    selectService(card);
                }
            });
            sessionStorage.removeItem('selectedService');
        } catch (e) {
            console.error('Error loading pre-selected service:', e);
        }
    }

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Arrow keys for navigation
        if (e.key === 'ArrowLeft' && currentStep > 1) {
            document.getElementById('prevBtn').click();
        }
        if (e.key === 'ArrowRight' && currentStep < totalSteps && 
            !document.getElementById('nextBtn').disabled) {
            document.getElementById('nextBtn').click();
        }
    });

    // ===== LOG INFO =====
    console.log('%c📅 Booking Page Loaded', 'color: #6366f1; font-size: 18px; font-weight: bold;');
    console.log('%cUse Arrow keys to navigate between steps', 'color: #64748b; font-size: 14px;');
});

// ===== EXPORT UTILITIES =====
window.BookingPageUtils = {
    getBookingData: () => bookingData,
    
    jumpToStep: (step) => {
        if (step >= 1 && step <= 5) {
            currentStep = step;
            showStep(currentStep);
        }
    }
};