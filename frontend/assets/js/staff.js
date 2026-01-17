/* =========================================
   STAFF PAGE SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SEARCH AND FILTER FUNCTIONALITY =====
    const searchInput = document.getElementById('staffSearch');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const staffItems = document.querySelectorAll('.staff-item');
    const noResults = document.getElementById('noStaffResults');
    const viewToggle = document.getElementById('viewToggle');
    const staffGrid = document.getElementById('staffGrid');

    // Filter staff function
    const filterStaff = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedSpecialty = specialtyFilter.value;
        const selectedAvailability = availabilityFilter.value;
        
        let visibleCount = 0;

        staffItems.forEach(item => {
            const name = item.querySelector('h4').textContent.toLowerCase();
            const role = item.querySelector('.staff-role').textContent.toLowerCase();
            const skills = Array.from(item.querySelectorAll('.skill-tag'))
                .map(tag => tag.textContent.toLowerCase())
                .join(' ');
            
            const specialty = item.getAttribute('data-specialty');
            const status = item.getAttribute('data-status');

            // Search filter
            const matchesSearch = name.includes(searchTerm) || 
                                role.includes(searchTerm) || 
                                skills.includes(searchTerm);

            // Specialty filter
            const matchesSpecialty = selectedSpecialty === 'all' || specialty === selectedSpecialty;

            // Availability filter
            const matchesAvailability = selectedAvailability === 'all' || status === selectedAvailability;

            // Show or hide item
            if (matchesSearch && matchesSpecialty && matchesAvailability) {
                item.classList.remove('hide');
                item.style.display = 'block';
                visibleCount++;
                
                // Re-trigger animation
                item.style.animation = 'none';
                setTimeout(() => {
                    item.style.animation = 'fadeIn 0.5s ease-out';
                }, 10);
            } else {
                item.classList.add('hide');
                item.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }

        // Update results count
        updateResultsCount(visibleCount);
    };

    // Update results count
    const updateResultsCount = (count) => {
        const filterBar = document.querySelector('.filter-bar');
        let countBadge = filterBar.querySelector('.results-count');
        
        if (!countBadge) {
            countBadge = document.createElement('div');
            countBadge.className = 'results-count';
            countBadge.style.cssText = `
                position: absolute;
                top: -15px;
                right: 15px;
                background: var(--primary);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 2rem;
                font-size: 0.875rem;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
            `;
            filterBar.style.position = 'relative';
            filterBar.appendChild(countBadge);
        }
        
        countBadge.textContent = `${count} Staff Member${count !== 1 ? 's' : ''}`;
    };

    // Event listeners for filters
    if (searchInput) {
        searchInput.addEventListener('input', filterStaff);
    }

    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', filterStaff);
    }

    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', filterStaff);
    }

    // Initialize with count
    updateResultsCount(staffItems.length);

    // ===== VIEW TOGGLE (GRID/LIST) =====
    let isListView = false;
    
    if (viewToggle) {
        viewToggle.addEventListener('click', function() {
            isListView = !isListView;
            
            if (isListView) {
                staffGrid.classList.add('list-view');
                this.innerHTML = '<i class="bi bi-grid me-2"></i>Grid View';
            } else {
                staffGrid.classList.remove('list-view');
                this.innerHTML = '<i class="bi bi-grid-3x3-gap me-2"></i>Grid View';
            }
        });
    }

    // ===== CLEAR FILTERS BUTTON =====
    const createClearButton = () => {
        const filterBar = document.querySelector('.filter-bar .row');
        if (!filterBar) return;

        const clearButton = document.createElement('button');
        clearButton.className = 'btn btn-outline-secondary btn-sm mt-3';
        clearButton.innerHTML = '<i class="bi bi-x-circle me-2"></i>Clear Filters';
        clearButton.style.display = 'none';
        
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            specialtyFilter.value = 'all';
            availabilityFilter.value = 'all';
            filterStaff();
            clearButton.style.display = 'none';
        });

        filterBar.appendChild(clearButton);

        // Show clear button when filters are active
        const checkFiltersActive = () => {
            if (searchInput.value || specialtyFilter.value !== 'all' || availabilityFilter.value !== 'all') {
                clearButton.style.display = 'inline-block';
            } else {
                clearButton.style.display = 'none';
            }
        };

        searchInput.addEventListener('input', checkFiltersActive);
        specialtyFilter.addEventListener('change', checkFiltersActive);
        availabilityFilter.addEventListener('change', checkFiltersActive);
    };

    createClearButton();

    // ===== UPDATE AVAILABILITY STATUS =====
    const updateAvailabilityStatus = () => {
        const statusBadges = document.querySelectorAll('.staff-status-badge');
        
        statusBadges.forEach(badge => {
            if (badge.classList.contains('available')) {
                // Add shimmer effect to available badges
                badge.style.animation = 'shimmer 2s infinite';
            }
        });

        // Add shimmer animation
        if (!document.getElementById('shimmer-animation')) {
            const style = document.createElement('style');
            style.id = 'shimmer-animation';
            style.textContent = `
                @keyframes shimmer {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
        }
    };

    updateAvailabilityStatus();

    // ===== LAZY LOADING IMAGES =====
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('.staff-image-wrapper img');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    };

    lazyLoadImages();

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Press '/' to focus search
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Press 'Escape' to clear search
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.blur();
            filterStaff();
        }

        // Press 'V' to toggle view
        if (e.key === 'v' || e.key === 'V') {
            if (!e.target.matches('input, textarea')) {
                viewToggle.click();
            }
        }
    });

    // ===== ANALYTICS TRACKING =====
    const trackStaffViews = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('viewed')) {
                    entry.target.classList.add('viewed');
                    const staffName = entry.target.querySelector('h4').textContent;
                    console.log('Staff member viewed:', staffName);
                    // Send to analytics here
                }
            });
        }, { threshold: 0.5 });

        staffItems.forEach(item => observer.observe(item));
    };

    trackStaffViews();

    console.log('%c👥 Staff Page Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts: "/" to search, "Esc" to clear, "V" to toggle view', 'color: #64748b; font-size: 12px;');
});

// ===== BOOK STAFF FUNCTION =====
window.bookStaff = function(staffName) {
    // Store selected staff in sessionStorage
    sessionStorage.setItem('selectedStaff', staffName);
    
    // Show notification
    if (window.Utils) {
        window.Utils.showToast(`Selected: ${staffName}`, 'success');
    }
    
    // Redirect to booking page
    setTimeout(() => {
        window.location.href = 'booking.html';
    }, 500);
};

// ===== VIEW PROFILE FUNCTION =====
window.viewProfile = function(staffName) {
    const modal = document.getElementById('staffModal');
    const modalContent = document.getElementById('modalContent');
    
    // Staff data (in real app, this would come from API)
    const staffData = {
        'John Smith': {
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80',
            role: 'Senior Consultant',
            bio: 'With over 8 years of experience in business consulting, John has helped numerous organizations achieve their strategic goals. His expertise spans across business development, strategic planning, and organizational transformation.',
            specialties: ['Strategic Planning', 'Business Development', 'Leadership Coaching', 'Organizational Design'],
            certifications: [
                { name: 'MBA', icon: 'bi-mortarboard' },
                { name: 'PMP Certified', icon: 'bi-award' },
                { name: 'Six Sigma', icon: 'bi-graph-up' }
            ],
            experience: '8+ Years',
            sessions: '350+',
            rating: '5.0'
        },
        'Sarah Johnson': {
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
            role: 'Business Advisor',
            bio: 'Sarah specializes in helping businesses optimize their operations and achieve sustainable growth. Her practical approach combines financial acumen with strategic thinking.',
            specialties: ['Business Strategy', 'Financial Planning', 'Operations Management', 'Growth Strategy'],
            certifications: [
                { name: 'CPA', icon: 'bi-calculator' },
                { name: 'MBA Finance', icon: 'bi-mortarboard' }
            ],
            experience: '6+ Years',
            sessions: '280+',
            rating: '4.8'
        }
        // Add more staff data as needed
    };

    const staff = staffData[staffName] || staffData['John Smith'];

    // Build modal content
    const content = `
        <div class="profile-header">
            <img src="${staff.image}" alt="${staffName}" class="profile-image">
            <div class="profile-info">
                <h3>${staffName}</h3>
                <p class="text-muted mb-2">${staff.role}</p>
                <div class="staff-rating mb-2">
                    <i class="bi bi-star-fill text-warning"></i>
                    <i class="bi bi-star-fill text-warning"></i>
                    <i class="bi bi-star-fill text-warning"></i>
                    <i class="bi bi-star-fill text-warning"></i>
                    <i class="bi bi-star-fill text-warning"></i>
                    <span class="ms-2 fw-bold">${staff.rating}</span>
                </div>
                <div class="d-flex gap-3">
                    <span class="badge bg-primary">${staff.experience} Experience</span>
                    <span class="badge bg-success">${staff.sessions} Sessions</span>
                </div>
            </div>
        </div>

        <div class="profile-section">
            <h5><i class="bi bi-person-lines-fill me-2"></i>About</h5>
            <p>${staff.bio}</p>
        </div>

        <div class="profile-section">
            <h5><i class="bi bi-star-fill me-2"></i>Specialties</h5>
            <div class="d-flex flex-wrap gap-2">
                ${staff.specialties.map(s => `<span class="badge bg-light text-primary">${s}</span>`).join('')}
            </div>
        </div>

        <div class="profile-section">
            <h5><i class="bi bi-award-fill me-2"></i>Certifications</h5>
            <div class="certifications-list">
                ${staff.certifications.map(cert => `
                    <div class="certification-item">
                        <i class="${cert.icon}"></i>
                        <h6 class="mb-0">${cert.name}</h6>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="d-flex gap-2 mt-4">
            <button class="btn btn-primary flex-fill" onclick="bookStaff('${staffName}')">
                <i class="bi bi-calendar-plus me-2"></i>Book Appointment
            </button>
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
        </div>
    `;

    modalContent.innerHTML = content;
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
};

// ===== SORT FUNCTIONALITY =====
const createSortOptions = () => {
    const filterBar = document.querySelector('.filter-bar .row');
    if (!filterBar) return;

    const sortCol = document.createElement('div');
    sortCol.className = 'col-lg-3 col-md-6 mt-3 mt-lg-0';
    sortCol.innerHTML = `
        <select class="form-select" id="sortFilter">
            <option value="default">Sort By</option>
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="sessions">Most Sessions</option>
            <option value="name">Name: A to Z</option>
        </select>
    `;
    
    // Insert before view toggle button
    const viewToggleCol = filterBar.querySelector('.col-lg-2');
    filterBar.insertBefore(sortCol, viewToggleCol);

    const sortFilter = document.getElementById('sortFilter');
    sortFilter.addEventListener('change', function() {
        sortStaff(this.value);
    });
};

const sortStaff = (sortType) => {
    const grid = document.getElementById('staffGrid');
    const items = Array.from(document.querySelectorAll('.staff-item'));

    items.sort((a, b) => {
        if (sortType === 'rating') {
            const ratingA = parseFloat(a.querySelector('.rating-value').textContent);
            const ratingB = parseFloat(b.querySelector('.rating-value').textContent);
            return ratingB - ratingA;
        } else if (sortType === 'experience') {
            const expA = parseInt(a.querySelector('.staff-stats .stat:nth-child(2) span').textContent);
            const expB = parseInt(b.querySelector('.staff-stats .stat:nth-child(2) span').textContent);
            return expB - expA;
        } else if (sortType === 'sessions') {
            const sessA = parseInt(a.querySelector('.staff-stats .stat:nth-child(1) span').textContent);
            const sessB = parseInt(b.querySelector('.staff-stats .stat:nth-child(1) span').textContent);
            return sessB - sessA;
        } else if (sortType === 'name') {
            const nameA = a.querySelector('h4').textContent;
            const nameB = b.querySelector('h4').textContent;
            return nameA.localeCompare(nameB);
        }
        return 0;
    });

    items.forEach(item => grid.appendChild(item));
};

// Initialize sort on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(createSortOptions, 100);
});

// ===== EXPORT UTILITIES =====
window.StaffPageUtils = {
    filterBySpecialty: (specialty) => {
        const filter = document.getElementById('specialtyFilter');
        if (filter) {
            filter.value = specialty;
            filter.dispatchEvent(new Event('change'));
        }
    },
    
    filterByAvailability: (status) => {
        const filter = document.getElementById('availabilityFilter');
        if (filter) {
            filter.value = status;
            filter.dispatchEvent(new Event('change'));
        }
    },
    
    toggleView: () => {
        const toggle = document.getElementById('viewToggle');
        if (toggle) toggle.click();
    }
};