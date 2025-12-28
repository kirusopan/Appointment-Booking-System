/* =========================================
   SERVICES PAGE SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.getElementById('serviceSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const serviceItems = document.querySelectorAll('.service-item');
    const noResults = document.getElementById('noResults');

    // Filter services function
    const filterServices = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;
        
        let visibleCount = 0;

        serviceItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const description = item.querySelector('.service-content-full > p').textContent.toLowerCase();
            const category = item.getAttribute('data-category');
            const price = parseInt(item.getAttribute('data-price'));

            // Search filter
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);

            // Category filter
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

            // Price filter
            let matchesPrice = true;
            if (selectedPrice !== 'all') {
                if (selectedPrice === '0-50') {
                    matchesPrice = price >= 0 && price <= 50;
                } else if (selectedPrice === '50-100') {
                    matchesPrice = price > 50 && price <= 100;
                } else if (selectedPrice === '100-200') {
                    matchesPrice = price > 100 && price <= 200;
                } else if (selectedPrice === '200+') {
                    matchesPrice = price > 200;
                }
            }

            // Show or hide item
            if (matchesSearch && matchesCategory && matchesPrice) {
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
        
        countBadge.textContent = `${count} Service${count !== 1 ? 's' : ''} Found`;
    };

    // Event listeners for filters
    if (searchInput) {
        searchInput.addEventListener('input', filterServices);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterServices);
    }

    if (priceFilter) {
        priceFilter.addEventListener('change', filterServices);
    }

    // Initialize with count
    updateResultsCount(serviceItems.length);

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
            categoryFilter.value = 'all';
            priceFilter.value = 'all';
            filterServices();
            clearButton.style.display = 'none';
        });

        filterBar.appendChild(clearButton);

        // Show clear button when filters are active
        const checkFiltersActive = () => {
            if (searchInput.value || categoryFilter.value !== 'all' || priceFilter.value !== 'all') {
                clearButton.style.display = 'inline-block';
            } else {
                clearButton.style.display = 'none';
            }
        };

        searchInput.addEventListener('input', checkFiltersActive);
        categoryFilter.addEventListener('change', checkFiltersActive);
        priceFilter.addEventListener('change', checkFiltersActive);
    };

    createClearButton();

    // ===== QUICK BOOK FUNCTIONALITY =====
    const quickBookButtons = document.querySelectorAll('.service-overlay .btn');
    
    quickBookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceCard = this.closest('.service-card-full');
            const serviceName = serviceCard.querySelector('h4').textContent;
            const servicePrice = serviceCard.querySelector('.price').textContent;
            
            // Store service info in sessionStorage for booking page
            sessionStorage.setItem('selectedService', JSON.stringify({
                name: serviceName,
                price: servicePrice
            }));
            
            // Show feedback
            Utils.showToast(`Selected: ${serviceName}`, 'success');
            
            // Redirect to booking page
            setTimeout(() => {
                window.location.href = 'booking.html';
            }, 500);
        });
    });

    // ===== SERVICE CARD INTERACTIONS =====
    const serviceCards = document.querySelectorAll('.service-card-full');
    
    serviceCards.forEach(card => {
        // Add click to expand effect
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking buttons
            if (e.target.closest('.btn')) return;
            
            // Add active class
            serviceCards.forEach(c => c.classList.remove('active-card'));
            this.classList.add('active-card');
        });

        // Hover effect on features
        const features = card.querySelectorAll('.service-features li');
        features.forEach((feature, index) => {
            feature.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // Add active card styles
    const addActiveCardStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .service-card-full.active-card {
                border: 3px solid var(--primary);
                box-shadow: 0 25px 50px rgba(99, 102, 241, 0.3);
            }
        `;
        document.head.appendChild(style);
    };

    addActiveCardStyles();

    // ===== PRICE COMPARISON FEATURE =====
    const showPriceComparison = () => {
        const prices = Array.from(serviceItems).map(item => 
            parseInt(item.getAttribute('data-price'))
        );
        
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        console.log('Price Statistics:', {
            average: `$${avgPrice.toFixed(2)}`,
            min: `$${minPrice}`,
            max: `$${maxPrice}`
        });
    };

    showPriceComparison();

    // ===== SORT FUNCTIONALITY =====
    const createSortOptions = () => {
        const filterBar = document.querySelector('.filter-bar .row');
        if (!filterBar) return;

        const sortCol = document.createElement('div');
        sortCol.className = 'col-lg-3 col-md-6 mt-3 mt-lg-0';
        sortCol.innerHTML = `
            <select class="form-select" id="sortFilter">
                <option value="default">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
            </select>
        `;
        
        filterBar.appendChild(sortCol);

        const sortFilter = document.getElementById('sortFilter');
        sortFilter.addEventListener('change', function() {
            sortServices(this.value);
        });
    };

    const sortServices = (sortType) => {
        const grid = document.getElementById('servicesGrid');
        const items = Array.from(serviceItems);

        items.sort((a, b) => {
            if (sortType === 'price-low') {
                return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
            } else if (sortType === 'price-high') {
                return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
            } else if (sortType === 'name') {
                const nameA = a.querySelector('h4').textContent;
                const nameB = b.querySelector('h4').textContent;
                return nameA.localeCompare(nameB);
            }
            return 0;
        });

        items.forEach(item => grid.appendChild(item));
    };

    createSortOptions();

    // ===== LAZY LOADING FOR IMAGES =====
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('.service-image-full img');
        
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

    // ===== FAVORITE SERVICES =====
    const addFavoriteFeature = () => {
        serviceCards.forEach(card => {
            const favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'favorite-btn';
            favoriteBtn.innerHTML = '<i class="bi bi-heart"></i>';
            favoriteBtn.style.cssText = `
                position: absolute;
                top: 1rem;
                left: 1rem;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 3;
                transition: all 0.3s ease;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            `;

            const imageContainer = card.querySelector('.service-image-full');
            imageContainer.style.position = 'relative';
            imageContainer.appendChild(favoriteBtn);

            // Check if already favorited
            const serviceName = card.querySelector('h4').textContent;
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            if (favorites.includes(serviceName)) {
                favoriteBtn.classList.add('favorited');
                favoriteBtn.innerHTML = '<i class="bi bi-heart-fill"></i>';
                favoriteBtn.style.color = 'var(--danger)';
            }

            favoriteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleFavorite(serviceName, this);
            });
        });
    };

    const toggleFavorite = (serviceName, button) => {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favorites.includes(serviceName)) {
            favorites = favorites.filter(fav => fav !== serviceName);
            button.innerHTML = '<i class="bi bi-heart"></i>';
            button.style.color = '';
            button.classList.remove('favorited');
            Utils.showToast('Removed from favorites', 'info');
        } else {
            favorites.push(serviceName);
            button.innerHTML = '<i class="bi bi-heart-fill"></i>';
            button.style.color = 'var(--danger)';
            button.classList.add('favorited');
            Utils.showToast('Added to favorites', 'success');
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };

    addFavoriteFeature();

    // ===== SCROLL TO TOP BUTTON =====
    const createScrollToTop = () => {
        const button = document.createElement('button');
        button.id = 'scrollToTop';
        button.innerHTML = '<i class="bi bi-arrow-up"></i>';
        button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.display = 'flex';
            } else {
                button.style.display = 'none';
            }
        });

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    };

    createScrollToTop();

    // ===== ANALYTICS TRACKING =====
    const trackServiceViews = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('viewed')) {
                    entry.target.classList.add('viewed');
                    const serviceName = entry.target.querySelector('h4').textContent;
                    console.log('Service viewed:', serviceName);
                    // Here you can send to analytics
                }
            });
        }, { threshold: 0.5 });

        serviceItems.forEach(item => observer.observe(item));
    };

    trackServiceViews();

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
            filterServices();
        }
    });

    console.log('%c📦 Services Page Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard Shortcuts: "/" to search, "Esc" to clear', 'color: #64748b; font-size: 12px;');
});

// ===== EXPORT UTILITIES =====
window.ServicesPageUtils = {
    filterByCategory: (category) => {
        const filter = document.getElementById('categoryFilter');
        if (filter) {
            filter.value = category;
            filter.dispatchEvent(new Event('change'));
        }
    },
    
    filterByPrice: (priceRange) => {
        const filter = document.getElementById('priceFilter');
        if (filter) {
            filter.value = priceRange;
            filter.dispatchEvent(new Event('change'));
        }
    }
};