/**
 * Islamic Knowledge Graph - Main Application Coordinator
 * Initializes and coordinates all modules for the modular knowledge graph
 */

import { graphData } from './data/graph-data.js';
import { DOMManager } from './ui/dom-manager.js';
import { 
    initializeGraph, 
    buildConnectionCache, 
    setupKeyboardNavigation,
    enablePerformanceTracking,
    resetGraphView,
    unpinSidebar
} from './core/graph-core.js';
import { InteractionStateManager } from './core/interaction-state-manager.js';
import { initializeSearch } from './ui/search.js';
import { loadSavedProgress, initializeLearningPathEvents } from './ui/learning-paths.js';
import { initializeMobile } from './ui/mobile.js';

// Import advanced visual enhancement modules
import { initializeNotificationSystem, createAdvancedNotification } from './ui/notifications.js';
import { initializeVisualEffects } from './ui/visual-effects.js';
import { initializeConnectionVisualization } from './ui/connection-visualization.js';
import { initializeEnhancedModal, showEnhancedModal } from './ui/enhanced-modal.js';
import { initializeSidebarAnimations } from './ui/sidebar-animations.js';
import { initializeProgressVisualization } from './ui/progress-visualization.js';

// Import Rich Content Manager for enhanced nodes
import { richContentManager } from './utils/rich-content-manager.js';

// Import Enhanced Search for improved discovery
import { enhancedSearch } from './ui/enhanced-search.js';

/**
 * Initialize the entire application
 */
export function initializeApp() {
    console.log('Initializing Islamic Knowledge Graph Application...');
    
    // Calculate proper dimensions like original
    const containerElement = document.querySelector('.container');
    const sidebarWidth = 400; // Match sidebar width from original
    const totalWidth = containerElement ? containerElement.offsetWidth : 1200;
    const graphWidth = totalWidth - sidebarWidth; // Graph area width
    const graphHeight = 700; // Fixed height from original
    
    // Application configuration
    const config = {
        containerSelector: '#graph',
        width: graphWidth,
        height: graphHeight,
        enableAnalytics: true
    };
    
    // Validate required DOM elements exist
    try {
        DOMManager.validateElements();
        console.log('✅ All required DOM elements found');
    } catch (error) {
        console.error('❌ DOM validation failed:', error.message);
        showErrorMessage('Required page elements are missing. Please refresh the page.');
        return;
    }
    
    // Initialize core modules in order
    try {
        // 1. Initialize the graph visualization (includes DOM cache setup)
        console.log('Initializing graph visualization with DOM optimization...');
        initializeGraph('graph', config.width, config.height);
        
        // 2. Build connection cache for performance
        console.log('Building connection cache...');
        buildConnectionCache();
        
        // 3. Initialize search functionality (will integrate with DOM cache)
        console.log('Initializing optimized search...');
        initializeSearch();
        
        // 4. Setup keyboard navigation
        console.log('Setting up keyboard navigation...');
        setupKeyboardNavigation();
        
        // 5. Load saved learning progress
        console.log('Loading saved progress...');
        loadSavedProgress();
        
        // 6. Enable performance monitoring if configured
        if (config.enableAnalytics) {
            console.log('Enabling performance tracking...');
            enablePerformanceTracking();
        }
        
        // 7. Setup responsive handlers
        setupResponsiveHandlers();
        
        // 8. Initialize learning path event delegation (CSP-compliant)
        console.log('Initializing learning path event delegation...');
        initializeLearningPathEvents();
        
        // 9. Initialize mobile functionality
        console.log('Initializing mobile functionality...');
        initializeMobile();
        
        // 10. Initialize advanced visual enhancements
        console.log('Initializing advanced visual enhancements...');
        initializeNotificationSystem();
        initializeVisualEffects();
        initializeConnectionVisualization();
        initializeEnhancedModal();
        initializeSidebarAnimations();
        initializeProgressVisualization();
        
        // Show startup notification with enhanced search info
        const enhancedNodesCount = richContentManager.enhancedNodes.size;
        createAdvancedNotification('Islamic Knowledge Graph initialized successfully!', 'success', {
            subtitle: `Loaded ${graphData.nodes.length} nodes (${enhancedNodesCount} enhanced ⭐) and ${graphData.links.length} connections`,
            duration: 3000,
            position: 'top-center'
        });
        
        console.log('✅ Islamic Knowledge Graph with advanced visual enhancements initialized successfully!');
        console.log(`📊 Loaded ${graphData.nodes.length} nodes and ${graphData.links.length} connections`);
        console.log('🎯 InteractionStateManager ready - hover/drag conflicts resolved!');
        
        // Add global debugging helpers
        window.debugInteractions = () => {
            console.log('🔍 Current Interaction State:', InteractionStateManager.getDebugInfo());
        };
        
        // Enable detailed logging for diagnosis
        window.enableDiagnosticLogging = () => {
            console.log('🔧 DIAGNOSTIC LOGGING ENABLED - All hover/drag events will be logged');
            console.log('📝 Instructions:');
            console.log('   • Move mouse over nodes to see hover events');
            console.log('   • Drag nodes to see drag events');
            console.log('   • Watch for state transitions and conflicts');
            console.log('   • Use window.debugInteractions() to check current state');
            console.log('   • Use window.disableDiagnosticLogging() to stop');
        };
        
        window.disableDiagnosticLogging = () => {
            console.log('🔇 Diagnostic logging would be disabled (not implemented yet)');
        };
        
        // Auto-enable diagnostic logging for debugging
        window.enableDiagnosticLogging();
        
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        showErrorMessage('Failed to load the knowledge graph. Please refresh the page.');
    }
}

/**
 * Setup responsive event handlers
 */
function setupResponsiveHandlers() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const container = document.getElementById('graph');
            if (container && window.svg) {
                const newWidth = container.clientWidth;
                const newHeight = container.clientHeight;
                window.svg.attr('width', newWidth).attr('height', newHeight);
                
                if (window.simulation) {
                    window.simulation
                        .force('center', d3.forceCenter(newWidth / 2, newHeight / 2))
                        .alpha(0.1)
                        .restart();
                }
            }
            
            // Handle mobile sidebar
            handleWindowResize();
        }, 250);
    });
}

// Note: Global learning path functions removed in favor of event delegation
// This improves CSP compliance and follows modern JavaScript patterns

/**
 * Show error message to user
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #f44336;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 9999;
        font-family: Georgia, serif;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

/**
 * Handle window resize events for mobile sidebar
 */
function handleWindowResize() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
    
    // Close mobile sidebar when switching to desktop view
    if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
        if (toggleBtn) {
            toggleBtn.textContent = '☰';
        }
    }
}

/**
 * Reset graph view to default state
 */
function resetView() {
    unpinSidebar();
    resetGraphView();
    console.log('View reset to default state');
}

/**
 * Initialize application when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for external access if needed
export { resetView };

// Make enhanced modal and rich content manager available globally for easy access
window.showEnhancedLearningModal = showEnhancedModal;
window.richContentManager = richContentManager;