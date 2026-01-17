/* =========================================
   PROFILE SETTINGS & HISTORY PAGE SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== PROFILE SETTINGS FUNCTIONALITY =====
    
    // Profile Section Navigation
    const profileNavItems = document.querySelectorAll('.profile-nav-item');
    const profileSections = document.querySelectorAll('.profile-section');

    profileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav items
            profileNavItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Hide all sections
            profileSections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const section = document.getElementById(targetSection);
            if (section) {
                section.classList.add('active');
                
                // Smooth scroll to top of content
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Profile Photo Upload
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const removePhotoBtn = document.getElementById('removePhotoBtn');
    const photoInput = document.getElementById('photoInput');
    const profilePhoto = document.getElementById('profilePhoto');

    if (changePhotoBtn && photoInput) {
        changePhotoBtn.addEventListener('click', () => photoInput.click());
        uploadPhotoBtn?.addEventListener('click', () => photoInput.click());

        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhoto.src = e.target.result;
                    DashboardUtils.showToast('Profile photo updated!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove your profile photo?')) {
                profilePhoto.src = 'https://ui-avatars.com/api/?name=John+Anderson&size=200';
                DashboardUtils.showToast('Profile photo removed', 'info');
            }
        });
    }

    // Personal Info Form
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate save
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Saving...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                DashboardUtils.showToast('Profile updated successfully!', 'success');
            }, 1500);
        });
    }

    // Account Settings Form
    const accountSettingsForm = document.getElementById('accountSettingsForm');
    if (accountSettingsForm) {
        accountSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            DashboardUtils.showToast('Account settings saved!', 'success');
        });
    }

    // Delete Account
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            const confirmation = prompt('Type "DELETE" to confirm account deletion:');
            if (confirmation === 'DELETE') {
                DashboardUtils.showToast('Account deletion initiated. You will receive an email shortly.', 'warning');
            } else if (confirmation !== null) {
                DashboardUtils.showToast('Account deletion cancelled', 'info');
            }
        });
    }

    // Save Notifications
    const saveNotificationsBtn = document.getElementById('saveNotificationsBtn');
    if (saveNotificationsBtn) {
        saveNotificationsBtn.addEventListener('click', function() {
            DashboardUtils.showToast('Notification preferences saved!', 'success');
        });
    }

    // Change Password Form
    const changePasswordForm = document.getElementById('changePasswordForm');
    const newPasswordInput = document.getElementById('newPassword');
    
    if (changePasswordForm && newPasswordInput) {
        // Password strength checker
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthBar = document.querySelector('.strength-bar-fill');
            const strengthText = document.querySelector('.strength-text span');
            
            if (password.length === 0) {
                strengthBar.style.width = '0%';
                strengthBar.className = 'strength-bar-fill';
                strengthText.textContent = '-';
                return;
            }
            
            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]+/)) strength++;
            if (password.match(/[A-Z]+/)) strength++;
            if (password.match(/[0-9]+/)) strength++;
            if (password.match(/[$@#&!]+/)) strength++;
            
            strengthBar.classList.remove('weak', 'medium', 'strong');
            
            if (strength <= 2) {
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Weak';
                strengthText.style.color = 'var(--danger)';
            } else if (strength <= 4) {
                strengthBar.classList.add('medium');
                strengthText.textContent = 'Medium';
                strengthText.style.color = 'var(--warning)';
            } else {
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Strong';
                strengthText.style.color = 'var(--success)';
            }
        });

        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            DashboardUtils.showToast('Password updated successfully!', 'success');
            this.reset();
            document.querySelector('.strength-bar-fill').style.width = '0%';
            document.querySelector('.strength-text span').textContent = '-';
        });
    }

    // Preferences Form
    const preferencesForm = document.getElementById('preferencesForm');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            DashboardUtils.showToast('Preferences saved!', 'success');
        });
    }

    // ===== HISTORY PAGE FUNCTIONALITY =====
    
    // Filter History
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const serviceTypeFilter = document.getElementById('serviceTypeFilter');
    const searchHistory = document.getElementById('searchHistory');
    const historyItems = document.querySelectorAll('.history-item');
    const noHistoryResults = document.getElementById('noHistoryResults');

    const filterHistory = () => {
        const dateRange = dateRangeFilter?.value || 'all';
        const status = statusFilter?.value || 'all';
        const serviceType = serviceTypeFilter?.value || 'all';
        const searchTerm = searchHistory?.value.toLowerCase() || '';
        
        let visibleCount = 0;

        historyItems.forEach(item => {
            const itemStatus = item.getAttribute('data-status');
            const itemService = item.getAttribute('data-service');
            const itemTitle = item.querySelector('.history-title').textContent.toLowerCase();
            
            const matchesStatus = status === 'all' || itemStatus === status;
            const matchesService = serviceType === 'all' || itemService === serviceType;
            const matchesSearch = itemTitle.includes(searchTerm);
            
            if (matchesStatus && matchesService && matchesSearch) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (noHistoryResults) {
            if (visibleCount === 0) {
                noHistoryResults.style.display = 'block';
            } else {
                noHistoryResults.style.display = 'none';
            }
        }
    };

    // Attach filter listeners
    [dateRangeFilter, statusFilter, serviceTypeFilter, searchHistory].forEach(element => {
        if (element) {
            element.addEventListener('change', filterHistory);
            if (element.type === 'text') {
                element.addEventListener('input', filterHistory);
            }
        }
    });

    // Clear Filters
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            if (dateRangeFilter) dateRangeFilter.value = 'all';
            if (statusFilter) statusFilter.value = 'all';
            if (serviceTypeFilter) serviceTypeFilter.value = 'all';
            if (searchHistory) searchHistory.value = '';
            filterHistory();
            DashboardUtils.showToast('Filters cleared', 'info');
        });
    }

    // Export History
    const exportHistoryBtn = document.getElementById('exportHistoryBtn');
    if (exportHistoryBtn) {
        exportHistoryBtn.addEventListener('click', function() {
            DashboardUtils.showToast('Exporting appointment history...', 'info');
            
            setTimeout(() => {
                DashboardUtils.showToast('History exported successfully!', 'success');
            }, 1500);
        });
    }

    // View Toggle (List/Grid)
    const viewToggleBtns = document.querySelectorAll('.view-toggle button');
    const historyList = document.getElementById('historyList');
    
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewToggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            
            if (view === 'grid') {
                historyList.style.display = 'grid';
                historyList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
                historyList.style.gap = '1rem';
                historyList.style.padding = '1rem';
                DashboardUtils.showToast('Switched to grid view', 'info');
            } else {
                historyList.style.display = 'flex';
                historyList.style.gridTemplateColumns = '';
                historyList.style.gap = '';
                historyList.style.padding = '';
                DashboardUtils.showToast('Switched to list view', 'info');
            }
        });
    });

    // Book Again Buttons
    const bookAgainBtns = document.querySelectorAll('.history-item .btn-outline-primary');
    
    bookAgainBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const historyItem = this.closest('.history-item');
            const serviceName = historyItem.querySelector('.history-title').textContent;
            
            // Store service info
            sessionStorage.setItem('rebookService', JSON.stringify({
                name: serviceName
            }));
            
            DashboardUtils.showToast(`Rebooking: ${serviceName}`, 'info');
            
            setTimeout(() => {
                window.location.href = 'booking.html';
            }, 500);
        });
    });

    // Rate Service Buttons
    const rateBtns = document.querySelectorAll('.history-actions .btn:has(.bi-star)');
    
    rateBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const historyItem = this.closest('.history-item');
            const serviceName = historyItem.querySelector('.history-title').textContent;
            
            showRatingModal(serviceName);
        });
    });

    // Show Rating Modal (simplified)
    const showRatingModal = (serviceName) => {
        const rating = prompt(`Rate your experience with "${serviceName}" (1-5 stars):`);
        const numRating = parseInt(rating);
        
        if (numRating >= 1 && numRating <= 5) {
            DashboardUtils.showToast(`Thank you! You rated it ${numRating} stars`, 'success');
        } else if (rating !== null) {
            DashboardUtils.showToast('Please enter a number between 1 and 5', 'warning');
        }
    };

    // View Details Buttons
    const viewDetailsBtns = document.querySelectorAll('.history-actions .btn:has(.bi-eye)');
    
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const historyItem = this.closest('.history-item');
            const serviceName = historyItem.querySelector('.history-title').textContent;
            const time = historyItem.querySelector('.history-meta span:first-child').textContent;
            const provider = historyItem.querySelector('.history-meta span:nth-child(2)').textContent;
            
            alert(`Appointment Details:
            
Service: ${serviceName}
${time}
${provider}

Full details view coming soon...`);
        });
    });

    // Load More
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let loadCount = 0;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadCount++;
            
            this.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="bi bi-arrow-down-circle me-2"></i>Load More';
                this.disabled = false;
                DashboardUtils.showToast('Loaded 6 more appointments', 'success');
                
                if (loadCount >= 3) {
                    this.style.display = 'none';
                    const section = this.closest('.load-more-section');
                    section.innerHTML = '<p class="text-muted">No more appointments to load</p>';
                }
            }, 1000);
        });
    }

    // History Item Click (Expand)
    historyItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking buttons
            if (e.target.closest('button')) return;
            
            this.classList.toggle('expanded');
            
            if (this.classList.contains('expanded')) {
                this.style.background = 'rgba(99, 102, 241, 0.05)';
                this.style.borderLeft = '4px solid var(--primary)';
            } else {
                this.style.background = '';
                this.style.borderLeft = '';
            }
        });
    });

    // Animate History Items on Load
    historyItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (index * 50));
    });

    console.log('%c📋 Profile & History Pages Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});

// ===== EXPORT UTILITIES =====
window.ProfileUtils = {
    switchSection: (sectionId) => {
        const navItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (navItem) navItem.click();
    }
};

window.HistoryUtils = {
    filterByStatus: (status) => {
        const filter = document.getElementById('statusFilter');
        if (filter) {
            filter.value = status;
            filter.dispatchEvent(new Event('change'));
        }
    },
    
    filterByDateRange: (range) => {
        const filter = document.getElementById('dateRangeFilter');
        if (filter) {
            filter.value = range;
            filter.dispatchEvent(new Event('change'));
        }
    }
};