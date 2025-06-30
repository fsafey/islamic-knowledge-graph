/**
 * @fileoverview Mobile UI Module
 * @version 1.0.0
 * 
 * Purpose: Mobile-specific interface functionality
 * Dependencies: None
 * Exports: Mobile sidebar management and responsive utilities
 */

/**
 * Toggle mobile sidebar visibility
 * Exact implementation from monolithic version (Lines 3718-3734)
 */
export function toggleMobileSidebar() {
    const sidebar = document.querySelector('.graph-sidebar');
    const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
    
    if (sidebar) {
        const isOpen = sidebar.classList.contains('mobile-open');
        if (isOpen) {
            sidebar.classList.remove('mobile-open');
            toggleBtn.textContent = '📚';
            toggleBtn.setAttribute('aria-label', 'Open sidebar');
        } else {
            sidebar.classList.add('mobile-open');
            toggleBtn.textContent = '✕';
            toggleBtn.setAttribute('aria-label', 'Close sidebar');
        }
    }
}

/**
 * Initialize mobile functionality with global accessibility
 */
export function initializeMobile() {
    // Make toggleMobileSidebar available globally for onclick handlers
    window.toggleMobileSidebar = toggleMobileSidebar;
    
    // Close mobile sidebar when clicking outside
    // Implementation from monolithic Lines 3737-3762
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.graph-sidebar');
        const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
        
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('mobile-open')) {
            if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
                sidebar.classList.remove('mobile-open');
                toggleBtn.textContent = '📚';
                toggleBtn.setAttribute('aria-label', 'Open sidebar');
            }
        }
    });
    
    // Handle window resize for responsive behavior
    // Implementation from monolithic Lines 3751-3762
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.graph-sidebar');
        const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
        
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('mobile-open');
            if (toggleBtn) {
                toggleBtn.textContent = '📚';
                toggleBtn.setAttribute('aria-label', 'Open sidebar');
            }
        }
    });
    
    console.log('✅ Mobile functionality initialized');
}

/**
 * Utility functions for mobile detection and responsive behavior
 */
export function isMobileDevice() {
    return window.innerWidth <= 768;
}

export function getViewportWidth() {
    return window.innerWidth;
}

export function adjustForMobile(element, mobileClass = 'mobile-optimized') {
    if (isMobileDevice()) {
        element.classList.add(mobileClass);
    } else {
        element.classList.remove(mobileClass);
    }
}