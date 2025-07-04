/**
 * @fileoverview Tooltip Manager - Centralized tooltip handling
 * @author Islamic Knowledge Graph Team
 * @since 2025-01-XX
 * @version 1.0.0
 * 
 * Purpose: Manages all tooltips across the application to prevent conflicts
 * Dependencies: D3.js, Rich Content Manager
 * Exports: Tooltip management functions
 */

import { richContentManager } from './rich-content-manager.js';

/**
 * Centralized tooltip manager to prevent conflicts and ensure proper cleanup
 */
export class TooltipManager {
    constructor() {
        this.activeTooltips = new Map();
        this.tooltipCounter = 0;
    }

    /**
     * Create a relationship tooltip for link hover
     * @param {Object} linkData - The link data
     * @param {MouseEvent} event - The mouse event
     * @param {Object} graphData - Graph data for node lookup
     * @returns {string} Tooltip ID
     */
    createRelationshipTooltip(linkData, event, graphData) {
        // Remove any existing relationship tooltips
        this.removeTooltipsByClass('relationship-tooltip');
        
        const sourceNode = typeof linkData.source === 'object' ? linkData.source : graphData.nodes.find(n => n.id === linkData.source);
        const targetNode = typeof linkData.target === 'object' ? linkData.target : graphData.nodes.find(n => n.id === linkData.target);
        
        if (!sourceNode || !targetNode) {
            console.warn('Could not find source or target node for relationship tooltip');
            return null;
        }
        
        const tooltipId = `relationship-tooltip-${++this.tooltipCounter}`;
        
        // Build enhanced tooltip content
        let tooltipContent = `<div style="font-weight: 600; margin-bottom: 4px;">${sourceNode.name} ${linkData.type} ${targetNode.name}</div>`;
        
        // Add context description if available
        if (linkData.contextDescription) {
            tooltipContent += `<div style="margin-bottom: 4px; font-size: 0.9rem;">${linkData.contextDescription}</div>`;
        }
        
        // Add textual source if available
        if (linkData.textualSource) {
            tooltipContent += `<div style="font-size: 0.8rem; font-style: italic; opacity: 0.9;">Source: ${linkData.textualSource}</div>`;
        }
        
        const tooltip = d3.select("body").append("div")
            .attr("class", "relationship-tooltip")
            .attr("id", tooltipId)
            .style("position", "absolute")
            .style("background", "rgba(40, 86, 163, 0.95)")
            .style("color", "white")
            .style("padding", "10px 12px")
            .style("border-radius", "6px")
            .style("font-size", "0.85rem")
            .style("box-shadow", "0 2px 8px rgba(0,0,0,0.3)")
            .style("z-index", "1000")
            .style("max-width", "280px")
            .style("line-height", "1.3")
            .style("pointer-events", "none")
            .html(tooltipContent)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .style("opacity", 0);

        // Animate in
        tooltip.transition()
            .duration(200)
            .style("opacity", 1);

        // Store reference
        this.activeTooltips.set(tooltipId, {
            element: tooltip,
            type: 'relationship',
            created: Date.now()
        });

        return tooltipId;
    }

    /**
     * Update tooltip position during mousemove
     * @param {string} tooltipId - The tooltip ID
     * @param {MouseEvent} event - The mouse event
     */
    updateTooltipPosition(tooltipId, event) {
        const tooltipData = this.activeTooltips.get(tooltipId);
        if (tooltipData && tooltipData.element) {
            tooltipData.element
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        }
    }

    /**
     * Remove a specific tooltip
     * @param {string} tooltipId - The tooltip ID to remove
     * @param {number} duration - Animation duration in ms
     */
    removeTooltip(tooltipId, duration = 150) {
        const tooltipData = this.activeTooltips.get(tooltipId);
        if (tooltipData && tooltipData.element) {
            tooltipData.element
                .transition()
                .duration(duration)
                .style("opacity", 0)
                .on("end", () => {
                    tooltipData.element.remove();
                    this.activeTooltips.delete(tooltipId);
                });
        }
    }

    /**
     * Create enhanced node tooltip with rich content
     * @param {Object} nodeData - The node data
     * @param {MouseEvent} event - The mouse event
     * @returns {string} Tooltip ID
     */
    createEnhancedNodeTooltip(nodeData, event) {
        // Remove any existing node tooltips
        this.removeTooltipsByClass('node-tooltip');
        
        const tooltipId = `node-tooltip-${++this.tooltipCounter}`;
        
        // Generate enhanced tooltip content
        const tooltipContent = richContentManager.generateEnhancedTooltip(nodeData);
        
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip node-tooltip")
            .attr("id", tooltipId)
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "linear-gradient(135deg, rgba(40, 86, 163, 0.95) 0%, rgba(125, 179, 211, 0.95) 100%)")
            .style("color", "white")
            .style("padding", "12px 16px")
            .style("border-radius", "8px")
            .style("border", "1px solid rgba(244, 198, 79, 0.3)")
            .style("font-size", "0.85rem")
            .style("max-width", "350px")
            .style("line-height", "1.4")
            .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.3)")
            .style("z-index", "9999")
            .style("opacity", "0")
            .html(tooltipContent);

        // Position and show tooltip
        tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .style("visibility", "visible")
            .transition()
            .duration(200)
            .style("opacity", "1");

        // Track this tooltip
        this.activeTooltips.set(tooltipId, {
            element: tooltip,
            type: 'node',
            nodeId: nodeData.id
        });

        return tooltipId;
    }

    /**
     * Remove all tooltips of a specific class
     * @param {string} className - The class name to remove
     */
    removeTooltipsByClass(className) {
        // Remove from D3 selection
        d3.selectAll(`.${className}`)
            .transition()
            .duration(150)
            .style("opacity", 0)
            .on("end", function() {
                d3.select(this).remove();
            });

        // Clean up from our tracking
        const toRemove = [];
        for (const [id, data] of this.activeTooltips) {
            if (data.element.node()?.classList.contains(className)) {
                toRemove.push(id);
            }
        }
        toRemove.forEach(id => this.activeTooltips.delete(id));
    }

    /**
     * Remove all tooltips
     */
    removeAllTooltips() {
        for (const [id, data] of this.activeTooltips) {
            if (data.element) {
                data.element.remove();
            }
        }
        this.activeTooltips.clear();
        
        // Safety cleanup for any orphaned tooltips
        d3.selectAll('.relationship-tooltip, .node-tooltip').remove();
    }

    /**
     * Clean up old tooltips (older than specified time)
     * @param {number} maxAge - Maximum age in milliseconds
     */
    cleanupOldTooltips(maxAge = 5000) {
        const now = Date.now();
        const toRemove = [];
        
        for (const [id, data] of this.activeTooltips) {
            if (now - data.created > maxAge) {
                toRemove.push(id);
            }
        }
        
        toRemove.forEach(id => this.removeTooltip(id, 0));
    }

    /**
     * Get count of active tooltips
     * @returns {number} Number of active tooltips
     */
    getActiveTooltipCount() {
        return this.activeTooltips.size;
    }
}

// Export singleton instance
export const tooltipManager = new TooltipManager();

// Auto-cleanup old tooltips every 10 seconds
setInterval(() => {
    tooltipManager.cleanupOldTooltips();
}, 10000);