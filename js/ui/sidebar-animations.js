/**
 * Advanced Sidebar Animations System
 * Implements smooth transitions, progressive disclosure, and sophisticated micro-interactions
 * Based on advanced animation patterns for enhanced user experience
 */

import { DOMManager } from './dom-manager.js';

// Animation state management
let animationQueue = [];
let isAnimating = false;
let sidebarState = {
    isPinned: false,
    currentContent: null,
    animationDirection: 'in',
    lastUpdate: 0
};

// Animation configurations
const animationConfig = {
    duration: {
        fast: 200,
        normal: 400,
        slow: 600
    },
    easing: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        bouncy: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
        sharp: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    effects: {
        fadeSlide: 'fadeSlide',
        scaleIn: 'scaleIn',
        slideUp: 'slideUp',
        progressiveDisclosure: 'progressiveDisclosure'
    }
};

/**
 * Initialize advanced sidebar animations
 */
export function initializeSidebarAnimations() {
    addAnimationStyles();
    setupSidebarObservers();
    console.log('✅ Advanced sidebar animations initialized');
}

/**
 * Add sophisticated CSS animations
 */
function addAnimationStyles() {
    if (document.getElementById('sidebar-animations-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'sidebar-animations-styles';
    style.textContent = `
        /* Sidebar content transition classes */
        .sidebar-content-transition {
            transition: all ${animationConfig.duration.normal}ms ${animationConfig.easing.smooth};
        }
        
        .sidebar-fade-in {
            animation: sidebarFadeIn ${animationConfig.duration.normal}ms ${animationConfig.easing.smooth} forwards;
        }
        
        .sidebar-fade-out {
            animation: sidebarFadeOut ${animationConfig.duration.fast}ms ${animationConfig.easing.sharp} forwards;
        }
        
        .sidebar-slide-in {
            animation: sidebarSlideIn ${animationConfig.duration.normal}ms ${animationConfig.easing.bouncy} forwards;
        }
        
        .sidebar-progressive-reveal {
            animation: progressiveReveal ${animationConfig.duration.slow}ms ${animationConfig.easing.smooth} forwards;
        }
        
        .sidebar-section-animate {
            opacity: 0;
            transform: translateX(-20px);
            animation: sectionSlideIn ${animationConfig.duration.normal}ms ${animationConfig.easing.smooth} forwards;
        }
        
        /* Keyframe animations */
        @keyframes sidebarFadeIn {
            from { 
                opacity: 0; 
                transform: translateX(-15px);
            }
            to { 
                opacity: 1; 
                transform: translateX(0);
            }
        }
        
        @keyframes sidebarFadeOut {
            from { 
                opacity: 1; 
                transform: translateX(0);
            }
            to { 
                opacity: 0; 
                transform: translateX(-15px);
            }
        }
        
        @keyframes sidebarSlideIn {
            from { 
                opacity: 0; 
                transform: translateY(20px) scale(0.98);
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes progressiveReveal {
            0% { 
                opacity: 0; 
                transform: translateY(30px);
                filter: blur(2px);
            }
            50% { 
                opacity: 0.5; 
                transform: translateY(10px);
                filter: blur(1px);
            }
            100% { 
                opacity: 1; 
                transform: translateY(0);
                filter: blur(0);
            }
        }
        
        @keyframes sectionSlideIn {
            to { 
                opacity: 1; 
                transform: translateX(0);
            }
        }
        
        /* Pinned state animations */
        .sidebar-pin-indicator {
            opacity: 0;
            transform: scale(0.8);
            transition: all ${animationConfig.duration.fast}ms ${animationConfig.easing.bouncy};
        }
        
        .sidebar-pin-indicator.active {
            opacity: 1;
            transform: scale(1);
        }
        
        /* Loading state animations */
        .sidebar-loading {
            position: relative;
            overflow: hidden;
        }
        
        .sidebar-loading::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #f4c64f, transparent);
            animation: loadingShimmer 1.5s infinite;
        }
        
        @keyframes loadingShimmer {
            to { left: 100%; }
        }
        
        /* Hover enhancement animations */
        .sidebar-section {
            transition: all ${animationConfig.duration.fast}ms ${animationConfig.easing.smooth};
        }
        
        .sidebar-section:hover {
            transform: translateX(4px);
            box-shadow: -4px 0 12px rgba(40, 86, 163, 0.1);
        }
        
        /* Mobile-specific animations */
        @media (max-width: 768px) {
            .sidebar-mobile-slide {
                transform: translateX(-100%);
                transition: transform ${animationConfig.duration.normal}ms ${animationConfig.easing.smooth};
            }
            
            .sidebar-mobile-slide.open {
                transform: translateX(0);
            }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .sidebar-content-transition,
            .sidebar-fade-in,
            .sidebar-fade-out,
            .sidebar-slide-in,
            .sidebar-progressive-reveal,
            .sidebar-section-animate {
                animation: none !important;
                transition: none !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Setup sidebar content observers for automatic animations
 */
function setupSidebarObservers() {
    const sidebarContent = DOMManager.getSidebarContent();
    if (!sidebarContent) return;
    
    // Create intersection observer for progressive disclosure
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElementIn(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '20px'
    });
    
    // Observe sidebar sections
    const observeSections = () => {
        sidebarContent.querySelectorAll('.sidebar-section').forEach(section => {
            observer.observe(section);
        });
    };
    
    // Initial observation
    observeSections();
    
    // Re-observe when content changes
    const mutationObserver = new MutationObserver(observeSections);
    mutationObserver.observe(sidebarContent, {
        childList: true,
        subtree: true
    });
}

/**
 * Animate sidebar content update with sophisticated transitions
 * @param {string} newContent - New HTML content
 * @param {Object} options - Animation options
 */
export function animateSidebarUpdate(newContent, options = {}) {
    const {
        effect = animationConfig.effects.fadeSlide,
        duration = animationConfig.duration.normal,
        staggerDelay = 100,
        preserveScroll = true
    } = options;
    
    if (isAnimating) {
        animationQueue.push(() => animateSidebarUpdate(newContent, options));
        return;
    }
    
    isAnimating = true;
    const sidebarContent = DOMManager.getSidebarContent();
    if (!sidebarContent) {
        isAnimating = false;
        return;
    }
    
    // Store scroll position if needed
    const scrollPosition = preserveScroll ? sidebarContent.scrollTop : 0;
    
    // Apply exit animation
    applyExitAnimation(sidebarContent, effect).then(() => {
        // Update content
        sidebarContent.innerHTML = newContent;
        
        // Restore scroll position
        if (preserveScroll) {
            sidebarContent.scrollTop = scrollPosition;
        }
        
        // Apply entrance animation
        applyEntranceAnimation(sidebarContent, effect, staggerDelay).then(() => {
            isAnimating = false;
            sidebarState.lastUpdate = Date.now();
            
            // Process animation queue
            if (animationQueue.length > 0) {
                const nextAnimation = animationQueue.shift();
                nextAnimation();
            }
        });
    });
}

/**
 * Apply exit animation to sidebar content
 */
function applyExitAnimation(element, effect) {
    return new Promise(resolve => {
        element.classList.add('sidebar-fade-out');
        
        setTimeout(() => {
            element.classList.remove('sidebar-fade-out');
            resolve();
        }, animationConfig.duration.fast);
    });
}

/**
 * Apply entrance animation to sidebar content
 */
function applyEntranceAnimation(element, effect, staggerDelay) {
    return new Promise(resolve => {
        element.classList.add('sidebar-fade-in');
        
        // Animate sections with stagger effect
        const sections = element.querySelectorAll('.sidebar-section, [style*="background:"]');
        sections.forEach((section, index) => {
            section.classList.add('sidebar-section-animate');
            section.style.animationDelay = `${index * staggerDelay}ms`;
        });
        
        const totalDuration = animationConfig.duration.normal + (sections.length * staggerDelay);
        
        setTimeout(() => {
            element.classList.remove('sidebar-fade-in');
            sections.forEach(section => {
                section.classList.remove('sidebar-section-animate');
                section.style.animationDelay = '';
            });
            resolve();
        }, totalDuration);
    });
}

/**
 * Animate element into view with sophisticated effects
 */
function animateElementIn(element) {
    if (element.classList.contains('animated-in')) return;
    
    element.classList.add('sidebar-slide-in', 'animated-in');
    
    // Add hover enhancement
    element.classList.add('sidebar-section');
}

/**
 * Animate learning path progress with visual feedback
 * @param {Array} pathNodes - Learning path node IDs
 * @param {number} currentIndex - Current position in path
 */
export function animateLearningPathProgress(pathNodes, currentIndex) {
    const progressContainer = createProgressContainer(pathNodes, currentIndex);
    
    return new Promise(resolve => {
        // Animate progress bar
        const progressBar = progressContainer.querySelector('.progress-bar-fill');
        const progressPercentage = ((currentIndex + 1) / pathNodes.length) * 100;
        
        setTimeout(() => {
            progressBar.style.width = `${progressPercentage}%`;
        }, 100);
        
        // Animate step indicators
        const stepIndicators = progressContainer.querySelectorAll('.step-indicator');
        stepIndicators.forEach((indicator, index) => {
            const delay = index * 50;
            setTimeout(() => {
                if (index <= currentIndex) {
                    indicator.classList.add('completed');
                } else if (index === currentIndex + 1) {
                    indicator.classList.add('current');
                }
            }, delay);
        });
        
        resolve(progressContainer);
    });
}

/**
 * Create progress container with sophisticated styling
 */
function createProgressContainer(pathNodes, currentIndex) {
    const container = document.createElement('div');
    container.className = 'learning-path-progress';
    
    const progressPercentage = ((currentIndex + 1) / pathNodes.length) * 100;
    
    container.innerHTML = `
        <div style="
            background: rgba(244, 198, 79, 0.1);
            padding: 16px;
            border-radius: 8px;
            margin: 16px 0;
            border: 1px solid rgba(244, 198, 79, 0.3);
        ">
            <div style="
                color: #f4c64f;
                font-weight: 600;
                margin-bottom: 12px;
                font-size: 0.9rem;
            ">
                📈 Learning Progress
            </div>
            
            <!-- Progress Bar -->
            <div style="
                background: rgba(244, 198, 79, 0.2);
                height: 8px;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 12px;
                position: relative;
            ">
                <div class="progress-bar-fill" style="
                    background: linear-gradient(90deg, #f4c64f 0%, #e6b566 100%);
                    height: 100%;
                    width: 0%;
                    border-radius: 4px;
                    transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 20px;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
                        animation: progressShine 2s infinite;
                    "></div>
                </div>
            </div>
            
            <!-- Step Indicators -->
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 4px;
            ">
                ${pathNodes.map((nodeId, index) => `
                    <div class="step-indicator" data-step="${index}" style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        border: 2px solid rgba(244, 198, 79, 0.3);
                        background: transparent;
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.320, 1.275);
                        transform: scale(0.8);
                    "></div>
                `).join('')}
            </div>
            
            <div style="
                margin-top: 8px;
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.7);
                text-align: center;
            ">
                Step ${currentIndex + 1} of ${pathNodes.length} (${Math.round(progressPercentage)}%)
            </div>
        </div>
        
        <style>
            .step-indicator.completed {
                background: #f4c64f !important;
                border-color: #f4c64f !important;
                transform: scale(1) !important;
                box-shadow: 0 0 8px rgba(244, 198, 79, 0.5);
            }
            
            .step-indicator.current {
                border-color: #f4c64f !important;
                transform: scale(1.2) !important;
                animation: currentStepPulse 2s infinite;
            }
            
            @keyframes progressShine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            @keyframes currentStepPulse {
                0%, 100% { 
                    box-shadow: 0 0 8px rgba(244, 198, 79, 0.3);
                }
                50% { 
                    box-shadow: 0 0 16px rgba(244, 198, 79, 0.6);
                }
            }
        </style>
    `;
    
    return container;
}

/**
 * Show sidebar loading animation
 */
export function showSidebarLoading() {
    const sidebarContent = DOMManager.getSidebarContent();
    if (sidebarContent) {
        sidebarContent.classList.add('sidebar-loading');
    }
}

/**
 * Hide sidebar loading animation
 */
export function hideSidebarLoading() {
    const sidebarContent = DOMManager.getSidebarContent();
    if (sidebarContent) {
        sidebarContent.classList.remove('sidebar-loading');
    }
}

/**
 * Toggle sidebar pin state with animation
 */
export function toggleSidebarPin(isPinned) {
    sidebarState.isPinned = isPinned;
    
    const pinIndicator = document.querySelector('.sidebar-pin-indicator') || createPinIndicator();
    
    if (isPinned) {
        pinIndicator.classList.add('active');
        pinIndicator.textContent = '📌 Pinned';
    } else {
        pinIndicator.classList.remove('active');
        pinIndicator.textContent = '📌 Pin';
    }
}

/**
 * Create pin indicator element
 */
function createPinIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'sidebar-pin-indicator';
    indicator.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(40, 86, 163, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
        z-index: 100;
    `;
    
    const sidebar = DOMManager.getSidebar();
    if (sidebar) {
        sidebar.appendChild(indicator);
    }
    
    return indicator;
}

/**
 * Get current sidebar state
 */
export function getSidebarState() {
    return { ...sidebarState };
}

/**
 * Reset animation queue
 */
export function resetAnimationQueue() {
    animationQueue = [];
    isAnimating = false;
}