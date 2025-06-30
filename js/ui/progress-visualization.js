/**
 * Learning Path Progress Visualization System
 * Implements advanced progress indicators, visual step tracking, and dynamic path highlighting
 * Based on sophisticated progress visualization patterns for enhanced learning experience
 */

import { graphData } from '../data/graph-data.js';
import { applyLearningPathEffects } from './visual-effects.js';

// Progress visualization state
let currentProgressState = {
    pathNodes: [],
    currentStep: 0,
    completedSteps: new Set(),
    progressPercentage: 0,
    estimatedTimeRemaining: 0,
    startTime: null
};

// Progress visualization configuration
const progressConfig = {
    colors: {
        completed: '#22c55e',
        current: '#f4c64f',
        pending: 'rgba(255, 255, 255, 0.3)',
        path: '#2856A3'
    },
    animations: {
        duration: 600,
        stagger: 100,
        easing: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
    },
    indicators: {
        size: {
            small: 8,
            medium: 12,
            large: 16
        },
        glow: {
            radius: 6,
            intensity: 0.6
        }
    }
};

/**
 * Initialize progress visualization system
 */
export function initializeProgressVisualization() {
    addProgressStyles();
    console.log('✅ Progress visualization system initialized');
}

/**
 * Add sophisticated progress visualization styles
 */
function addProgressStyles() {
    if (document.getElementById('progress-visualization-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'progress-visualization-styles';
    style.textContent = `
        /* Progress visualization container */
        .progress-visualization {
            background: linear-gradient(135deg, rgba(40, 86, 163, 0.1) 0%, rgba(244, 198, 79, 0.1) 100%);
            border: 1px solid rgba(40, 86, 163, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin: 16px 0;
            position: relative;
            overflow: hidden;
        }
        
        .progress-visualization::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #f4c64f, transparent);
            animation: progressScan 3s infinite;
        }
        
        /* Progress header */
        .progress-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        
        .progress-title {
            color: #2856A3;
            font-weight: 700;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .progress-stats {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        /* Progress bar */
        .progress-bar-container {
            background: rgba(255, 255, 255, 0.1);
            height: 12px;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 20px;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #2856A3 0%, #f4c64f 50%, #22c55e 100%);
            border-radius: 6px;
            position: relative;
            transition: width ${progressConfig.animations.duration}ms ${progressConfig.animations.easing};
            box-shadow: 0 0 12px rgba(244, 198, 79, 0.4);
        }
        
        .progress-bar-fill::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 30px;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: progressGlow 2s infinite;
        }
        
        /* Step indicators */
        .step-indicators-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            position: relative;
        }
        
        .step-indicator {
            position: relative;
            width: ${progressConfig.indicators.size.medium}px;
            height: ${progressConfig.indicators.size.medium}px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.3);
            background: transparent;
            transition: all ${progressConfig.animations.duration}ms ${progressConfig.animations.easing};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: 700;
            color: transparent;
        }
        
        .step-indicator.completed {
            background: ${progressConfig.colors.completed};
            border-color: ${progressConfig.colors.completed};
            color: white;
            transform: scale(1.1);
            box-shadow: 0 0 ${progressConfig.indicators.glow.radius}px rgba(34, 197, 94, ${progressConfig.indicators.glow.intensity});
        }
        
        .step-indicator.current {
            background: ${progressConfig.colors.current};
            border-color: ${progressConfig.colors.current};
            color: #2c3e50;
            transform: scale(1.3);
            box-shadow: 0 0 ${progressConfig.indicators.glow.radius * 2}px rgba(244, 198, 79, ${progressConfig.indicators.glow.intensity});
            animation: currentStepPulse 2s infinite;
        }
        
        .step-indicator.pending {
            border-color: ${progressConfig.colors.pending};
            background: transparent;
        }
        
        .step-indicator:hover {
            transform: scale(1.2);
            border-width: 3px;
        }
        
        /* Connection lines between steps */
        .step-connection {
            position: absolute;
            height: 2px;
            background: rgba(255, 255, 255, 0.2);
            top: 50%;
            transform: translateY(-50%);
            z-index: -1;
            transition: background ${progressConfig.animations.duration}ms ease;
        }
        
        .step-connection.completed {
            background: linear-gradient(90deg, ${progressConfig.colors.completed}, ${progressConfig.colors.current});
        }
        
        /* Progress details */
        .progress-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 12px;
            margin-top: 16px;
        }
        
        .progress-detail-item {
            background: rgba(255, 255, 255, 0.05);
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .progress-detail-value {
            font-size: 1.2rem;
            font-weight: 700;
            color: #f4c64f;
            display: block;
        }
        
        .progress-detail-label {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.6);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Graph overlay indicators */
        .graph-step-indicator {
            position: absolute;
            width: 24px;
            height: 24px;
            background: ${progressConfig.colors.current};
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 700;
            color: #2c3e50;
            box-shadow: 0 4px 12px rgba(244, 198, 79, 0.4);
            z-index: 1000;
            pointer-events: none;
            animation: graphIndicatorFloat 3s ease-in-out infinite;
        }
        
        /* Animations */
        @keyframes progressScan {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: 100%; }
        }
        
        @keyframes progressGlow {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(0); }
        }
        
        @keyframes currentStepPulse {
            0%, 100% { 
                box-shadow: 0 0 ${progressConfig.indicators.glow.radius * 2}px rgba(244, 198, 79, ${progressConfig.indicators.glow.intensity});
            }
            50% { 
                box-shadow: 0 0 ${progressConfig.indicators.glow.radius * 3}px rgba(244, 198, 79, 1);
            }
        }
        
        @keyframes graphIndicatorFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .progress-visualization {
                padding: 16px;
                margin: 12px 0;
            }
            
            .progress-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }
            
            .step-indicator {
                width: ${progressConfig.indicators.size.small}px;
                height: ${progressConfig.indicators.size.small}px;
            }
            
            .progress-details {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .progress-bar-fill,
            .step-indicator,
            .step-connection {
                transition: none !important;
            }
            
            .progress-visualization::before,
            .progress-bar-fill::after,
            .currentStepPulse,
            .graphIndicatorFloat,
            .progressScan,
            .progressGlow {
                animation: none !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Create comprehensive progress visualization
 * @param {Array} pathNodes - Learning path node IDs
 * @param {number} currentStep - Current step index
 * @param {Object} pathInfo - Learning path information
 */
export function createProgressVisualization(pathNodes, currentStep, pathInfo) {
    currentProgressState = {
        pathNodes: pathNodes || [],
        currentStep: currentStep || 0,
        completedSteps: new Set(Array.from({length: currentStep}, (_, i) => i)),
        progressPercentage: Math.round(((currentStep + 1) / pathNodes.length) * 100),
        estimatedTimeRemaining: calculateEstimatedTime(pathNodes, currentStep, pathInfo),
        startTime: currentProgressState.startTime || Date.now()
    };
    
    const container = document.createElement('div');
    container.className = 'progress-visualization';
    container.innerHTML = generateProgressHTML(pathInfo);
    
    // Add interactivity
    addProgressInteractivity(container);
    
    // Animate in
    animateProgressIn(container);
    
    return container;
}

/**
 * Generate comprehensive progress HTML
 */
function generateProgressHTML(pathInfo) {
    const { pathNodes, currentStep, progressPercentage, estimatedTimeRemaining } = currentProgressState;
    const completedCount = currentProgressState.completedSteps.size;
    
    return `
        <div class="progress-header">
            <div class="progress-title">
                📈 Learning Progress
                <span style="
                    background: rgba(244, 198, 79, 0.2);
                    color: #f4c64f;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    margin-left: 8px;
                ">
                    ${pathInfo?.name || 'Custom Path'}
                </span>
            </div>
            <div class="progress-stats">
                <span>${progressPercentage}%</span>
                <span>•</span>
                <span>Step ${currentStep + 1}/${pathNodes.length}</span>
            </div>
        </div>
        
        <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${progressPercentage}%"></div>
        </div>
        
        <div class="step-indicators-container">
            ${generateStepIndicators()}
            ${generateConnectionLines()}
        </div>
        
        <div class="progress-details">
            <div class="progress-detail-item">
                <span class="progress-detail-value">${completedCount}</span>
                <span class="progress-detail-label">Completed</span>
            </div>
            <div class="progress-detail-item">
                <span class="progress-detail-value">${pathNodes.length - completedCount - 1}</span>
                <span class="progress-detail-label">Remaining</span>
            </div>
            <div class="progress-detail-item">
                <span class="progress-detail-value">${estimatedTimeRemaining}m</span>
                <span class="progress-detail-label">Est. Time</span>
            </div>
            <div class="progress-detail-item">
                <span class="progress-detail-value">${pathInfo?.difficulty || 'Varies'}</span>
                <span class="progress-detail-label">Difficulty</span>
            </div>
        </div>
    `;
}

/**
 * Generate step indicators with sophisticated styling
 */
function generateStepIndicators() {
    const { pathNodes, currentStep } = currentProgressState;
    
    return pathNodes.map((nodeId, index) => {
        let statusClass = 'pending';
        let content = '';
        
        if (index < currentStep) {
            statusClass = 'completed';
            content = '✓';
        } else if (index === currentStep) {
            statusClass = 'current';
            content = index + 1;
        } else {
            content = index + 1;
        }
        
        const node = graphData.nodes.find(n => n.id === nodeId);
        const nodeName = node ? node.name : nodeId;
        
        return `
            <div class="step-indicator ${statusClass}" 
                 data-step="${index}" 
                 data-node-id="${nodeId}"
                 title="${nodeName} (Step ${index + 1})"
                 style="animation-delay: ${index * progressConfig.animations.stagger}ms">
                ${content}
            </div>
        `;
    }).join('');
}

/**
 * Generate connection lines between step indicators
 */
function generateConnectionLines() {
    const { pathNodes, currentStep } = currentProgressState;
    const indicatorWidth = progressConfig.indicators.size.medium + 4; // including border
    const containerWidth = 100; // percentage
    const stepWidth = containerWidth / pathNodes.length;
    
    return pathNodes.slice(0, -1).map((_, index) => {
        const isCompleted = index < currentStep;
        const left = (index * stepWidth) + (stepWidth * 0.1);
        const width = stepWidth * 0.8;
        
        return `
            <div class="step-connection ${isCompleted ? 'completed' : ''}" 
                 style="
                     left: ${left}%;
                     width: ${width}%;
                 ">
            </div>
        `;
    }).join('');
}

/**
 * Add interactivity to progress visualization
 */
function addProgressInteractivity(container) {
    const stepIndicators = container.querySelectorAll('.step-indicator');
    
    stepIndicators.forEach(indicator => {
        indicator.addEventListener('click', handleStepClick);
        indicator.addEventListener('mouseenter', handleStepHover);
        indicator.addEventListener('mouseleave', handleStepLeave);
    });
}

/**
 * Handle step indicator click
 */
function handleStepClick(event) {
    const stepIndex = parseInt(event.target.dataset.step);
    const nodeId = event.target.dataset.nodeId;
    
    // Navigate to specific step
    updateProgressToStep(stepIndex);
    
    // Highlight node on graph
    if (window.highlightAndShowNode) {
        window.highlightAndShowNode(nodeId);
    }
    
    // Show step-specific notification
    showStepNavigationFeedback(stepIndex, nodeId);
}

/**
 * Handle step indicator hover
 */
function handleStepHover(event) {
    const nodeId = event.target.dataset.nodeId;
    const node = graphData.nodes.find(n => n.id === nodeId);
    
    if (node) {
        showStepPreview(event.target, node);
    }
}

/**
 * Handle step indicator leave
 */
function handleStepLeave(event) {
    hideStepPreview();
}

/**
 * Show step preview tooltip
 */
function showStepPreview(indicator, node) {
    const preview = document.createElement('div');
    preview.className = 'step-preview-tooltip';
    preview.style.cssText = `
        position: absolute;
        bottom: 120%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    
    preview.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 2px;">${node.name}</div>
        <div style="opacity: 0.8; font-size: 0.7rem;">${node.type}</div>
    `;
    
    indicator.style.position = 'relative';
    indicator.appendChild(preview);
    
    requestAnimationFrame(() => {
        preview.style.opacity = '1';
    });
}

/**
 * Hide step preview tooltip
 */
function hideStepPreview() {
    const tooltips = document.querySelectorAll('.step-preview-tooltip');
    tooltips.forEach(tooltip => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 200);
    });
}

/**
 * Update progress to specific step
 */
export function updateProgressToStep(stepIndex) {
    currentProgressState.currentStep = stepIndex;
    currentProgressState.completedSteps = new Set(Array.from({length: stepIndex}, (_, i) => i));
    currentProgressState.progressPercentage = Math.round(((stepIndex + 1) / currentProgressState.pathNodes.length) * 100);
    
    // Update visual indicators
    updateProgressVisuals();
    
    // Apply graph effects
    applyLearningPathEffects(currentProgressState.pathNodes);
}

/**
 * Update progress visuals
 */
function updateProgressVisuals() {
    const progressBar = document.querySelector('.progress-bar-fill');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const connections = document.querySelectorAll('.step-connection');
    
    if (progressBar) {
        progressBar.style.width = `${currentProgressState.progressPercentage}%`;
    }
    
    stepIndicators.forEach((indicator, index) => {
        indicator.className = 'step-indicator';
        
        if (index < currentProgressState.currentStep) {
            indicator.classList.add('completed');
            indicator.textContent = '✓';
        } else if (index === currentProgressState.currentStep) {
            indicator.classList.add('current');
            indicator.textContent = index + 1;
        } else {
            indicator.classList.add('pending');
            indicator.textContent = index + 1;
        }
    });
    
    connections.forEach((connection, index) => {
        if (index < currentProgressState.currentStep) {
            connection.classList.add('completed');
        } else {
            connection.classList.remove('completed');
        }
    });
}

/**
 * Animate progress visualization entrance
 */
function animateProgressIn(container) {
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
        container.style.transition = `all ${progressConfig.animations.duration}ms ${progressConfig.animations.easing}`;
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    });
}

/**
 * Calculate estimated time remaining
 */
function calculateEstimatedTime(pathNodes, currentStep, pathInfo) {
    const averageTimePerStep = pathInfo?.estimatedTime ? 
        (parseInt(pathInfo.estimatedTime) * 60) / pathNodes.length : 
        5; // 5 minutes default per step
    
    const remainingSteps = pathNodes.length - currentStep - 1;
    return Math.max(0, Math.round(remainingSteps * averageTimePerStep));
}

/**
 * Show step navigation feedback
 */
function showStepNavigationFeedback(stepIndex, nodeId) {
    // This would integrate with the notifications system
    console.log(`Navigated to step ${stepIndex + 1}: ${nodeId}`);
}

/**
 * Add step indicators to graph nodes
 * @param {Array} pathNodes - Learning path node IDs
 */
export function addGraphStepIndicators(pathNodes) {
    // Remove existing indicators
    document.querySelectorAll('.graph-step-indicator').forEach(el => el.remove());
    
    pathNodes.forEach((nodeId, index) => {
        const nodeElement = d3.select(`[data-node-id="${nodeId}"]`).node();
        if (nodeElement) {
            const indicator = document.createElement('div');
            indicator.className = 'graph-step-indicator';
            indicator.textContent = index + 1;
            indicator.style.animationDelay = `${index * 0.1}s`;
            
            const rect = nodeElement.getBoundingClientRect();
            indicator.style.left = `${rect.left + rect.width / 2 - 12}px`;
            indicator.style.top = `${rect.top - 30}px`;
            
            document.body.appendChild(indicator);
        }
    });
}

/**
 * Get current progress state
 */
export function getCurrentProgressState() {
    return { ...currentProgressState };
}

/**
 * Reset progress visualization
 */
export function resetProgressVisualization() {
    currentProgressState = {
        pathNodes: [],
        currentStep: 0,
        completedSteps: new Set(),
        progressPercentage: 0,
        estimatedTimeRemaining: 0,
        startTime: null
    };
    
    // Remove graph indicators
    document.querySelectorAll('.graph-step-indicator').forEach(el => el.remove());
}