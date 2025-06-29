/**
 * @fileoverview Learning Paths Module (Modular Architecture)
 * @version 1.0.0
 * 
 * Purpose: Entry point for learning paths functionality using modular architecture
 * Dependencies: learning-paths-data.js, learning-paths-algorithms.js
 * Exports: All learning path functions through clean module delegation
 */

// Import data layer
import { 
    learningPaths, 
    didYouKnowFacts, 
    updatePathProgress, 
    loadSavedProgress as loadProgress,
    getDidYouKnowFact 
} from '../data/learning-paths-data.js';

// Import algorithm layer  
import { 
    determineLearningPath, 
    generateLearningGuidance, 
    generateContextAwareLearningGuidance,
    getPathSpecificConnections,
    generateLearningPathProgress 
} from '../algorithms/learning-paths-algorithms.js';

// Re-export data layer functions
export { learningPaths, didYouKnowFacts, updatePathProgress, getDidYouKnowFact };

// Re-export algorithm layer functions
export { 
    determineLearningPath, 
    generateLearningGuidance, 
    generateContextAwareLearningGuidance,
    getPathSpecificConnections,
    generateLearningPathProgress 
};

// Re-export with standardized name
export function loadSavedProgress() {
    return loadProgress();
}

// Event delegation functions are exported below

// UI functions - minimal implementations delegating to algorithms
export function toggleLearningPaths() {
    const pathsContainer = document.getElementById('learningPathsExpanded');
    const triggerText = document.getElementById('learningPathTriggerText');
    
    if (pathsContainer) {
        const isExpanded = pathsContainer.style.display === 'block';
        pathsContainer.style.display = isExpanded ? 'none' : 'block';
        
        if (triggerText) {
            triggerText.textContent = isExpanded ? 'Find your learning path →' : 'Hide learning paths ↑';
        }
    }
}

export function showUserType(userType) {
    // Update tab states
    document.querySelectorAll('.user-type-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.type === userType);
    });
    
    // Update content visibility
    document.querySelectorAll('.user-type-content').forEach(content => {
        content.classList.toggle('active', content.id === `${userType}-paths`);
    });
}

export function selectLearningPath(pathKey) {
    const path = learningPaths[pathKey];
    if (path) {
        window.currentLearningPathKey = pathKey;
        window.currentLearningPathInfo = path;
        window.currentLearningPath = path.nodes;
        updatePathProgress(pathKey, 0);
        
        // Provide user feedback
        console.log(`Selected learning path: ${pathKey}`);
        
        // Optional: Show a brief notification
        showLearningPathSelection(path.title || pathKey);
    }
}

// Helper function to show learning path selection feedback
function showLearningPathSelection(pathTitle) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2856A3;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(40, 86, 163, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = `✓ Selected: ${pathTitle}`;
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Event delegation setup
export function initializeLearningPathEvents() {
    // Main container event delegation
    const container = document.getElementById('learningPathContainer');
    if (!container) {
        console.warn('Learning path container not found');
        return;
    }
    
    // Event listeners for both click and keyboard interactions
    container.addEventListener('click', handleLearningPathClick);
    container.addEventListener('keydown', handleLearningPathKeydown);
    
    // Ensure interactive elements have proper ARIA attributes
    setupAccessibilityAttributes(container);
    
    console.log('✅ Learning path event delegation initialized');
}

// Centralized click handler with proper error handling and security validation
function handleLearningPathClick(event) {
    try {
        // Security: Ensure this is a trusted event
        if (!event.isTrusted) {
            console.warn('Untrusted event blocked');
            return;
        }
        
        const target = event.target.closest('[id], [data-type], [data-learning-path]');
        if (!target) return;
        
        // Handle learning path trigger
        if (target.id === 'learningPathTrigger') {
            event.preventDefault();
            toggleLearningPaths();
            return;
        }
        
        // Handle user type tabs with input validation
        if (target.classList.contains('user-type-tab') && target.dataset.type) {
            event.preventDefault();
            const userType = sanitizeUserType(target.dataset.type);
            if (userType) {
                showUserType(userType);
            }
            return;
        }
        
        // Handle learning path cards with input validation
        if (target.classList.contains('learning-path-card') && target.dataset.learningPath) {
            event.preventDefault();
            const pathKey = sanitizeLearningPathKey(target.dataset.learningPath);
            if (pathKey) {
                selectLearningPath(pathKey);
            }
            return;
        }
        
    } catch (error) {
        console.error('Error handling learning path click:', error);
        // Optionally show user-friendly error message
        showErrorNotification('An error occurred while processing your request.');
    }
}

// Input validation functions for security
function sanitizeUserType(userType) {
    const validTypes = ['beginner', 'student', 'scholar'];
    return validTypes.includes(userType) ? userType : null;
}

function sanitizeLearningPathKey(pathKey) {
    // Only allow alphanumeric characters, underscores, and hyphens
    const sanitized = pathKey.replace(/[^a-zA-Z0-9_-]/g, '');
    return sanitized.length > 0 && sanitized.length < 100 ? sanitized : null;
}

// Error notification function
function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = `⚠ ${message}`;
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Keyboard event handler for accessibility
function handleLearningPathKeydown(event) {
    // Only handle Enter and Space keys
    if (event.key !== 'Enter' && event.key !== ' ') {
        return;
    }
    
    const target = event.target.closest('[id], [data-type], [data-learning-path]');
    
    // Check if the target is a focusable element
    if (target && (target.tabIndex >= 0 || target.tagName === 'BUTTON')) {
        event.preventDefault();
        // Simulate click event for keyboard activation
        target.click();
    }
}

// Setup accessibility attributes for interactive elements
function setupAccessibilityAttributes(container) {
    try {
        // Add keyboard navigation support to learning path trigger
        const trigger = container.querySelector('#learningPathTrigger');
        if (trigger) {
            trigger.setAttribute('tabindex', '0');
            trigger.setAttribute('role', 'button');
            trigger.setAttribute('aria-label', 'Toggle learning paths');
        }
        
        // Ensure user type tabs have proper ARIA attributes
        const tabs = container.querySelectorAll('.user-type-tab');
        tabs.forEach((tab, index) => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', tab.classList.contains('active'));
            tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
        });
        
        // Add keyboard navigation to learning path cards
        const cards = container.querySelectorAll('.learning-path-card');
        cards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            const title = card.querySelector('h3');
            if (title) {
                card.setAttribute('aria-label', `Select learning path: ${title.textContent}`);
            }
        });
        
        console.log('✓ Accessibility attributes configured');
        
    } catch (error) {
        console.warn('Failed to setup accessibility attributes:', error);
    }
}

// Additional UI functions needed for complete compatibility

export function showFirstNodeInPath(firstNode) {
    const sidebarContent = document.getElementById("sidebarContent");
    if (!sidebarContent) return;
    
    // Get the spacer to maintain search bar spacing
    const spacer = '<div style="height: 280px; flex-shrink: 0;"></div>';
    
    // Build combined content: node info + learning path context
    let content = spacer + '<div style="height: 100%; overflow-y: auto; padding-right: 8px;">';
    
    // Node title and description
    content += `<h3 id="sidebarTitle">${firstNode.name}</h3>`;
    content += `<p id="sidebarDescription">${firstNode.description}</p>`;
    
    // Add quote section for verse nodes
    if (firstNode.type === 'verse' && firstNode.quote) {
        content += `
            <div style="background: rgba(255, 255, 255, 0.95); color: #2c3e50; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #f4c64f; font-style: italic; text-align: center;">
                "${firstNode.quote}"
            </div>
        `;
    }
    
    // Learning Path Progress Section (showing current position)
    const pathInfo = window.currentLearningPathInfo;
    if (pathInfo) {
        const pathNodes = window.currentLearningPath;
        const currentIndex = pathNodes.indexOf(firstNode.id);
        const progressHTML = generateLearningPathProgress(pathNodes, currentIndex);
        
        content += `
            <div style="background: rgba(40, 86, 163, 0.1); padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid rgba(40, 86, 163, 0.3);">
                <div style="color: #7db3d3; font-weight: 600; margin-bottom: 12px; font-size: 0.9rem;">📚 Learning Path: ${pathInfo.name}</div>
                ${progressHTML}
                <div style="margin-top: 12px;">
                    <button onclick="highlightLearningPath(window.currentLearningPath)" style="background: rgba(244, 198, 79, 0.2); border: 1px solid rgba(244, 198, 79, 0.4); color: #f4c64f; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                        🔍 Show Path on Graph
                    </button>
                </div>
            </div>
        `;
    }
    
    // Learning Guidance Section (context-aware)
    const guidance = generateLearningGuidance(firstNode);
    content += `
        <div id="sidebarGuidance" style="background: rgba(244, 198, 79, 0.1); padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid rgba(244, 198, 79, 0.3);">
            <div style="color: #f4c64f; font-weight: 600; margin-bottom: 12px; font-size: 0.9rem;">🧭 Learning Guidance</div>
            <div id="sidebarGuidanceContent" style="font-size: 0.85rem; color: rgba(255,255,255,0.8);">${guidance}</div>
        </div>
    `;
    
    // Did You Know Section
    if (firstNode.interestingFact) {
        content += `
            <div style="background: rgba(125, 179, 211, 0.1); padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid rgba(125, 179, 211, 0.3);">
                <div style="color: #7db3d3; font-weight: 600; margin-bottom: 8px; font-size: 0.9rem;">💡 Did you know?</div>
                <div style="font-size: 0.85rem; color: rgba(255,255,255,0.8);">${firstNode.interestingFact}</div>
            </div>
        `;
    }
    
    content += '</div>';
    
    // Update sidebar content
    sidebarContent.innerHTML = content;
}

export function highlightLearningPath(pathNodes) {
    // Get references to graph elements (these need to be available globally)
    const svg = window.svg;
    
    if (!svg) {
        console.warn('SVG element not available for highlighting learning path');
        return;
    }
    
    // Reset all node highlights and step indicators
    svg.selectAll('circle').style('stroke', '#333').style('stroke-width', 2).style('filter', null);
    svg.selectAll('.path-indicator').remove();
    
    // Highlight path nodes with enhanced visibility and sequence
    pathNodes.forEach((nodeId, index) => {
        svg.selectAll('circle')
            .filter(d => d.id === nodeId)
            .style('stroke', '#f4c64f')
            .style('stroke-width', 4)
            .style('filter', 'drop-shadow(0 0 6px rgba(244, 198, 79, 0.6))');
        
        // Add step indicators for learning path sequence
        const nodeElement = svg.selectAll('g.node').filter(d => d.id === nodeId);
        
        nodeElement.append('text')
            .attr('class', 'path-indicator')
            .attr('x', 25)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-weight', '700')
            .style('fill', '#f4c64f')
            .style('stroke', '#2c3e50')
            .style('stroke-width', '0.5px')
            .text(index + 1);
    });
}

export function updateSidebarForLearningPath(path) {
    const sidebarContent = document.getElementById("sidebarContent");
    if (sidebarContent) {
        sidebarContent.innerHTML = `
            <div style="height: 100%; overflow-y: auto; padding-right: 8px;">
                <h3 style="margin: 0 0 16px 0; color: #f4c64f; font-size: 1.25rem; font-weight: 700;">📚 ${path.name}</h3>
                <p style="margin: 0 0 16px 0; font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.9);">${path.description}</p>
                
                <!-- Learning Path Progress -->
                <div style="background: rgba(244, 198, 79, 0.1); padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid rgba(244, 198, 79, 0.3);">
                    <div style="color: #f4c64f; font-weight: 600; margin-bottom: 12px; font-size: 0.9rem;">🎯 Learning Journey</div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <span style="background: rgba(244, 198, 79, 0.2); color: #f4c64f; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">${path.nodes.length} Steps</span>
                        <span style="background: rgba(40, 86, 163, 0.2); color: #a8c5e8; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${path.difficulty}</span>
                    </div>
                    <div style="font-size: 0.85rem; color: rgba(255,255,255,0.8); margin-bottom: 12px;">Follow the numbered nodes to explore this learning path systematically.</div>
                    <button onclick="showLearningPathOnGraph(window.currentLearningPath)" style="background: rgba(244, 198, 79, 0.2); border: 1px solid rgba(244, 198, 79, 0.5); color: #f4c64f; padding: 8px 16px; border-radius: 6px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease;">Highlight Path</button>
                </div>
                
                <!-- Integration Tip -->
                <div style="background: rgba(168, 197, 232, 0.1); padding: 12px; border-radius: 6px; margin: 12px 0; border: 1px solid rgba(168, 197, 232, 0.3);">
                    <strong style="color: #a8c5e8; font-size: 0.9em;">💡 Learning Tip</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.85em; line-height: 1.4; color: rgba(255,255,255,0.8);">Hover over each numbered node to see detailed information and connections. Click to pin important details!</p>
                </div>
            </div>
        `;
    }
}

export function showPathSelectionConfirmation(path) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: linear-gradient(135deg, #2e8b57 0%, #3cb371 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(46, 139, 87, 0.3);
        z-index: 1000;
        font-weight: 600;
        max-width: 320px;
        transform: translateX(400px);
        transition: transform 0.4s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.2rem;">🎯</span>
            <div>
                <div style="font-size: 0.9rem; font-weight: 700;">Learning Path Selected</div>
                <div style="font-size: 0.8rem; opacity: 0.9; margin-top: 4px;">${path.name}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 400);
    }, 3000);
}

export function openLearningModal() {
    toggleLearningPaths();
}

export function closeLearningModal() {
    const pathsContainer = document.getElementById('learningPathsExpanded');
    if (pathsContainer && pathsContainer.style.display === 'block') {
        toggleLearningPaths();
    }
}

export function selectSpecificPath(nodeIds) {
    if (!nodeIds || nodeIds.length === 0) return;
    
    // Create a custom learning path from the provided node IDs
    const customPath = {
        name: "Custom Learning Path",
        persona: "Custom User",
        difficulty: "Custom",
        description: "Explore this specific sequence of connected concepts",
        useCase: "Custom exploration of selected concepts",
        contemporary_focus: true,
        estimatedTime: "Variable",
        nodes: nodeIds
    };
    
    // Store as current learning path with persona-based structure
    window.currentLearningPath = nodeIds;
    window.currentLearningPathKey = "custom_path";
    window.currentLearningPathInfo = customPath;
    
    // Highlight path on graph
    highlightLearningPath(nodeIds);
    
    // Close learning modal/paths
    closeLearningModal();
    
    // Show confirmation
    showPathSelectionConfirmation(customPath);
}

export function highlightAndShowNode(nodeId) {
    const node = window.graphData?.nodes.find(n => n.id === nodeId);
    if (node) {
        // Trigger hover effect to show node information
        const nodeSelection = window.nodeGroup?.filter(n => n.id === nodeId);
        if (nodeSelection) {
            nodeSelection.dispatch('mouseover', { bubbles: true });
        }
    }
}

export function showLearningPathOnGraph(pathNodes) {
    if (!pathNodes || pathNodes.length === 0) {
        console.warn('No learning path nodes provided');
        return;
    }
    
    // Get references to graph elements (these need to be available globally)
    const svg = window.svg;
    const node = window.node;
    const labels = window.labels;
    const link = window.link;
    
    if (!svg || !node || !labels || !link) {
        console.warn('Graph elements not available for highlighting learning path');
        return;
    }
    
    // Clear any existing highlights first
    svg.selectAll('circle').style('stroke', '#333').style('stroke-width', 2).style('filter', null);
    svg.selectAll('.path-indicator').remove();
    
    // Highlight the learning path with enhanced visibility
    highlightLearningPath(pathNodes);
    
    // Update node and link opacity to emphasize path
    const pathNodeSet = new Set(pathNodes);
    
    node.style("opacity", d => pathNodeSet.has(d.id) ? 1 : 0.3);
    labels.style("opacity", d => pathNodeSet.has(d.id) ? 1 : 0.3);
    
    // Highlight connections between path nodes
    link.style("opacity", l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        
        if (pathNodeSet.has(sourceId) && pathNodeSet.has(targetId)) {
            return 0.8; // Strong connection within path
        } else if (pathNodeSet.has(sourceId) || pathNodeSet.has(targetId)) {
            return 0.4; // Connection to path node
        } else {
            return 0.1; // Other connections dimmed
        }
    });
}