/* =========================================
   STAFF SCHEDULE PAGE SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    let currentDate = new Date(2024, 11, 28); // December 28, 2024
    let currentView = 'day';

    // ===== VIEW SWITCHER =====
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentView = this.getAttribute('data-view');
            StaffUtils.showToast(`Switched to ${currentView} view`, 'info');
            
            // You can load different view layouts here
            // loadScheduleView(currentView);
        });
    });

    // ===== DATE NAVIGATION =====
    const prevDateBtn = document.getElementById('prevDate');
    const nextDateBtn = document.getElementById('nextDate');
    const todayBtn = document.getElementById('todayBtn');
    const currentDateDisplay = document.getElementById('currentDateDisplay');

    const updateDateDisplay = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateDisplay.textContent = currentDate.toLocaleDateString('en-US', options);
    };

    if (prevDateBtn) {
        prevDateBtn.addEventListener('click', function() {
            if (currentView === 'day') {
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (currentView === 'week') {
                currentDate.setDate(currentDate.getDate() - 7);
            } else if (currentView === 'month') {
                currentDate.setMonth(currentDate.getMonth() - 1);
            }
            updateDateDisplay();
            StaffUtils.showToast('Date updated', 'info');
        });
    }

    if (nextDateBtn) {
        nextDateBtn.addEventListener('click', function() {
            if (currentView === 'day') {
                currentDate.setDate(currentDate.getDate() + 1);
            } else if (currentView === 'week') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (currentView === 'month') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            updateDateDisplay();
            StaffUtils.showToast('Date updated', 'info');
        });
    }

    if (todayBtn) {
        todayBtn.addEventListener('click', function() {
            currentDate = new Date();
            updateDateDisplay();
            StaffUtils.showToast('Jumped to today', 'success');
        });
    }

    // ===== STATUS FILTER =====
    const statusFilter = document.getElementById('statusFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const status = this.value;
            filterAppointments(status);
        });
    }

    const filterAppointments = (status) => {
        const appointments = document.querySelectorAll('.appointment-slot-content');
        
        appointments.forEach(apt => {
            if (status === 'all') {
                apt.closest('.time-slot').style.display = 'flex';
            } else {
                const aptStatus = apt.classList.contains(status);
                apt.closest('.time-slot').style.display = aptStatus ? 'flex' : 'none';
            }
        });

        StaffUtils.showToast(`Filtered by: ${status}`, 'info');
    };

    // ===== ADD APPOINTMENT BUTTONS =====
    const addAppointmentBtns = document.querySelectorAll('.add-appointment-btn');
    
    addAppointmentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const timeSlot = this.closest('.time-slot');
            const timeLabel = timeSlot.querySelector('.time-label').textContent;
            
            StaffUtils.showToast(`Adding appointment at ${timeLabel}`, 'info');
            // Open appointment modal here
        });
    });

    // ===== APPOINTMENT ACTIONS =====
    
    // Edit Appointment
    const editBtns = document.querySelectorAll('.btn-mini:has(.bi-pencil)');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const appointment = this.closest('.appointment-slot-content');
            const title = appointment.querySelector('.appointment-title').textContent;
            
            StaffUtils.showToast(`Editing: ${title}`, 'info');
            // Open edit modal
        });
    });

    // Cancel/Remove Appointment
    const cancelBtns = document.querySelectorAll('.appointment-actions-mini .btn-mini:has(.bi-x-lg)');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const appointment = this.closest('.appointment-slot-content');
            const title = appointment.querySelector('.appointment-title').textContent;
            
            if (confirm(`Cancel appointment: ${title}?`)) {
                const timeSlot = this.closest('.time-slot');
                timeSlot.style.opacity = '0';
                timeSlot.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    // Convert to available slot
                    timeSlot.classList.remove('booked');
                    timeSlot.classList.add('empty');
                    timeSlot.querySelector('.slot-content').className = 'slot-content available-slot';
                    timeSlot.querySelector('.slot-content').innerHTML = `
                        <button class="add-appointment-btn">
                            <i class="bi bi-plus-circle"></i>
                            <span>Add Appointment</span>
                        </button>
                    `;
                    timeSlot.style.opacity = '1';
                    timeSlot.style.transform = 'translateX(0)';
                    
                    StaffUtils.showToast('Appointment cancelled', 'success');
                }, 300);
            }
        });
    });

    // Accept Pending Request
    const acceptBtns = document.querySelectorAll('.btn-mini.btn-success');
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const appointment = this.closest('.appointment-slot-content');
            const title = appointment.querySelector('.appointment-title').textContent;
            
            if (confirm(`Accept appointment request: ${title}?`)) {
                appointment.classList.remove('pending');
                appointment.classList.add('confirmed');
                appointment.style.borderLeftColor = 'var(--primary)';
                
                // Remove pending badge
                const pendingBadge = appointment.querySelector('.pending-badge');
                if (pendingBadge) pendingBadge.remove();
                
                // Replace action buttons
                const actionsDiv = appointment.querySelector('.appointment-actions-mini');
                actionsDiv.innerHTML = `
                    <button class="btn-mini" title="Edit"><i class="bi bi-pencil"></i></button>
                    <button class="btn-mini" title="Cancel"><i class="bi bi-x-lg"></i></button>
                `;
                
                StaffUtils.showToast(`Accepted: ${title}`, 'success');
            }
        });
    });

    // Decline Pending Request
    const declineBtns = document.querySelectorAll('.appointment-actions-mini .btn-mini.btn-danger');
    declineBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const appointment = this.closest('.appointment-slot-content');
            const title = appointment.querySelector('.appointment-title').textContent;
            
            if (confirm(`Decline appointment request: ${title}?`)) {
                const timeSlot = this.closest('.time-slot');
                timeSlot.style.opacity = '0';
                
                setTimeout(() => {
                    // Convert to available slot
                    timeSlot.classList.remove('booked');
                    timeSlot.classList.add('empty');
                    timeSlot.querySelector('.slot-content').className = 'slot-content available-slot';
                    timeSlot.querySelector('.slot-content').innerHTML = `
                        <button class="add-appointment-btn">
                            <i class="bi bi-plus-circle"></i>
                            <span>Add Appointment</span>
                        </button>
                    `;
                    timeSlot.style.opacity = '1';
                    
                    StaffUtils.showToast(`Declined: ${title}`, 'info');
                }, 300);
            }
        });
    });

    // Remove Blocked Slot
    const removeBlockedBtns = document.querySelectorAll('.blocked-slot-content .btn-mini');
    removeBlockedBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const blockedSlot = this.closest('.time-slot');
            const blockedInfo = blockedSlot.querySelector('.blocked-info span').textContent;
            
            if (confirm(`Remove blocked time: ${blockedInfo}?`)) {
                blockedSlot.style.opacity = '0';
                
                setTimeout(() => {
                    // Convert to available slot
                    blockedSlot.classList.remove('blocked');
                    blockedSlot.classList.add('empty');
                    blockedSlot.querySelector('.slot-content').className = 'slot-content available-slot';
                    blockedSlot.querySelector('.slot-content').innerHTML = `
                        <button class="add-appointment-btn">
                            <i class="bi bi-plus-circle"></i>
                            <span>Add Appointment</span>
                        </button>
                    `;
                    blockedSlot.style.opacity = '1';
                    
                    StaffUtils.showToast('Blocked time removed', 'success');
                }, 300);
            }
        });
    });

    // ===== MINI CALENDAR =====
    const calendarDays = document.querySelectorAll('.calendar-day:not(.other-month)');
    
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // Remove today class from all
            calendarDays.forEach(d => d.classList.remove('today'));
            
            // Add to clicked (if not today)
            if (!this.classList.contains('today')) {
                this.classList.add('selected');
            }
            
            const dayNum = this.textContent;
            currentDate.setDate(parseInt(dayNum));
            updateDateDisplay();
            
            StaffUtils.showToast(`Jumped to Dec ${dayNum}`, 'info');
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

    // Mini Calendar Navigation
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const calendarMonthSpan = document.querySelector('.calendar-month');
    
    if (prevMonthBtn && nextMonthBtn) {
        let calendarDate = new Date(2024, 11, 1); // December 2024
        
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        prevMonthBtn.addEventListener('click', () => {
            calendarDate.setMonth(calendarDate.getMonth() - 1);
            calendarMonthSpan.textContent = `${months[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`;
            StaffUtils.showToast('Month changed', 'info');
        });
        
        nextMonthBtn.addEventListener('click', () => {
            calendarDate.setMonth(calendarDate.getMonth() + 1);
            calendarMonthSpan.textContent = `${months[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`;
            StaffUtils.showToast('Month changed', 'info');
        });
    }

    // ===== AVAILABILITY SETTINGS =====
    const acceptBookingsSwitch = document.getElementById('acceptBookings');
    const autoConfirmSwitch = document.getElementById('autoConfirm');
    const bufferTimeSwitch = document.getElementById('bufferTime');
    
    [acceptBookingsSwitch, autoConfirmSwitch, bufferTimeSwitch].forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('change', function() {
                const settingName = this.id.replace(/([A-Z])/g, ' $1').trim();
                const status = this.checked ? 'enabled' : 'disabled';
                StaffUtils.showToast(`${settingName}: ${status}`, 'success');
            });
        }
    });

    // ===== QUICK ACTIONS =====
    const quickActionItems = document.querySelectorAll('.quick-action-item');
    
    quickActionItems.forEach(item => {
        item.addEventListener('click', function() {
            const actionName = this.querySelector('span').textContent;
            
            // Animation
            this.style.transform = 'translateX(10px)';
            setTimeout(() => {
                this.style.transform = 'translateX(3px)';
            }, 100);
            
            StaffUtils.showToast(`${actionName} clicked`, 'info');
            
            // Add specific logic based on action
            if (actionName === 'Add Appointment') {
                // Open add appointment modal
            } else if (actionName === 'Block Time Slot') {
                // Open block time modal
            } else if (actionName === 'Set Break Time') {
                // Open break time modal
            } else if (actionName === 'Sync Calendar') {
                // Trigger calendar sync
                setTimeout(() => {
                    StaffUtils.showToast('Calendar synced!', 'success');
                }, 1000);
            }
        });
    });

    // ===== BLOCK TIME BUTTON =====
    const addBlockTimeBtn = document.getElementById('addBlockTimeBtn');
    
    if (addBlockTimeBtn) {
        addBlockTimeBtn.addEventListener('click', function() {
            StaffUtils.showToast('Block time feature coming soon!', 'info');
            // Open block time modal
        });
    }

    // ===== EXPORT SCHEDULE =====
    const exportScheduleBtn = document.getElementById('exportScheduleBtn');
    
    if (exportScheduleBtn) {
        exportScheduleBtn.addEventListener('click', function() {
            StaffUtils.showToast('Exporting schedule...', 'info');
            
            setTimeout(() => {
                StaffUtils.showToast('Schedule exported successfully!', 'success');
            }, 1500);
        });
    }

    // ===== PRINT SCHEDULE =====
    const printScheduleBtn = document.getElementById('printScheduleBtn');
    
    if (printScheduleBtn) {
        printScheduleBtn.addEventListener('click', function() {
            StaffUtils.showToast('Preparing schedule for print...', 'info');
            
            setTimeout(() => {
                window.print();
            }, 500);
        });
    }

    // ===== APPOINTMENT SLOT HOVER EFFECTS =====
    const appointmentSlots = document.querySelectorAll('.appointment-slot-content');
    
    appointmentSlots.forEach(slot => {
        slot.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(3px)';
        });

        slot.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // ===== ANIMATE TIME SLOTS ON LOAD =====
    const timeSlots = document.querySelectorAll('.time-slot');
    
    timeSlots.forEach((slot, index) => {
        slot.style.opacity = '0';
        slot.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            slot.style.transition = 'all 0.3s ease-out';
            slot.style.opacity = '1';
            slot.style.transform = 'translateY(0)';
        }, 50 * index);
    });

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Arrow Left = Previous Day
        if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
            if (prevDateBtn) prevDateBtn.click();
        }
        
        // Arrow Right = Next Day
        if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
            if (nextDateBtn) nextDateBtn.click();
        }
        
        // T = Today
        if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
            if (todayBtn) todayBtn.click();
        }
        
        // N = New Appointment
        if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
            const firstAvailableSlot = document.querySelector('.add-appointment-btn');
            if (firstAvailableSlot) firstAvailableSlot.click();
        }
    });

    console.log('%c📅 Staff Schedule Page Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts:', 'color: #64748b; font-size: 12px;');
    console.log('  ← → = Navigate days');
    console.log('  T = Jump to today');
    console.log('  N = New appointment');
});

// ===== EXPORT UTILITIES =====
window.StaffSchedule = {
    addAppointment: (time, title, client, location, price) => {
        StaffUtils.showToast(`New appointment added at ${time}`, 'success');
    },
    
    blockTime: (startTime, endTime, reason) => {
        StaffUtils.showToast(`Time blocked: ${startTime} - ${endTime}`, 'success');
    },
    
    refreshSchedule: () => {
        location.reload();
    }
};