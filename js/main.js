/*
 * Cree Distributor Website - Main JavaScript
 * Handles interactive elements and dynamic functionality
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    setCurrentYear();

    // Initialize mobile menu toggle
    initMobileMenu();

    // Initialize mobile dropdown menus
    initMobileDropdowns();

    // Initialize accordion/FAQ functionality
    initAccordions();

    // Initialize product filtering if on product pages
    initProductFilters();

    // Initialize any form functionality
    initForms();

    // Initialize search functionality if search exists
    initSearch();
});

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Mobile menu toggle functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle && navMenu && mainNav) {
        mobileToggle.addEventListener('click', function() {
            // 切换活跃状态（使用 CSS 类，而非 inline styles）
            const isActive = navMenu.classList.contains('mobile-active');

            if (isActive) {
                navMenu.classList.remove('mobile-active');
                mainNav.classList.remove('mobile-active');
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
            } else {
                navMenu.classList.add('mobile-active');
                mainNav.classList.add('mobile-active');
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    }
}

// 移动端下拉菜单点击切换
function initMobileDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown > a');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // 在移动设备上阻止默认链接行为
            if (window.innerWidth < 768) {
                e.preventDefault();

                const dropdown = this.parentElement;
                const isOpen = dropdown.classList.contains('open');

                // 关闭所有其他下拉菜单
                document.querySelectorAll('.dropdown.open').forEach(item => {
                    if (item !== dropdown) {
                        item.classList.remove('open');
                        item.querySelector('a').setAttribute('aria-expanded', 'false');
                    }
                });

                // 切换当前下拉菜单
                if (isOpen) {
                    dropdown.classList.remove('open');
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    dropdown.classList.add('open');
                    this.setAttribute('aria-expanded', 'true');
                }
            }
        });
    });
}

// Accordion/FAQ functionality
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordion = this.parentElement;
            const content = accordion.querySelector('.accordion-content');
            const arrow = this.querySelector('.arrow');
            
            // Toggle active class on content
            content.classList.toggle('active');
            
            // Toggle arrow rotation
            if (arrow) {
                arrow.classList.toggle('active');
            }
            
            // Close other accordions in the same container
            const allAccordions = accordion.parentElement.querySelectorAll('.accordion');
            allAccordions.forEach(otherAccordion => {
                if (otherAccordion !== accordion) {
                    const otherContent = otherAccordion.querySelector('.accordion-content');
                    const otherArrow = otherAccordion.querySelector('.arrow');
                    
                    otherContent.classList.remove('active');
                    if (otherArrow) otherArrow.classList.remove('active');
                }
            });
        });
    });
}

// Product filtering functionality
function initProductFilters() {
    const filterOptions = document.querySelectorAll('.filter-option');
    
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Toggle active class on clicked option
            this.classList.toggle('active');
            
            // Additional filtering logic would go here
            // This would involve showing/hiding products based on selected filters
            filterProducts();
        });
    });
}

// Filter products based on selected filters
function filterProducts() {
    // Get all active filters
    const activeFilters = document.querySelectorAll('.filter-option.active');
    const filterValues = Array.from(activeFilters).map(filter => filter.dataset.filter);
    
    // Get all products
    const products = document.querySelectorAll('.product-item');
    
    // Show/hide products based on filters
    products.forEach(product => {
        const productCategories = product.dataset.categories ? product.dataset.categories.split(' ') : [];
        
        // Product is visible if it matches any selected filter, or if no filters are selected
        let isVisible = filterValues.length === 0;
        
        if (filterValues.length > 0) {
            isVisible = productCategories.some(category => filterValues.includes(category));
        }
        
        product.style.display = isVisible ? 'block' : 'none';
    });
}

// Form initialization
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('invalid');
                } else {
                    field.classList.remove('invalid');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
                return;
            }
            
            // Add loading state to submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }
        });
    });
    
    // Add input validation feedback
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid') && this.value.trim()) {
                this.classList.remove('invalid');
            }
        });
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // This would typically involve searching through products or content
            // For now, we'll just log the search term
            console.log('Searching for:', searchTerm);
            
            // Additional search logic would go here
            performSearch(searchTerm);
        });
    }
}

// Perform search based on term
function performSearch(term) {
    // Search logic would go here
    // This might involve filtering products, articles, etc.
    console.log('Performing search for:', term);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Track scroll position for header effects
function initScrollEffects() {
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Initialize lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src], picture source[data-srcset]');

    if ('IntersectionObserver' in window) {
        const config = {
            rootMargin: '50px 0px', // Start loading 50px before entering viewport
            threshold: 0.01
        };

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    // Handle picture element source tags
                    if (element.tagName === 'SOURCE' && element.dataset.srcset) {
                        element.srcset = element.dataset.srcset;
                        delete element.dataset.srcset;
                    }

                    // Handle img elements
                    if (element.tagName === 'IMG' && element.dataset.src) {
                        // Add loading state
                        element.classList.add('lazy-loading');

                        // Preload the image
                        const img = new Image();
                        img.onload = () => {
                            element.src = element.dataset.src;
                            element.classList.remove('lazy-loading');
                            element.classList.add('lazy-loaded');
                            delete element.dataset.src;
                        };
                        img.onerror = () => {
                            element.classList.remove('lazy-loading');
                            element.classList.add('lazy-error');
                            console.error('Failed to load image:', element.dataset.src);
                        };
                        img.src = element.dataset.src;
                    }

                    imageObserver.unobserve(element);
                }
            });
        }, config);

        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(element => {
            if (element.dataset.src) {
                element.src = element.dataset.src;
                delete element.dataset.src;
            }
            if (element.dataset.srcset) {
                element.srcset = element.dataset.srcset;
                delete element.dataset.srcset;
            }
        });
    }
}

// Initialize comparison functionality
function initComparison() {
    const compareButtons = document.querySelectorAll('.compare-btn');
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            
            // Add to comparison list
            addToComparison(productId);
            
            // Visual feedback
            this.textContent = 'Added to Compare';
            this.style.backgroundColor = '#10B981';
            
            setTimeout(() => {
                this.textContent = 'Compare';
                this.style.backgroundColor = '';
            }, 2000);
        });
    });
}

// Add product to comparison
function addToComparison(productId) {
    let comparisonList = JSON.parse(localStorage.getItem('comparisonList')) || [];
    
    if (!comparisonList.includes(productId)) {
        comparisonList.push(productId);
        localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
    }
    
    updateComparisonUI();
}

// Update comparison UI elements
function updateComparisonUI() {
    const compareCount = document.querySelector('.compare-count');
    const comparisonList = JSON.parse(localStorage.getItem('comparisonList')) || [];
    
    if (compareCount) {
        compareCount.textContent = comparisonList.length;
    }
}

// Initialize when page loads
window.addEventListener('load', function() {
    initSmoothScrolling();
    initScrollEffects();
    initLazyLoading();
    updateComparisonUI();
});

// Re-initialize mobile dropdowns on window resize
window.addEventListener('resize', function() {
    initMobileDropdowns();
});