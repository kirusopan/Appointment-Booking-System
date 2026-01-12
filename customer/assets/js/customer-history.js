/* =========================================
   HISTORY PAGE SCRIPTS WITH MODALS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SAMPLE DATA FOR MODALS =====
    const appointmentsData = {
        1: {
            service: 'Professional Skills Training',
            provider: 'Emily Davis',
            date: 'December 20, 2024',
            time: '2:00 PM',
            location: 'Training Center, 456 Business Ave',
            price: '$80.00',
            duration: '2 hours',
            payment: 'Visa •••• 4242',
            notes: 'Hands-on training session covering advanced professional development techniques and best practices.',
            status: 'Completed',
            rating: 5,
            review: 'Excellent training session! Very informative and practical.',
            recommended: true
        },
        2: {
            service: 'Business Strategy Meeting',
            provider: 'Sarah Johnson',
            date: 'December 15, 2024',
            time: '10:00 AM',
            location: 'Online Meeting via Zoom',
            price: '$120.00',
            duration: '90 minutes',
            payment: 'Mastercard •••• 8888',
            notes: 'Strategic planning session to discuss Q1 2025 goals and marketing initiatives.',
            status: 'Completed',
            rating: 0,
            review: '',
            recommended: false
        },
        3: {
            service: 'Personal Consultation',
            provider: 'John Smith',
            date: 'December 10, 2024',
            time: '3:30 PM',
            location: 'Office Location, 123 Main St Suite 200',
            price: '$50.00',
            duration: '60 minutes',
            payment: 'Visa •••• 4242',
            notes: 'Career development and goal setting consultation session.',
            status: 'Completed',
            rating: 4.5,
            review: 'Great consultation! John provided valuable insights and actionable advice.',
            recommended: true
        },
        4: {
            service: 'Technical Support Session',
            provider: 'Michael Brown',
            date: 'December 08, 2024',
            time: '11:00 AM',
            location: 'Video Call',
            price: '$40.00',
            duration: '45 minutes',
            payment: 'Visa •••• 4242',
            notes: 'Software troubleshooting and system optimization session.',
            status: 'Cancelled',
            cancelDate: 'December 7, 2024',
            cancelBy: 'Customer',
            cancelReason: 'Customer requested cancellation',
            refundStatus: 'Refunded',
            refundAmount: '$40.00'
        },
        5: {
            service: 'Wellness Coaching',
            provider: 'Dr. Amanda Chen',
            date: 'December 05, 2024',
            time: '1:00 PM',
            location: 'Wellness Center, 789 Health Blvd',
            price: '$60.00',
            duration: '60 minutes',
            payment: 'Mastercard •••• 8888',
            notes: 'Holistic wellness guidance focusing on mental and physical health.',
            status: 'Completed',
            rating: 5,
            review: 'Amazing experience! Dr. Chen was very knowledgeable and supportive.',
            recommended: true
        }
    };

    // ===== MODAL INSTANCES =====
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    const ratingModal = new bootstrap.Modal(document.getElementById('ratingModal'));
    const cancellationModal = new bootstrap.Modal(document.getElementById('cancellationModal'));

    let currentServiceId = null;
    let selectedRating = 0;

    // ===== VIEW DETAILS BUTTONS =====
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            currentServiceId = serviceId;
            showDetailsModal(serviceId);
        });
    });

    // ===== SHOW DETAILS MODAL =====
    const showDetailsModal = (serviceId) => {
        const data = appointmentsData[serviceId];
        if (!data) return;

        // Populate modal
        document.getElementById('detail-datetime').textContent = `${data.date} at ${data.time}`;
        document.getElementById('detail-service').textContent = data.service;
        document.getElementById('detail-provider').textContent = data.provider;
        document.getElementById('detail-location').textContent = data.location;
        document.getElementById('detail-price').textContent = data.price;
        document.getElementById('detail-duration').textContent = data.duration;
        document.getElementById('detail-payment').textContent = data.payment;
        document.getElementById('detail-notes').textContent = data.notes;

        // Status badge
        const statusBadge = document.getElementById('detail-status');
        statusBadge.textContent = data.status;
        statusBadge.className = data.status === 'Completed' ? 'badge bg-success' : 'badge bg-danger';

        // Rating section
        const ratingSection = document.getElementById('detail-rating-section');
        if (data.status === 'Completed' && data.rating > 0) {
            ratingSection.style.display = 'block';
            const ratingDisplay = ratingSection.querySelector('.rating-display');
            ratingDisplay.innerHTML = '';
            
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                if (i <= Math.floor(data.rating)) {
                    star.className = 'bi bi-star-fill';
                } else if (i - 0.5 === data.rating) {
                    star.className = 'bi bi-star-half';
                } else {
                    star.className = 'bi bi-star';
                }
                ratingDisplay.appendChild(star);
            }
            
            const ratingText = document.createElement('span');
            ratingText.className = 'rating-text';
            ratingText.textContent = `(${data.rating}.0)`;
            ratingDisplay.appendChild(ratingText);

            document.getElementById('detail-review').textContent = data.review;
        } else {
            ratingSection.style.display = 'none';
        }

        // Show modal
        detailsModal.show();

        // Log for analytics
        console.log('Viewing details for service:', serviceId);
    };

    // ===== RATE SERVICE BUTTONS =====
    document.querySelectorAll('.rate-service-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            currentServiceId = serviceId;
            showRatingModal(serviceId);
        });
    });

    // ===== EDIT RATING BUTTONS =====
    document.querySelectorAll('.edit-rating-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            currentServiceId = serviceId;
            showRatingModal(serviceId, true);
        });
    });

    // ===== SHOW RATING MODAL =====
    const showRatingModal = (serviceId, isEdit = false) => {
        const data = appointmentsData[serviceId];
        if (!data) return;

        // Reset form
        selectedRating = 0;
        document.querySelectorAll('.star-input').forEach(star => {
            star.classList.remove('active', 'bi-star-fill');
            star.classList.add('bi-star');
        });
        document.getElementById('review-text').value = '';
        document.getElementById('recommend-check').checked = false;
        document.getElementById('submit-rating-btn').disabled = true;

        // Populate service info
        document.getElementById('rating-service-name').textContent = data.service;
        document.getElementById('rating-provider').textContent = `with ${data.provider}`;

        // If editing, pre-fill data
        if (isEdit && data.rating > 0) {
            selectedRating = data.rating;
            updateStarDisplay(data.rating);
            document.getElementById('review-text').value = data.review;
            document.getElementById('recommend-check').checked = data.recommended;
            document.getElementById('submit-rating-btn').disabled = false;
        }

        // Show modal
        ratingModal.show();
    };

    // ===== STAR RATING INPUT =====
    const starInputs = document.querySelectorAll('.star-input');
    
    starInputs.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            updateStarDisplay(selectedRating);
            document.getElementById('submit-rating-btn').disabled = false;
        });

        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
    });

    document.querySelector('.star-rating-input').addEventListener('mouseleave', function() {
        if (selectedRating > 0) {
            updateStarDisplay(selectedRating);
        } else {
            clearStars();
        }
    });

    const highlightStars = (rating) => {
        starInputs.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.remove('bi-star');
                star.classList.add('bi-star-fill');
            } else {
                star.classList.remove('bi-star-fill');
                star.classList.add('bi-star');
            }
        });
    };

    const updateStarDisplay = (rating) => {
        starInputs.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.remove('bi-star');
                star.classList.add('bi-star-fill', 'active');
            } else {
                star.classList.remove('bi-star-fill', 'active');
                star.classList.add('bi-star');
            }
        });
    };

    const clearStars = () => {
        starInputs.forEach(star => {
            star.classList.remove('bi-star-fill', 'active');
            star.classList.add('bi-star');
        });
    };

    // ===== SUBMIT RATING =====
    document.getElementById('submit-rating-btn').addEventListener('click', function() {
        const reviewText = document.getElementById('review-text').value;
        const recommend = document.getElementById('recommend-check').checked;

        if (selectedRating === 0) {
            DashboardUtils.showToast('Please select a rating', 'warning');
            return;
        }

        // Update appointment data
        if (currentServiceId && appointmentsData[currentServiceId]) {
            appointmentsData[currentServiceId].rating = selectedRating;
            appointmentsData[currentServiceId].review = reviewText;
            appointmentsData[currentServiceId].recommended = recommend;
        }

        // Update UI
        const timelineItem = document.querySelector(`[data-service-id="${currentServiceId}"]`).closest('.timeline-item');
        const ratingDisplay = timelineItem.querySelector('.rating-display');
        
        ratingDisplay.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = i <= selectedRating ? 'bi bi-star-fill' : 'bi bi-star';
            ratingDisplay.appendChild(star);
        }
        const ratingText = document.createElement('span');
        ratingText.className = 'rating-text';
        ratingText.textContent = `(${selectedRating}.0)`;
        ratingDisplay.appendChild(ratingText);

        // Change button
        const rateBtn = timelineItem.querySelector('.rate-service-btn');
        if (rateBtn) {
            rateBtn.remove();
            const actions = timelineItem.querySelector('.timeline-actions');
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-info edit-rating-btn';
            editBtn.setAttribute('data-service-id', currentServiceId);
            editBtn.innerHTML = '<i class="bi bi-pencil me-1"></i>Edit Rating';
            editBtn.addEventListener('click', function() {
                showRatingModal(currentServiceId, true);
            });
            actions.insertBefore(editBtn, actions.lastElementChild);
        }

        // Close modal
        ratingModal.hide();
        DashboardUtils.showToast(`Thank you for rating ${selectedRating} stars!`, 'success');

        // Log for analytics
        console.log('Rating submitted:', {
            serviceId: currentServiceId,
            rating: selectedRating,
            review: reviewText,
            recommend: recommend
        });
    });

    // ===== SHOW CANCELLATION MODAL =====
    const showCancellationModal = (serviceId) => {
        const data = appointmentsData[serviceId];
        if (!data || data.status !== 'Cancelled') return;

        document.getElementById('cancel-date').textContent = data.cancelDate;
        document.getElementById('cancel-by').textContent = data.cancelBy;
        document.getElementById('cancel-refund').textContent = data.refundAmount;
        document.getElementById('cancel-reason').textContent = data.cancelReason;

        cancellationModal.show();
    };

    // ===== REBOOK BUTTONS =====
    document.querySelectorAll('.rebook-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceName = this.closest('.timeline-card').querySelector('.service-name').textContent;
            DashboardUtils.showToast(`Rebooking ${serviceName}...`, 'success');
            
            setTimeout(() => {
                window.location.href = 'booking.html';
            }, 1000);
        });
    });

    // ===== MODAL REBOOK BUTTON =====
    document.getElementById('modal-rebook-btn').addEventListener('click', function() {
        if (currentServiceId && appointmentsData[currentServiceId]) {
            const serviceName = appointmentsData[currentServiceId].service;
            DashboardUtils.showToast(`Rebooking ${serviceName}...`, 'success');
            
            detailsModal.hide();
            setTimeout(() => {
                window.location.href = 'booking.html';
            }, 1000);
        }
    });

    // ===== FILTERING =====
    const historySearch = document.getElementById('historySearch');
    const yearFilter = document.getElementById('yearFilter');
    const monthFilter = document.getElementById('monthFilter');
    const statusHistoryFilter = document.getElementById('statusHistoryFilter');
    const timelineItems = document.querySelectorAll('.timeline-item');

    const filterHistory = () => {
        const searchTerm = historySearch.value.toLowerCase();
        const selectedYear = yearFilter.value;
        const selectedMonth = monthFilter.value;
        const selectedStatus = statusHistoryFilter.value;

        let visibleCount = 0;

        timelineItems.forEach(item => {
            const serviceName = item.querySelector('.service-name').textContent.toLowerCase();
            const date = item.getAttribute('data-date');
            const status = item.getAttribute('data-status');

            const matchesSearch = serviceName.includes(searchTerm);
            const matchesYear = selectedYear === 'all' || date.includes(selectedYear);
            const matchesMonth = selectedMonth === 'all' || date.includes(`-${selectedMonth.padStart(2, '0')}-`);
            const matchesStatus = selectedStatus === 'all' || status === selectedStatus;

            if (matchesSearch && matchesYear && matchesMonth && matchesStatus) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        checkEmptyState(visibleCount);
    };

    if (historySearch) historySearch.addEventListener('input', filterHistory);
    if (yearFilter) yearFilter.addEventListener('change', filterHistory);
    if (monthFilter) monthFilter.addEventListener('change', filterHistory);
    if (statusHistoryFilter) statusHistoryFilter.addEventListener('change', filterHistory);

    // ===== CLEAR FILTERS =====
    document.getElementById('clearHistoryFilters').addEventListener('click', () => {
        historySearch.value = '';
        yearFilter.value = '2024';
        monthFilter.value = '12';
        statusHistoryFilter.value = 'all';
        filterHistory();
        DashboardUtils.showToast('Filters cleared', 'info');
    });

    // ===== EMPTY STATE =====
    const checkEmptyState = (visibleCount) => {
        const emptyState = document.querySelector('.empty-state-history');
        const timeline = document.querySelector('.history-timeline');

        if (visibleCount === 0) {
            timeline.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            timeline.style.display = 'block';
            emptyState.style.display = 'none';
        }
    };

    // ===== EXPORT HISTORY =====
    document.getElementById('exportHistoryBtn').addEventListener('click', () => {
        DashboardUtils.showToast('Exporting history...', 'info');
        
        const visibleItems = Array.from(timelineItems).filter(item => item.style.display !== 'none');
        const exportData = visibleItems.map(item => {
            const serviceId = item.querySelector('.view-details-btn').getAttribute('data-service-id');
            return appointmentsData[serviceId];
        });

        console.log('Export data:', exportData);
        
        setTimeout(() => {
            DashboardUtils.showToast('History exported successfully!', 'success');
        }, 1500);
    });

    // ===== PRINT HISTORY =====
    document.getElementById('printHistoryBtn').addEventListener('click', () => {
        window.print();
    });

    // ===== TIMELINE ITEM ANIMATIONS =====
    const animateTimeline = () => {
        timelineItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    };

    animateTimeline();

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + F = Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            historySearch.focus();
        }
        
        // Esc = Close modals or clear search
        if (e.key === 'Escape') {
            if (!document.querySelector('.modal.show')) {
                historySearch.value = '';
                historySearch.blur();
                filterHistory();
            }
        }
    });

    // ===== LOG INFO =====
    console.log('%c📜 History Page Loaded', 'color: #6366f1; font-size: 18px; font-weight: bold;');
    console.log('%c3 Modals Available: Details, Rating, Cancellation', 'color: #64748b; font-size: 14px;');
    console.log('%cKeyboard Shortcuts: Ctrl/Cmd+F (search), Esc (clear)', 'color: #64748b; font-size: 14px;');
});

// ===== EXPORT UTILITIES =====
window.HistoryPageUtils = {
    viewDetails: (serviceId) => {
        const btn = document.querySelector(`[data-service-id="${serviceId}"].view-details-btn`);
        if (btn) btn.click();
    },
    
    rateService: (serviceId) => {
        const btn = document.querySelector(`[data-service-id="${serviceId}"].rate-service-btn`);
        if (btn) btn.click();
    }
};