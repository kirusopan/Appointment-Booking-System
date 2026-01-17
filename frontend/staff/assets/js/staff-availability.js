document.addEventListener('DOMContentLoaded', function() {
    
    // Status Toggle
    const statusBtns = document.querySelectorAll('.status-btn-inline');
    statusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            statusBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const status = this.getAttribute('data-status');
            const statValue = document.querySelector('.stat-value');
            statValue.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            StaffUtils.showToast(`Status changed to ${status}`, 'success');
        });
    });

    // Day Toggles
    const dayToggles = document.querySelectorAll('[id$="Toggle"]');
    dayToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const day = this.id.replace('Toggle', '');
            const slots = document.getElementById(day + 'Slots');
            const status = this.closest('.day-schedule-item').querySelector('.day-status');
            
            if (this.checked) {
                slots.style.display = 'flex';
                status.textContent = 'Available';
                status.classList.remove('unavailable');
                status.classList.add('available');
            } else {
                slots.style.display = 'none';
                status.textContent = 'Unavailable';
                status.classList.remove('available');
                status.classList.add('unavailable');
            }
        });
    });

    // Add Time Slot
    const addTimeSlotBtns = document.querySelectorAll('.add-time-slot');
    addTimeSlotBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            const slotsContainer = document.getElementById(day + 'Slots');
            
            const newSlot = document.createElement('div');
            newSlot.className = 'time-slot';
            newSlot.innerHTML = `
                <div class="time-inputs">
                    <input type="time" class="form-control" value="09:00">
                    <span class="time-separator">to</span>
                    <input type="time" class="form-control" value="17:00">
                </div>
                <button class="btn btn-sm btn-outline-danger remove-slot">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            
            slotsContainer.appendChild(newSlot);
            attachRemoveSlotListener(newSlot.querySelector('.remove-slot'));
            StaffUtils.showToast('Time slot added', 'success');
        });
    });

    // Remove Time Slot
    function attachRemoveSlotListener(btn) {
        btn.addEventListener('click', function() {
            if (confirm('Remove this time slot?')) {
                this.closest('.time-slot').remove();
                StaffUtils.showToast('Time slot removed', 'info');
            }
        });
    }

    document.querySelectorAll('.remove-slot').forEach(attachRemoveSlotListener);

    // Apply to All
    document.getElementById('applyToAllBtn').addEventListener('click', function() {
        if (confirm('Apply Monday schedule to all weekdays?')) {
            const mondaySlots = document.getElementById('mondaySlots').innerHTML;
            ['tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
                document.getElementById(day + 'Slots').innerHTML = mondaySlots;
                document.getElementById(day + 'Toggle').checked = true;
                const status = document.querySelector(`#${day}Toggle`).closest('.day-schedule-item').querySelector('.day-status');
                status.textContent = 'Available';
                status.classList.remove('unavailable');
                status.classList.add('available');
            });
            
            document.querySelectorAll('.remove-slot').forEach(attachRemoveSlotListener);
            StaffUtils.showToast('Schedule applied to all weekdays', 'success');
        }
    });

    // Save Availability
    document.getElementById('saveAvailabilityBtn').addEventListener('click', function() {
        const btn = this;
        btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Saving...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Save Changes';
            btn.disabled = false;
            StaffUtils.showToast('Availability settings saved!', 'success');
        }, 1500);
    });

    // Reset Availability
    document.getElementById('resetAvailabilityBtn').addEventListener('click', function() {
        if (confirm('Reset all availability settings to default?')) {
            location.reload();
        }
    });

    // Add Day Off
    document.getElementById('addDayOffBtn').addEventListener('click', function() {
        const modal = new bootstrap.Modal(document.getElementById('addDayOffModal'));
        modal.show();
    });

    document.getElementById('dayOffType').addEventListener('change', function() {
        const endDateField = document.getElementById('endDateField');
        endDateField.style.display = this.value === 'range' ? 'block' : 'none';
    });

    document.getElementById('saveDayOffBtn').addEventListener('click', function() {
        const title = document.getElementById('dayOffTitle').value;
        const date = document.getElementById('dayOffDate').value;
        
        if (title && date) {
            const dayOffList = document.getElementById('daysOffList');
            const newDayOff = document.createElement('div');
            newDayOff.className = 'day-off-item';
            newDayOff.innerHTML = `
                <div class="day-off-info">
                    <h6>${title}</h6>
                    <p class="small text-muted mb-0">${new Date(date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                </div>
                <button class="btn btn-sm btn-outline-danger remove-day-off">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            
            dayOffList.appendChild(newDayOff);
            attachRemoveDayOffListener(newDayOff.querySelector('.remove-day-off'));
            
            bootstrap.Modal.getInstance(document.getElementById('addDayOffModal')).hide();
            document.getElementById('dayOffForm').reset();
            StaffUtils.showToast('Day off added', 'success');
        }
    });

    // Remove Day Off
    function attachRemoveDayOffListener(btn) {
        btn.addEventListener('click', function() {
            if (confirm('Remove this day off?')) {
                this.closest('.day-off-item').remove();
                StaffUtils.showToast('Day off removed', 'info');
            }
        });
    }

    document.querySelectorAll('.remove-day-off').forEach(attachRemoveDayOffListener);

    // Add Break
    document.getElementById('addBreakBtn').addEventListener('click', function() {
        const modal = new bootstrap.Modal(document.getElementById('addBreakModal'));
        modal.show();
    });

    document.getElementById('saveBreakBtn').addEventListener('click', function() {
        const name = document.getElementById('breakName').value;
        const startTime = document.getElementById('breakStartTime').value;
        const endTime = document.getElementById('breakEndTime').value;
        
        if (name && startTime && endTime) {
            const breakList = document.getElementById('breakTimesList');
            const newBreak = document.createElement('div');
            newBreak.className = 'break-time-item';
            newBreak.innerHTML = `
                <div class="break-time-info">
                    <h6>${name}</h6>
                    <p class="small text-muted mb-0">${StaffUtils.formatTime(startTime)} - ${StaffUtils.formatTime(endTime)}</p>
                </div>
                <button class="btn btn-sm btn-outline-danger remove-break">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            
            breakList.appendChild(newBreak);
            attachRemoveBreakListener(newBreak.querySelector('.remove-break'));
            
            bootstrap.Modal.getInstance(document.getElementById('addBreakModal')).hide();
            document.getElementById('breakTimeForm').reset();
            StaffUtils.showToast('Break time added', 'success');
        }
    });

    // Remove Break
    function attachRemoveBreakListener(btn) {
        btn.addEventListener('click', function() {
            if (confirm('Remove this break time?')) {
                this.closest('.break-time-item').remove();
                StaffUtils.showToast('Break time removed', 'info');
            }
        });
    }

    document.querySelectorAll('.remove-break').forEach(attachRemoveBreakListener);

    console.log('%c⏰ Staff Availability Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});