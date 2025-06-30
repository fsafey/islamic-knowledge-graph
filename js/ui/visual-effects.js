/**
 * Advanced Visual Effects System
 * Implements sophisticated node highlighting, glow effects, and scale-dependent visuals
 * Based on monolithic advanced visual patterns for enhanced user experience
 */

import { tooltipManager } from '../utils/tooltip-manager.js';

// Visual effects state management
let currentScale = 1;
let highlightedNodes = new Set();
let glowEffectsEnabled = true;
let performanceMode = false;

/**
 * Node type specific visual configurations
 */
const nodeVisualConfig = {
    'scholar': {
        baseColor: '#2856A3',
        glowColor: 'rgba(40, 86, 163, 0.6)',
        highlightColor: '#1e4080',
        shadowIntensity: 0.8,
        scaleMultiplier: 1.2
    },
    'book': {
        baseColor: '#7db3d3',
        glowColor: 'rgba(125, 179, 211, 0.6)',
        highlightColor: '#5a9bc4',
        shadowIntensity: 0.7,
        scaleMultiplier: 1.15
    },
    'concept': {
        baseColor: '#f4c64f',
        glowColor: 'rgba(244, 198, 79, 0.6)',
        highlightColor: '#e6b83c',
        shadowIntensity: 0.9,
        scaleMultiplier: 1.25
    },
    'practice': {
        baseColor: '#5a9b97',
        glowColor: 'rgba(90, 155, 151, 0.6)',
        highlightColor: '#4a8480',
        shadowIntensity: 0.6,
        scaleMultiplier: 1.1
    },
    'verse': {
        baseColor: '#d4a574',
        glowColor: 'rgba(212, 165, 116, 0.7)',
        highlightColor: '#c49660',
        shadowIntensity: 1.0,
        scaleMultiplier: 1.3
    },
    'jurisprudence': {
        baseColor: '#8b7355',
        glowColor: 'rgba(139, 115, 85, 0.6)',
        highlightColor: '#7a6347',
        shadowIntensity: 0.7,
        scaleMultiplier: 1.15
    },
    'theology': {
        baseColor: '#8b5a96',
        glowColor: 'rgba(139, 90, 150, 0.6)',
        highlightColor: '#7a4e84',
        shadowIntensity: 0.8,
        scaleMultiplier: 1.2
    }
};

/**
 * Apply enhanced visual effects to a node
 * @param {d3.Selection} nodeSelection - D3 selection of the node
 * @param {Object} nodeData - Node data object
 * @param {string} effectType - Type of effect ('hover', 'highlight', 'focus', 'learning-path')
 */
export function applyNodeVisualEffects(nodeSelection, nodeData, effectType = 'hover') {
    if (!nodeSelection || !nodeData) return;
    
    const config = nodeVisualConfig[nodeData.type] || nodeVisualConfig['concept'];
    const effectIntensity = getEffectIntensity(effectType);
    
    // Apply effects based on current scale and performance mode
    if (currentScale < 0.3 && performanceMode) {
        // Minimal effects for very zoomed out view
        applyMinimalEffects(nodeSelection, config, effectIntensity);
    } else if (currentScale < 0.7) {
        // Reduced effects for medium zoom
        applyReducedEffects(nodeSelection, config, effectIntensity, effectType);
    } else {
        // Full effects for close zoom
        applyFullEffects(nodeSelection, config, effectIntensity, effectType);
    }
    
    // Track highlighted nodes
    if (effectType === 'highlight' || effectType === 'learning-path') {
        highlightedNodes.add(nodeData.id);
    }
}

/**
 * Get effect intensity multiplier based on effect type
 */
function getEffectIntensity(effectType) {
    const intensities = {
        'hover': 1.0,
        'highlight': 1.2,
        'focus': 1.5,
        'learning-path': 1.3,
        'search-match': 1.4
    };
    return intensities[effectType] || 1.0;
}

/**
 * Apply minimal effects for performance optimization
 */
function applyMinimalEffects(nodeSelection, config, intensity) {
    nodeSelection
        .style('stroke', config.highlightColor)
        .style('stroke-width', Math.max(2, 3 * intensity))
        .style('opacity', Math.min(1, 0.8 + (0.2 * intensity)));
}

/**
 * Apply reduced effects for medium zoom levels
 */
function applyReducedEffects(nodeSelection, config, intensity, effectType) {
    const glowIntensity = intensity * 0.7;
    
    nodeSelection
        .style('stroke', config.highlightColor)
        .style('stroke-width', Math.max(2, 4 * intensity))
        .style('opacity', 1)
        .style('filter', glowEffectsEnabled ? 
            `drop-shadow(0 0 ${8 * glowIntensity}px ${config.glowColor})` : 
            'none'
        );
    
    // Add subtle scale animation for focus effects
    if (effectType === 'focus' || effectType === 'learning-path') {
        nodeSelection
            .transition()
            .duration(200)
            .attr('r', d => (d.baseRadius || 8) * config.scaleMultiplier * intensity);
    }
}

/**
 * Apply full effects for close zoom levels
 */
function applyFullEffects(nodeSelection, config, intensity, effectType) {
    const glowRadius = Math.min(20, 12 * intensity);
    const shadowOffset = Math.min(8, 4 * intensity);
    
    // Enhanced glow effect with multiple shadows
    const complexFilter = glowEffectsEnabled ? 
        `drop-shadow(0 0 ${glowRadius}px ${config.glowColor}) 
         drop-shadow(0 ${shadowOffset}px ${shadowOffset * 2}px rgba(0,0,0,0.3))
         drop-shadow(0 0 ${glowRadius * 0.5}px ${config.glowColor})` : 
        `drop-shadow(0 ${shadowOffset}px ${shadowOffset * 2}px rgba(0,0,0,0.2))`;
    
    nodeSelection
        .style('stroke', config.highlightColor)
        .style('stroke-width', Math.max(3, 5 * intensity))
        .style('opacity', 1)
        .style('filter', complexFilter);
    
    // Enhanced scale and animation effects
    if (effectType === 'focus' || effectType === 'learning-path') {
        nodeSelection
            .transition()
            .duration(300)
            .attr('r', d => (d.baseRadius || 8) * config.scaleMultiplier * intensity)
            .style('stroke-width', Math.max(4, 6 * intensity));
        
        // Add pulsing effect for learning path nodes
        if (effectType === 'learning-path') {
            addPulsingEffect(nodeSelection, config, intensity);
        }
    }
    
    // Enhanced hover effects with particle-like animation
    if (effectType === 'hover') {
        addHoverParticleEffect(nodeSelection, config);
    }
}

/**
 * Add pulsing effect for learning path nodes
 */
function addPulsingEffect(nodeSelection, config, intensity) {
    const pulseId = `pulse_${Date.now()}`;
    
    // Create pulsing animation
    const pulseTransition = nodeSelection
        .transition(pulseId)
        .duration(1500)
        .ease(d3.easeSinInOut)
        .style('opacity', 0.7)
        .transition()
        .duration(1500)
        .ease(d3.easeSinInOut)
        .style('opacity', 1);
    
    // Repeat pulsing 3 times
    pulseTransition.on('end', function() {
        d3.select(this)
            .transition()
            .delay(500)
            .duration(0)
            .style('opacity', 1);
    });
}

/**
 * Add particle-like hover effect
 */
function addHoverParticleEffect(nodeSelection, config) {
    // Only add particle effect if performance allows
    if (performanceMode || currentScale < 0.5) return;
    
    const node = nodeSelection.node();
    if (!node) return;
    
    const rect = node.getBoundingClientRect();
    const particles = createHoverParticles(rect, config);
    
    // Animate particles
    particles.forEach((particle, index) => {
        setTimeout(() => {
            animateParticle(particle);
        }, index * 50);
    });
}

/**
 * Create hover particles around node
 */
function createHoverParticles(rect, config) {
    const particles = [];
    const particleCount = 4;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${config.baseColor};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            opacity: 0.8;
            transition: all 0.8s ease-out;
        `;
        
        document.body.appendChild(particle);
        particles.push(particle);
    }
    
    return particles;
}

/**
 * Animate individual particle
 */
function animateParticle(particle) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    requestAnimationFrame(() => {
        particle.style.transform = `translate(${x}px, ${y}px)`;
        particle.style.opacity = '0';
    });
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 800);
}

/**
 * Remove all visual effects from a node
 */
export function removeNodeVisualEffects(nodeSelection, nodeData) {
    if (!nodeSelection) return;
    
    nodeSelection
        .style('stroke', '#333')
        .style('stroke-width', 2)
        .style('opacity', 1)
        .style('filter', 'none')
        .transition()
        .duration(200)
        .attr('r', d => d.baseRadius || 8);
    
    if (nodeData) {
        highlightedNodes.delete(nodeData.id);
    }
}

/**
 * Update scale-dependent effects
 */
export function updateScaleEffects(newScale) {
    currentScale = newScale;
    
    // Enable performance mode for very small scales
    performanceMode = newScale < 0.2;
    
    // Disable glow effects for performance at small scales
    glowEffectsEnabled = newScale > 0.3 && !performanceMode;
    
    // Update existing highlighted nodes
    if (highlightedNodes.size > 0) {
        const svg = d3.select('svg');
        highlightedNodes.forEach(nodeId => {
            const nodeSelection = svg.selectAll('circle').filter(d => d.id === nodeId);
            const nodeData = nodeSelection.datum();
            if (nodeData) {
                applyNodeVisualEffects(nodeSelection, nodeData, 'highlight');
            }
        });
    }
}

/**
 * Apply learning path visual effects to multiple nodes
 */
export function applyLearningPathEffects(pathNodes) {
    if (!pathNodes || !Array.isArray(pathNodes)) return;
    
    const svg = d3.select('svg');
    
    // Clear existing effects
    clearAllEffects();
    
    // Apply learning path effects with sequence numbers
    pathNodes.forEach((nodeId, index) => {
        const nodeSelection = svg.selectAll('circle').filter(d => d.id === nodeId);
        const nodeData = nodeSelection.datum();
        
        if (nodeData) {
            applyNodeVisualEffects(nodeSelection, nodeData, 'learning-path');
            addSequenceIndicator(nodeSelection, index + 1);
        }
    });
}

/**
 * Add sequence indicator for learning path
 */
function addSequenceIndicator(nodeSelection, sequenceNumber) {
    const node = nodeSelection.node();
    if (!node) return;
    
    const parentGroup = d3.select(node.parentNode);
    
    // Remove existing indicator
    parentGroup.select('.sequence-indicator').remove();
    
    // Add new sequence indicator
    parentGroup.append('text')
        .attr('class', 'sequence-indicator')
        .attr('x', 0)
        .attr('y', -25)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '700')
        .style('fill', '#f4c64f')
        .style('stroke', '#2c3e50')
        .style('stroke-width', '0.5px')
        .style('opacity', 0)
        .text(sequenceNumber)
        .transition()
        .duration(300)
        .delay(sequenceNumber * 100)
        .style('opacity', 1);
}

/**
 * Clear all visual effects
 */
export function clearAllEffects() {
    const svg = d3.select('svg');
    
    // Reset all nodes
    svg.selectAll('circle')
        .style('stroke', '#333')
        .style('stroke-width', 2)
        .style('opacity', 1)
        .style('filter', 'none')
        .transition()
        .duration(200)
        .attr('r', d => d.baseRadius || 8);
    
    // Remove sequence indicators
    svg.selectAll('.sequence-indicator').remove();
    
    // Clear tracking sets
    highlightedNodes.clear();
}

/**
 * Toggle performance mode
 */
export function togglePerformanceMode(enabled) {
    performanceMode = enabled;
    glowEffectsEnabled = !enabled && currentScale > 0.3;
    
    // Reapply effects to highlighted nodes
    updateScaleEffects(currentScale);
}

/**
 * Initialize visual effects system
 */
export function initializeVisualEffects() {
    console.log('✅ Advanced visual effects system initialized');
    
    // Monitor zoom changes
    if (window.zoom) {
        window.zoom.on('zoom', function(event) {
            updateScaleEffects(event.transform.k);
        });
    }
}

// Export configuration for external access
export { nodeVisualConfig };