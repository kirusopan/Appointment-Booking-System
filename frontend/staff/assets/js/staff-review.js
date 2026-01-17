document.addEventListener('DOMContentLoaded', function() {
    
    const reviewItems = document.querySelectorAll('.review-item');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchReviews = document.getElementById('searchReviews');
    const noReviewsResults = document.getElementById('noReviewsResults');

    // Filter Reviews
    const filterReviews = () => {
        const rating = ratingFilter?.value || 'all';
        const status = statusFilter?.value || 'all';
        const searchTerm = searchReviews?.value.toLowerCase() || '';
        
        let visibleCount = 0;

        reviewItems.forEach(item => {
            const itemRating = item.getAttribute('data-rating');
            const itemStatus = item.getAttribute('data-status');
            const reviewText = item.querySelector('.review-text').textContent.toLowerCase();
            const reviewerName = item.querySelector('.reviewer-name').textContent.toLowerCase();
            
            const matchesRating = rating === 'all' || itemRating === rating;
            const matchesStatus = status === 'all' || itemStatus === status;
            const matchesSearch = reviewText.includes(searchTerm) || reviewerName.includes(searchTerm);
            
            if (matchesRating && matchesStatus && matchesSearch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        if (noReviewsResults) {
            noReviewsResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    };

    [ratingFilter, sortFilter, statusFilter].forEach(element => {
        if (element) element.addEventListener('change', filterReviews);
    });

    if (searchReviews) {
        searchReviews.addEventListener('input', filterReviews);
    }

    // Clear Filters
    const clearReviewFiltersBtn = document.getElementById('clearReviewFiltersBtn');
    if (clearReviewFiltersBtn) {
        clearReviewFiltersBtn.addEventListener('click', function() {
            if (ratingFilter) ratingFilter.value = 'all';
            if (sortFilter) sortFilter.value = 'newest';
            if (statusFilter) statusFilter.value = 'all';
            if (searchReviews) searchReviews.value = '';
            filterReviews();
            StaffUtils.showToast('Filters cleared', 'info');
        });
    }

    // Reply Buttons
    const replyBtns = document.querySelectorAll('.reply-btn');
    replyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reviewItem = this.closest('.review-item');
            const responseForm = reviewItem.querySelector('.response-form');
            
            if (responseForm) {
                responseForm.style.display = 'block';
                responseForm.querySelector('.response-textarea').focus();
            }
        });
    });

    // Cancel Response
    const cancelResponseBtns = document.querySelectorAll('.cancel-response-btn');
    cancelResponseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const responseForm = this.closest('.response-form');
            responseForm.style.display = 'none';
            responseForm.querySelector('.response-textarea').value = '';
        });
    });

    // Submit Response
    const submitResponseBtns = document.querySelectorAll('.submit-response-btn');
    submitResponseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const responseForm = this.closest('.response-form');
            const textarea = responseForm.querySelector('.response-textarea');
            const responseText = textarea.value.trim();
            
            if (responseText) {
                const reviewItem = responseForm.closest('.review-item');
                const responseSection = document.createElement('div');
                responseSection.className = 'review-response';
                responseSection.innerHTML = `
                    <div class="response-header">
                        <i class="bi bi-reply-fill"></i>
                        <strong>Your Response</strong>
                        <span class="text-muted small">Just now</span>
                    </div>
                    <p class="response-text">${responseText}</p>
                `;
                
                reviewItem.setAttribute('data-status', 'responded');
                responseForm.parentNode.replaceChild(responseSection, responseForm);
                
                StaffUtils.showToast('Response submitted successfully!', 'success');
            } else {
                StaffUtils.showToast('Please write a response', 'warning');
            }
        });
    });

    // Export Reviews
    const exportReviewsBtn = document.getElementById('exportReviewsBtn');
    if (exportReviewsBtn) {
        exportReviewsBtn.addEventListener('click', function() {
            StaffUtils.showToast('Exporting reviews...', 'info');
            setTimeout(() => {
                StaffUtils.showToast('Reviews exported successfully!', 'success');
            }, 1500);
        });
    }

    // Load More
    const loadMoreReviewsBtn = document.getElementById('loadMoreReviewsBtn');
    if (loadMoreReviewsBtn) {
        loadMoreReviewsBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="bi bi-arrow-down-circle me-2"></i>Load More Reviews';
                this.disabled = false;
                StaffUtils.showToast('Loaded 10 more reviews', 'success');
            }, 1000);
        });
    }

    // Animate Rating Bars
    const animateRatingBars = () => {
        const ratingBars = document.querySelectorAll('.rating-bar-fill');
        ratingBars.forEach((bar, index) => {
            bar.style.width = '0%';
            const targetWidth = bar.getAttribute('style').match(/width:\s*(\d+%)/)?.[1] || '0%';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100 + (index * 100));
        });
    };

    const observeRatingCard = () => {
        const ratingCard = document.querySelector('.rating-overview');
        if (!ratingCard) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateRatingBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(ratingCard);
    };

    observeRatingCard();

    // Animate Review Items
    reviewItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });

    console.log('%c⭐ Staff Reviews Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});