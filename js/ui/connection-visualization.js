/**
 * Sophisticated Connection Visualization System
 * Implements dynamic connection information display, relationship previews, and enhanced link styling
 * Based on monolithic connection analysis patterns for rich relationship visualization
 */

import { graphData } from '../data/graph-data.js';
// Removed getRelationshipExplanation import - using simplified tooltips

// Connection visualization state
let connectionCache = new Map();
let activeConnectionPreview = null;
let relationshipColors = new Map();

/**
 * Relationship type configurations with sophisticated styling
 */
const relationshipConfig = {
    'authored': {
        color: '#2856A3',
        strokePattern: 'solid',
        opacity: 0.8,
        icon: '✍️',
        description: 'Literary contribution or authorship',
        priority: 1
    },
    'taught': {
        color: '#f4c64f',
        strokePattern: 'dashed',
        opacity: 0.7,
        icon: '🎓',
        description: 'Educational relationship or mentorship',
        priority: 2
    },
    'interpreted': {
        color: '#7db3d3',
        strokePattern: 'dotted',
        opacity: 0.6,
        icon: '📖',
        description: 'Scholarly interpretation or commentary',
        priority: 3
    },
    'influenced': {
        color: '#8b5a96',
        strokePattern: 'solid',
        opacity: 0.5,
        icon: '🌟',
        description: 'Intellectual or spiritual influence',
        priority: 4
    },
    'practiced': {
        color: '#5a9b97',
        strokePattern: 'dashed',
        opacity: 0.6,
        icon: '🤲',
        description: 'Ritual or practical application',
        priority: 5
    },
    'founded': {
        color: '#d4a574',
        strokePattern: 'solid',
        opacity: 0.8,
        icon: '🏛️',
        description: 'Institutional or organizational establishment',
        priority: 1
    },
    'contemporary': {
        color: '#2e8b57',
        strokePattern: 'solid',
        opacity: 0.7,
        icon: '🔄',
        description: 'Modern application or contemporary relevance',
        priority: 3
    }
};

/**
 * Initialize connection visualization system
 */
export function initializeConnectionVisualization() {
    buildConnectionCache();
    initializeRelationshipColors();
    console.log('✅ Connection visualization system initialized');
}

/**
 * Build comprehensive connection cache for O(1) lookup performance
 */
function buildConnectionCache() {
    connectionCache.clear();
    
    graphData.nodes.forEach(node => {
        const connections = {
            incoming: [],
            outgoing: [],
            bidirectional: [],
            relationshipTypes: new Set(),
            totalConnections: 0
        };
        
        graphData.links.forEach(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            
            if (sourceId === node.id) {
                connections.outgoing.push({
                    targetId,
                    relationship: link.relationship,
                    target: graphData.nodes.find(n => n.id === targetId)
                });
                connections.relationshipTypes.add(link.relationship);
            }
            
            if (targetId === node.id) {
                connections.incoming.push({
                    sourceId,
                    relationship: link.relationship,
                    source: graphData.nodes.find(n => n.id === sourceId)
                });
                connections.relationshipTypes.add(link.relationship);
            }
        });
        
        connections.totalConnections = connections.incoming.length + connections.outgoing.length;
        connectionCache.set(node.id, connections);
    });
}

/**
 * Initialize relationship colors for consistent visualization
 */
function initializeRelationshipColors() {
    relationshipColors.clear();
    Object.keys(relationshipConfig).forEach(type => {
        relationshipColors.set(type, relationshipConfig[type].color);
    });
}

/**
 * Show sophisticated connection preview for a node
 * @param {Object} nodeData - Node data object
 * @param {number} mouseX - Mouse X position
 * @param {number} mouseY - Mouse Y position
 */
export function showConnectionPreview(nodeData, mouseX, mouseY) {
    if (!nodeData || activeConnectionPreview) return;
    
    const connections = connectionCache.get(nodeData.id);
    if (!connections || connections.totalConnections === 0) return;
    
    const preview = createConnectionPreviewElement(nodeData, connections, mouseX, mouseY);
    document.body.appendChild(preview);
    activeConnectionPreview = preview;
    
    // Animate in
    requestAnimationFrame(() => {
        preview.style.opacity = '1';
        preview.style.transform = 'scale(1)';
    });
    
    // Auto-hide after delay
    setTimeout(() => {
        hideConnectionPreview();
    }, 3000);
}

/**
 * Create sophisticated connection preview element
 */
function createConnectionPreviewElement(nodeData, connections, mouseX, mouseY) {
    const preview = document.createElement('div');
    preview.className = 'connection-preview';
    
    // Position calculation to avoid screen edges
    const x = mouseX + 20 > window.innerWidth - 350 ? mouseX - 370 : mouseX + 20;
    const y = mouseY + 20 > window.innerHeight - 200 ? mouseY - 220 : mouseY + 20;
    
    preview.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        max-width: 350px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
        border: 1px solid rgba(40, 86, 163, 0.2);
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-family: Georgia, serif;
        opacity: 0;
        transform: scale(0.9);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.320, 1.275);
        backdrop-filter: blur(10px);
    `;
    
    // Generate preview content
    const relationshipTypes = Array.from(connections.relationshipTypes)
        .sort((a, b) => (relationshipConfig[a]?.priority || 10) - (relationshipConfig[b]?.priority || 10))
        .slice(0, 3); // Show top 3 relationship types
    
    preview.innerHTML = `
        <div style="border-bottom: 1px solid rgba(40, 86, 163, 0.1); padding-bottom: 12px; margin-bottom: 12px;">
            <div style="color: #2856A3; font-weight: 700; font-size: 0.95rem; margin-bottom: 4px;">
                🔗 ${nodeData.name} Connections
            </div>
            <div style="color: #666; font-size: 0.85rem;">
                ${connections.totalConnections} total connections
            </div>
        </div>
        
        <div style="margin-bottom: 12px;">
            <div style="color: #4a5568; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px;">
                Primary Relationships:
            </div>
            ${relationshipTypes.map(type => {
                const config = relationshipConfig[type] || {};
                const count = [...connections.incoming, ...connections.outgoing]
                    .filter(conn => conn.relationship === type).length;
                
                return `
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span style="font-size: 1rem;">${config.icon || '🔗'}</span>
                        <span style="color: ${config.color}; font-weight: 600; font-size: 0.85rem;">
                            ${type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                        <span style="color: #666; font-size: 0.8rem;">(${count})</span>
                    </div>
                `;
            }).join('')}
        </div>
        
        ${generateConnectionExamples(connections, nodeData)}
        
        <div style="border-top: 1px solid rgba(40, 86, 163, 0.1); padding-top: 12px; margin-top: 12px;">
            <div style="color: #7db3d3; font-size: 0.8rem; text-align: center;">
                Click node to explore detailed connections
            </div>
        </div>
    `;
    
    return preview;
}

/**
 * Generate connection examples for preview
 */
function generateConnectionExamples(connections, nodeData) {
    const examples = [];
    
    // Most significant outgoing connections
    const significantOutgoing = connections.outgoing
        .sort((a, b) => (relationshipConfig[a.relationship]?.priority || 10) - (relationshipConfig[b.relationship]?.priority || 10))
        .slice(0, 2);
    
    // Most significant incoming connections
    const significantIncoming = connections.incoming
        .sort((a, b) => (relationshipConfig[a.relationship]?.priority || 10) - (relationshipConfig[b.relationship]?.priority || 10))
        .slice(0, 2);
    
    if (significantOutgoing.length > 0 || significantIncoming.length > 0) {
        examples.push(`
            <div style="margin-bottom: 12px;">
                <div style="color: #4a5568; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px;">
                    Key Connections:
                </div>
                ${significantOutgoing.map(conn => `
                    <div style="font-size: 0.8rem; color: #555; margin-bottom: 4px; line-height: 1.3;">
                        → <strong style="color: ${relationshipConfig[conn.relationship]?.color || '#666'};">${conn.target?.name || conn.targetId}</strong>
                        <span style="color: #888; font-style: italic;">(${conn.relationship})</span>
                    </div>
                `).join('')}
                ${significantIncoming.map(conn => `
                    <div style="font-size: 0.8rem; color: #555; margin-bottom: 4px; line-height: 1.3;">
                        ← <strong style="color: ${relationshipConfig[conn.relationship]?.color || '#666'};">${conn.source?.name || conn.sourceId}</strong>
                        <span style="color: #888; font-style: italic;">(${conn.relationship})</span>
                    </div>
                `).join('')}
            </div>
        `);
    }
    
    return examples.join('');
}

/**
 * Hide connection preview
 */
export function hideConnectionPreview() {
    if (activeConnectionPreview) {
        activeConnectionPreview.style.opacity = '0';
        activeConnectionPreview.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            if (activeConnectionPreview && activeConnectionPreview.parentNode) {
                activeConnectionPreview.parentNode.removeChild(activeConnectionPreview);
            }
            activeConnectionPreview = null;
        }, 300);
    }
}

/**
 * Apply sophisticated link styling based on relationship types
 * @param {d3.Selection} linkSelection - D3 selection of links
 */
export function applySophisticatedLinkStyling(linkSelection) {
    if (!linkSelection) return;
    
    linkSelection
        .style('stroke', d => {
            const config = relationshipConfig[d.relationship];
            return config ? config.color : '#999';
        })
        .style('stroke-opacity', d => {
            const config = relationshipConfig[d.relationship];
            return config ? config.opacity : 0.4;
        })
        .style('stroke-width', d => {
            const config = relationshipConfig[d.relationship];
            const basePriority = config ? config.priority : 5;
            return Math.max(1, 6 - basePriority); // Higher priority = thicker line
        })
        .style('stroke-dasharray', d => {
            const config = relationshipConfig[d.relationship];
            if (config?.strokePattern === 'dashed') return '5,5';
            if (config?.strokePattern === 'dotted') return '2,3';
            return 'none';
        });
}

/**
 * Highlight connections for a specific node
 * @param {Object} nodeData - Node data object
 */
export function highlightNodeConnections(nodeData) {
    if (!nodeData) return;
    
    const connections = connectionCache.get(nodeData.id);
    if (!connections) return;
    
    const svg = d3.select('svg');
    const allConnectedIds = new Set();
    
    // Collect all connected node IDs
    connections.incoming.forEach(conn => allConnectedIds.add(conn.sourceId));
    connections.outgoing.forEach(conn => allConnectedIds.add(conn.targetId));
    
    // Highlight connected nodes
    svg.selectAll('circle')
        .style('opacity', d => {
            if (d.id === nodeData.id) return 1;
            if (allConnectedIds.has(d.id)) return 0.8;
            return 0.2;
        })
        .style('stroke-width', d => {
            if (d.id === nodeData.id) return 4;
            if (allConnectedIds.has(d.id)) return 3;
            return 2;
        });
    
    // Highlight connected links with enhanced styling
    svg.selectAll('.link')
        .style('opacity', l => {
            const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
            const targetId = typeof l.target === 'object' ? l.target.id : l.target;
            
            if (sourceId === nodeData.id || targetId === nodeData.id) return 0.9;
            if (allConnectedIds.has(sourceId) && allConnectedIds.has(targetId)) return 0.3;
            return 0.1;
        })
        .style('stroke-width', l => {
            const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
            const targetId = typeof l.target === 'object' ? l.target.id : l.target;
            
            if (sourceId === nodeData.id || targetId === nodeData.id) {
                const config = relationshipConfig[l.relationship];
                const basePriority = config ? config.priority : 5;
                return Math.max(2, 8 - basePriority);
            }
            return 1;
        });
}

/**
 * Reset connection highlighting
 */
export function resetConnectionHighlighting() {
    const svg = d3.select('svg');
    
    svg.selectAll('circle')
        .style('opacity', 1)
        .style('stroke-width', 2);
    
    svg.selectAll('.link')
        .style('opacity', 0.3)
        .style('stroke-width', d => {
            const config = relationshipConfig[d.relationship];
            const basePriority = config ? config.priority : 5;
            return Math.max(1, 6 - basePriority);
        });
}

/**
 * Get connection statistics for a node
 * @param {string} nodeId - Node ID
 * @returns {Object} Connection statistics
 */
export function getConnectionStats(nodeId) {
    const connections = connectionCache.get(nodeId);
    if (!connections) return null;
    
    const stats = {
        total: connections.totalConnections,
        incoming: connections.incoming.length,
        outgoing: connections.outgoing.length,
        relationshipTypes: Array.from(connections.relationshipTypes),
        dominantRelationship: null,
        connectivityScore: 0
    };
    
    // Calculate dominant relationship type
    const relationshipCounts = {};
    connections.relationshipTypes.forEach(type => {
        relationshipCounts[type] = [...connections.incoming, ...connections.outgoing]
            .filter(conn => conn.relationship === type).length;
    });
    
    stats.dominantRelationship = Object.keys(relationshipCounts)
        .reduce((a, b) => relationshipCounts[a] > relationshipCounts[b] ? a : b);
    
    // Calculate connectivity score (weighted by relationship priority)
    stats.connectivityScore = [...connections.incoming, ...connections.outgoing]
        .reduce((score, conn) => {
            const priority = relationshipConfig[conn.relationship]?.priority || 5;
            return score + (6 - priority); // Higher priority = higher score
        }, 0);
    
    return stats;
}

/**
 * Export connection cache for external access
 */
export function getConnectionCache() {
    return connectionCache;
}

/**
 * Export relationship configuration
 */
export { relationshipConfig };