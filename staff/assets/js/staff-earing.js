document.addEventListener('DOMContentLoaded', function() {
    
    // Animate Counters
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        updateCounter();
    };

    const counterElements = document.querySelectorAll('[data-target]');
    counterElements.forEach(element => {
        setTimeout(() => animateCounter(element), 300);
    });

    // Export Earnings
    const exportEarningsBtn = document.getElementById('exportEarningsBtn');
    if (exportEarningsBtn) {
        exportEarningsBtn.addEventListener('click', function() {
            StaffUtils.showToast('Exporting earnings report...', 'info');
            setTimeout(() => {
                StaffUtils.showToast('Report exported successfully!', 'success');
            }, 1500);
        });
    }

    // Withdraw Button
    const withdrawBtn = document.getElementById('withdrawBtn');
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('withdrawModal'));
            modal.show();
        });
    }

    // Confirm Withdraw
    const confirmWithdrawBtn = document.getElementById('confirmWithdrawBtn');
    if (confirmWithdrawBtn) {
        confirmWithdrawBtn.addEventListener('click', function() {
            const amount = document.getElementById('withdrawAmount').value;
            if (amount && parseFloat(amount) >= 10) {
                bootstrap.Modal.getInstance(document.getElementById('withdrawModal')).hide();
                StaffUtils.showToast(`Withdrawal of $${amount} initiated successfully!`, 'success');
                document.getElementById('withdrawForm').reset();
            } else {
                StaffUtils.showToast('Please enter a valid amount (minimum $10)', 'warning');
            }
        });
    }

    // Clear Filters
    const clearEarningsFiltersBtn = document.getElementById('clearEarningsFiltersBtn');
    if (clearEarningsFiltersBtn) {
        clearEarningsFiltersBtn.addEventListener('click', function() {
            document.getElementById('timePeriodFilter').value = 'month';
            document.getElementById('serviceTypeFilter').value = 'all';
            document.getElementById('paymentStatusFilter').value = 'all';
            StaffUtils.showToast('Filters cleared', 'info');
        });
    }

    // Animate Bars
    const animateBars = () => {
        const bars = document.querySelectorAll('.goal-bar-fill, .hour-bar-fill, .demo-bar-fill');
        bars.forEach((bar, index) => {
            bar.style.width = '0%';
            const targetWidth = bar.getAttribute('style').match(/width:\s*(\d+%)/)?.[1] || '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100 + (index * 100));
        });
    };

    const observeBars = () => {
        const firstBar = document.querySelector('.goal-bar-fill, .hour-bar-fill');
        if (!firstBar) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(firstBar);
    };

    observeBars();

    console.log('%c💰 Earnings & Reports Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});