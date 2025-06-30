/**
 * @fileoverview Shared Graph Utilities
 * @author Islamic Knowledge Graph Team  
 * @since 2025-01-XX
 * @version 1.0.0
 * 
 * Purpose: Consolidates duplicate functions used across multiple modules
 * Dependencies: D3.js, graph-data.js
 * Exports: Node utilities, viewport centering, content generation
 * 
 * Usage:
 * import { centerNodeInView, getNodeName } from './utils/graph-utils.js';
 */

import { graphData } from '../data/graph-data.js';

/**
 * Get node name by ID with fallback
 * @param {string} nodeId - The ID of the node to get the name for
 * @returns {string} The node name or the ID if not found
 * @example
 * const name = getNodeName('imam_ali'); // Returns "Imam Ali"
 */
export function getNodeName(nodeId) {
    const node = graphData.nodes.find(n => n.id === nodeId);
    return node ? node.name : nodeId;
}

/**
 * Center a single node in the viewport with intelligent scaling
 * @param {Object} targetNode - The node to center (must have x, y properties)
 * @param {number|null} customScale - Optional custom zoom scale
 * @param {Object} deps - Dependencies object containing { width, height, simulation, zoom, svg }
 * @throws {Error} When dependencies are missing
 * @example
 * centerNodeInView(nodeData, 1.5, { width, height, simulation, zoom, svg });
 */
export function centerNodeInView(targetNode, customScale = null, deps = {}) {
    const { width, height, simulation, zoom, svg } = deps;
    
    if (!width || !height || !zoom || !svg) {
        throw new Error('centerNodeInView requires width, height, zoom, and svg dependencies');
    }
    
    // Wait for node positions to stabilize if simulation is active
    if (simulation && simulation.alpha() > 0.1) {
        setTimeout(() => centerNodeInView(targetNode, customScale, deps), 100);
        return;
    }
    
    // Calculate connections for intelligent zoom scaling
    const connections = graphData.links.filter(l => 
        (typeof l.source === 'object' ? l.source.id : l.source) === targetNode.id ||
        (typeof l.target === 'object' ? l.target.id : l.target) === targetNode.id
    ).length;
    
    // Determine optimal scale based on context
    let scale = customScale;
    if (!scale) {
        if (connections > 10) scale = 0.9;
        else if (connections > 6) scale = 1.2;
        else if (connections > 3) scale = 1.5;
        else scale = 1.8;
    }
    
    // Create smooth centering transform
    const transform = d3.zoomIdentity
        .translate(width/2, height/2)
        .scale(scale)
        .translate(-targetNode.x, -targetNode.y);
    
    // Apply with smooth transition
    svg.transition()
        .duration(800)
        .ease(d3.easeCubicInOut)
        .call(zoom.transform, transform);
}

/**
 * Center multiple nodes in viewport with optimal framing
 * @param {Array} nodes - Array of nodes to center (each must have x, y properties)
 * @param {Object} deps - Dependencies object containing { width, height, simulation, zoom, svg }
 * @throws {Error} When dependencies are missing or nodes array is empty
 * @example
 * centerOnNodeGroup([node1, node2, node3], { width, height, simulation, zoom, svg });
 */
export function centerOnNodeGroup(nodes, deps = {}) {
    const { width, height, simulation, zoom, svg } = deps;
    
    if (!Array.isArray(nodes) || nodes.length === 0) {
        throw new Error('centerOnNodeGroup requires a non-empty array of nodes');
    }
    
    if (!width || !height || !zoom || !svg) {
        throw new Error('centerOnNodeGroup requires width, height, zoom, and svg dependencies');
    }
    
    // Single node fallback
    if (nodes.length === 1) {
        centerNodeInView(nodes[0], null, deps);
        return;
    }
    
    // Wait for stability
    if (simulation && simulation.alpha() > 0.1) {
        setTimeout(() => centerOnNodeGroup(nodes, deps), 100);
        return;
    }
    
    // Calculate bounding box
    const bounds = {
        minX: Math.min(...nodes.map(n => n.x)),
        maxX: Math.max(...nodes.map(n => n.x)),
        minY: Math.min(...nodes.map(n => n.y)),
        maxY: Math.max(...nodes.map(n => n.y))
    };
    
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    const boundWidth = bounds.maxX - bounds.minX + 100;
    const boundHeight = bounds.maxY - bounds.minY + 100;
    
    const scaleX = width * 0.8 / boundWidth;
    const scaleY = height * 0.8 / boundHeight;
    const scale = Math.min(scaleX, scaleY, 2.0);
    
    const transform = d3.zoomIdentity
        .translate(width/2, height/2)
        .scale(scale)
        .translate(-centerX, -centerY);
    
    svg.transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .call(zoom.transform, transform);
}

/**
 * Generate context-aware learning guidance based on node type
 * @param {Object} nodeData - The node data object with type and name properties
 * @returns {string} HTML-formatted learning guidance
 * @example
 * const guidance = generateLearningGuidance({ type: 'scholar', name: 'Imam Ali' });
 */
export function generateLearningGuidance(nodeData) {
    const guidanceMap = {
        scholar: `Study the historical context and major contributions of ${nodeData.name}. Explore their key works and teaching methodology.`,
        book: `Read key passages and understand the compilation/composition context. Consider its influence on later scholarship.`,
        theology: `Understand the doctrinal foundations and how this concept relates to other theological principles.`,
        jurisprudence: `Learn the methodological principles and practical applications in contemporary Islamic law.`,
        practice: `Study the spiritual significance, requirements, and proper implementation of this practice.`,
        verse: `Memorize the Arabic text, understand the context of revelation, and study classical commentaries.`,
        concept: `Explore the historical development and contemporary applications of this concept.`,
        contemporary: `Examine how traditional Islamic principles apply to modern challenges and circumstances.`
    };
    
    return guidanceMap[nodeData.type] || `Explore the connections and significance of ${nodeData.name} in Islamic scholarship.`;
}

// Removed getRelationshipExplanation function - tooltips now use simplified relationship types

/**
 * Highlight node and programmatically show information
 * @param {string} nodeId - The ID of the node to highlight and show
 * @throws {Error} When node is not found
 * @example
 * highlightAndShowNode('imam_ali');
 */
export function highlightAndShowNode(nodeId) {
    const targetNode = graphData.nodes.find(n => n.id === nodeId);
    if (!targetNode) {
        throw new Error(`Node with ID '${nodeId}' not found`);
    }
    
    // Find the DOM element for this node
    const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (nodeElement) {
        // Dispatch mouseover event to trigger existing handlers
        const mouseOverEvent = new MouseEvent('mouseover', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        nodeElement.dispatchEvent(mouseOverEvent);
    }
    
    console.log(`Highlighted and showed node: ${targetNode.name}`);
}