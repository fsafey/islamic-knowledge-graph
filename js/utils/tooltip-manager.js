/**
 * @fileoverview Tooltip Manager - Centralized tooltip handling
 * @author Islamic Knowledge Graph Team
 * @since 2025-01-XX
 * @version 1.0.0
 * 
 * Purpose: Manages all tooltips across the application to prevent conflicts
 * Dependencies: D3.js
 * Exports: Tooltip management functions
 */

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
        
        const tooltip = d3.select("body").append("div")
            .attr("class", "relationship-tooltip")
            .attr("id", tooltipId)
            .style("position", "absolute")
            .style("background", "rgba(40, 86, 163, 0.95)")
            .style("color", "white")
            .style("padding", "8px 12px")
            .style("border-radius", "6px")
            .style("font-size", "0.85rem")
            .style("box-shadow", "0 2px 8px rgba(0,0,0,0.3)")
            .style("z-index", "1000")
            .style("white-space", "nowrap")
            .style("pointer-events", "none")
            .html(`<strong>${linkData.type}</strong>`)
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