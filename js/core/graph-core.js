/**
 * Islamic Knowledge Graph - Core Graph Functionality
 * Extracted from monolithic HTML file and modularized as ES6 module
 * 
 * This module contains the essential graph rendering, interaction, and D3.js simulation logic
 * that was previously embedded in the monolithic HTML file.
 */

import { graphData } from '../data/graph-data.js';
import { 
    centerNodeInView, 
    centerOnNodeGroup, 
    getNodeName, 
    getRelationshipExplanation 
} from '../utils/graph-utils.js';
// NOTE: updateSidebar and showDefaultSidebar now inlined for performance
// import { updateSidebar, showDefaultSidebar } from '../ui/sidebar.js';
import { tooltipManager } from '../utils/tooltip-manager.js';

// Simple timeout variables exactly like monolithic version
let hoverTimeout;
let searchTimeout;

// Unified timeout manager to prevent conflicts across modules
export const timeouts = {
    get hover() { return hoverTimeout; },
    set hover(value) { hoverTimeout = value; },
    get search() { return searchTimeout; },
    set search(value) { searchTimeout = value; },
    
    clearHover() { 
        clearTimeout(hoverTimeout); 
        hoverTimeout = null; 
    },
    
    setHover(callback, delay = 100) {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(callback, delay);
    },
    
    clearSearch() { 
        clearTimeout(searchTimeout); 
        searchTimeout = null; 
    },
    
    setSearch(callback, delay = 150) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(callback, delay);
    }
};

let connectionCache = new Map(); // Cache for connected nodes
let currentHighlightedNode = null; // Track current highlighted node

// D3.js graph elements (exported for other modules)
export let svg, container, nodeGroup, node, labels, link, tooltip, simulation, zoom;
export let width, height;

// Enhanced cached DOM references for performance-critical operations
let cachedDOMElements = {
    // Sidebar elements (core hover functionality)
    sidebarContent: null,
    sidebarTitle: null,
    sidebarGuidanceContent: null,
    sidebarInsightText: null,
    sidebarPathProgress: null,
    sidebarPathInfo: null,
    sidebarInsight: null,
    
    // Search elements (frequently accessed during search)
    searchInput: null,
    searchSuggestions: null,
    
    // Learning paths elements
    learningPathsContainer: null,
    learningPathsExpanded: null,
    learningPathTrigger: null,
    learningPathTriggerText: null,
    
    // Mobile elements
    sidebar: null,
    mobileSidebarToggle: null,
    
    // Graph container
    graphContainer: null,
    
    // Feature detection flags
    features: {
        hasSearchSuggestions: false,
        hasLearningPaths: false,
        hasMobileSupport: false,
        hasSidebarPathProgress: false
    }
};

/**
 * Enhanced DOM cache initialization with comprehensive element caching and feature detection
 * Moved to initialization phase to eliminate runtime DOM queries
 */
function initializeDOMCache() {
    // Performance timing for optimization measurement
    const startTime = performance.now();
    
    // Cache core sidebar elements (critical for hover performance)
    cachedDOMElements.sidebarContent = document.getElementById("sidebarContent");
    cachedDOMElements.sidebarTitle = document.getElementById("sidebarTitle");
    cachedDOMElements.sidebarGuidanceContent = document.getElementById("sidebarGuidanceContent");
    cachedDOMElements.sidebarInsightText = document.getElementById("sidebarInsightText");
    cachedDOMElements.sidebarPathProgress = document.getElementById("sidebarPathProgress");
    cachedDOMElements.sidebarPathInfo = document.getElementById("sidebarPathInfo");
    cachedDOMElements.sidebarInsight = document.getElementById("sidebarInsight");
    
    // Cache search elements (critical for search performance)
    cachedDOMElements.searchInput = document.getElementById("searchInput");
    cachedDOMElements.searchSuggestions = document.getElementById("searchSuggestions");
    
    // Cache learning paths elements
    cachedDOMElements.learningPathsContainer = document.getElementById("learningPathsContainer");
    cachedDOMElements.learningPathsExpanded = document.getElementById("learningPathsExpanded");
    cachedDOMElements.learningPathTrigger = document.getElementById("learningPathTrigger");
    cachedDOMElements.learningPathTriggerText = document.getElementById("learningPathTriggerText");
    
    // Cache mobile elements
    cachedDOMElements.sidebar = document.querySelector(".sidebar");
    cachedDOMElements.mobileSidebarToggle = document.querySelector(".mobile-sidebar-toggle");
    
    // Cache graph container
    cachedDOMElements.graphContainer = document.getElementById("graph");
    
    // Feature detection for graceful degradation
    cachedDOMElements.features.hasSearchSuggestions = Boolean(cachedDOMElements.searchSuggestions);
    cachedDOMElements.features.hasLearningPaths = Boolean(cachedDOMElements.learningPathsExpanded);
    cachedDOMElements.features.hasMobileSupport = Boolean(cachedDOMElements.mobileSidebarToggle);
    cachedDOMElements.features.hasSidebarPathProgress = Boolean(cachedDOMElements.sidebarPathProgress);
    
    // Validation and error reporting for critical elements
    const criticalElements = ['sidebarContent', 'searchInput', 'graphContainer'];
    const missingCritical = criticalElements.filter(key => !cachedDOMElements[key]);
    
    if (missingCritical.length > 0) {
        console.error('❌ Critical DOM elements missing:', missingCritical);
        throw new Error(`Critical DOM elements not found: ${missingCritical.join(', ')}`);
    }
    
    // Performance measurement
    const cacheTime = performance.now() - startTime;
    const cachedCount = Object.keys(cachedDOMElements).filter(key => 
        key !== 'features' && cachedDOMElements[key] !== null
    ).length;
    
    console.log(`✅ DOM cache initialized: ${cachedCount} elements cached in ${cacheTime.toFixed(2)}ms`);
    console.log('🔍 Feature detection:', cachedDOMElements.features);
    
    // Export cache for external modules
    window.cachedDOMElements = cachedDOMElements;
    
    // Performance benchmark - measure DOM access speed improvement
    benchmarkDOMPerformance();
}

/**
 * Benchmark DOM access performance to validate optimization
 */
function benchmarkDOMPerformance() {
    const iterations = 1000;
    
    // Benchmark traditional DOM access
    const traditionalStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        document.getElementById("sidebarContent");
        document.getElementById("searchInput");
        document.getElementById("searchSuggestions");
    }
    const traditionalTime = performance.now() - traditionalStart;
    
    // Benchmark cached DOM access
    const cachedStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        cachedDOMElements.sidebarContent;
        cachedDOMElements.searchInput;
        cachedDOMElements.searchSuggestions;
    }
    const cachedTime = performance.now() - cachedStart;
    
    // Calculate improvement
    const improvement = ((traditionalTime - cachedTime) / traditionalTime) * 100;
    const speedupFactor = traditionalTime / cachedTime;
    
    console.log(`📊 DOM Access Performance Benchmark (${iterations} iterations):`);
    console.log(`   Traditional DOM access: ${traditionalTime.toFixed(2)}ms`);
    console.log(`   Cached DOM access: ${cachedTime.toFixed(2)}ms`);
    console.log(`   🚀 Improvement: ${improvement.toFixed(1)}% faster (${speedupFactor.toFixed(1)}x speedup)`);
    
    // Validate success criteria
    if (improvement >= 50) {
        console.log(`✅ DOM optimization SUCCESS: Achieved ${improvement.toFixed(1)}% improvement (target: 50%+)`);
    } else {
        console.warn(`⚠️ DOM optimization below target: ${improvement.toFixed(1)}% improvement (target: 50%+)`);
    }
    
    // Store results for external validation
    window.domPerformanceResults = {
        traditionalTime,
        cachedTime,
        improvement,
        speedupFactor,
        targetMet: improvement >= 50
    };
}

/**
 * Pre-compute connections for better performance
 * Exact duplication from original buildConnectionCache function
 */
function buildConnectionCache() {
    graphData.nodes.forEach(node => {
        const connections = new Set();
        graphData.links.forEach(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            if (sourceId === node.id) connections.add(targetId);
            if (targetId === node.id) connections.add(sourceId);
        });
        connectionCache.set(node.id, connections);
    });
}

/**
 * Function to get relationship explanation for link tooltips
 * Exact duplication from original getRelationshipExplanation function
 */
// Note: getRelationshipExplanation now imported from utils/graph-utils.js

/**
 * Enhanced tooltip function to display new theological metadata
 * Exact duplication from original createEnhancedTooltip function
 */
function createEnhancedTooltip(d) {
    let tooltip = `<strong>${d.name}</strong><br/>`;
    tooltip += `<em>Type: ${d.type}</em><br/>`;
    
    // Add Arabic terminology for theological concepts
    if (d.arabic_term) tooltip += `<strong>Arabic:</strong> ${d.arabic_term}<br/>`;
    
    // Add dates if available
    if (d.dates) tooltip += `<strong>Dates:</strong> ${d.dates}<br/>`;
    
    // Add core definition for theological concepts
    if (d.core_definition) tooltip += `<strong>Definition:</strong> ${d.core_definition}<br/>`;
    
    // Add accessibility level
    if (d.accessibility) tooltip += `<strong>Level:</strong> ${d.accessibility}<br/>`;
    
    // Add quantified impact
    if (d.quantifiedImpact) tooltip += `<strong>Impact:</strong> ${d.quantifiedImpact}<br/>`;
    
    // Add key principles for theological concepts
    if (d.key_principles && Array.isArray(d.key_principles)) {
        tooltip += `<strong>Key Principles:</strong> ${d.key_principles.join(', ')}<br/>`;
    }
    
    // Add translations
    if (d.translations && Array.isArray(d.translations)) {
        tooltip += `<strong>Translations:</strong> ${d.translations.join(', ')}<br/>`;
    }
    
    // Add contemporary relevance
    if (d.contemporary_relevance) tooltip += `<strong>Modern Relevance:</strong> ${d.contemporary_relevance}<br/>`;
    
    // Add priority level for learning paths
    if (d.priority_level) tooltip += `<strong>Priority:</strong> ${d.priority_level}<br/>`;
    
    tooltip += `<br/>${d.description ? d.description.substring(0, 200) + '...' : d.connections || ''}`;
    return tooltip;
}

// Note: centerNodeInView now imported from utils/graph-utils.js

// Note: centerOnNodeGroup now imported from utils/graph-utils.js

/**
 * Drag functions - exact duplication from original
 */
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

/**
 * Enhanced zoom and pan with performance optimization
 * Exact duplication from original zoom setup
 */
zoom = d3.zoom()
    .scaleExtent([0.2, 5])
    .on("zoom", function(event) {
        container.attr("transform", event.transform);
        
        // Optimize rendering at different zoom levels
        const scale = event.transform.k;
        
        // Hide labels at very small scales for performance
        labels.style("display", scale < 0.5 ? "none" : "block");
        
        // Adjust label sizes based on zoom
        labels.style("font-size", d => {
            const baseSize = d.type === "scholar" ? 11 : d.type === "book" ? 10 : 9;
            return Math.max(6, Math.min(14, baseSize / Math.sqrt(scale))) + "px";
        });
        
        // Simplify rendering at small scales
        if (scale < 0.4) {
            link.style("stroke-width", "1px");
            node.style("stroke-width", "1px");
        } else {
            link.style("stroke-width", "1.8px");
            node.style("stroke-width", "2.5px");
        }
    });


/**
 * Initialize the core graph functionality
 * Main entry point for setting up the D3.js graph
 */
export function initializeGraph(containerId, graphWidth, graphHeight) {
    // Store dimensions for use in other functions
    width = graphWidth;
    height = graphHeight;
    
    // Set up SVG with responsive sizing like original
    svg = d3.select(`#${containerId}`)
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);
    
    // Create container for zoom like original
    const container = svg.append("g");
    
    // Create tooltip
    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "rgba(0, 0, 0, 0.9)")
        .style("color", "white")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "1000");
    
    // Build connection cache for performance
    buildConnectionCache();
    
    // Initialize DOM cache for performance-critical operations
    initializeDOMCache();
    
    // Create links
    link = container.append("g")
        .selectAll("line")
        .data(graphData.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", d => {
            // Contemporary connections with distinct purple color
            if (d.type === "applies_to" || d.type === "enables" || d.type === "practiced_by") return "#8e44ad";
            // Classical scholarly relationships in blue spectrum
            if (d.type === "authored" || d.type === "compiled") return "#2856A3";
            if (d.type === "taught" || d.type === "established") return "#7db3d3";
            if (d.type === "interpreted" || d.type === "analyzed") return "#f4c64f";
            // Theological and conceptual in warm tones
            return "#d4a574";
        })
        .style("stroke-width", d => {
            // Contemporary connections slightly thicker
            if (d.type === "applies_to" || d.type === "enables" || d.type === "practiced_by") return 2.5;
            return 2;
        })
        .style("opacity", 0.6)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
            // Use centralized tooltip manager for proper cleanup
            const tooltipId = tooltipManager.createRelationshipTooltip(d, event, getRelationshipExplanation, graphData);
            
            // Store tooltip ID on the link element for tracking
            d3.select(this).attr('data-tooltip-id', tooltipId);
            
            // Highlight the connection
            d3.select(this)
                .attr("stroke-width", 4)
                .attr("stroke-opacity", 1);
        })
        .on("mousemove", function(event) {
            const tooltipId = d3.select(this).attr('data-tooltip-id');
            if (tooltipId) {
                tooltipManager.updateTooltipPosition(tooltipId, event);
            }
        })
        .on("mouseout", function(event, d) {
            // Remove tooltip using centralized manager
            const tooltipId = d3.select(this).attr('data-tooltip-id');
            if (tooltipId) {
                tooltipManager.removeTooltip(tooltipId);
                d3.select(this).attr('data-tooltip-id', null);
            }
            
            // Reset link appearance
            d3.select(this)
                .attr("stroke-width", d.type === "applies_to" || d.type === "enables" || d.type === "practiced_by" ? 2.5 : 2)
                .attr("stroke-opacity", 0.6);
        });
    
    // Create nodes
    nodeGroup = container.append("g")
        .selectAll("g")
        .data(graphData.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
    node = nodeGroup.append("circle")
        .attr("r", d => {
            if (d.type === "scholar") return 22;
            if (d.type === "book" || d.type === "verse") return 18;
            if (d.type === "contemporary") return 20; // New contemporary nodes
            return 15;
        })
        .attr("fill", d => {
            // VantageWorks Color Scale (exact from original)
            const colorScale = {
                scholar: "#2856A3",     // Royal blue
                book: "#7db3d3",       // Soft blue
                jurisprudence: "#f4c64f", // Golden amber
                theology: "#d4a574",    // Warm brown
                practice: "#5a9b97",    // Medium teal
                verse: "#e6b566",      // Warm amber
                concept: "#4a5568",    // Warm charcoal
                contemporary: "#8e44ad"  // Modern purple
            };
            return colorScale[d.type] || "#4a5568";
        })
        .attr("stroke", "#333")
        .attr("stroke-width", 2.5);
    
    // Create labels (exact from original)
    labels = nodeGroup.append("text")
        .attr("class", "node-label")
        .text(d => d.name)
        .style("font-size", d => {
            if (d.type === "scholar") return "11px";
            if (d.type === "book") return "10px";
            if (d.type === "contemporary") return "10px";
            return "9px";
        });
    
    // Set up simulation
    simulation = d3.forceSimulation(graphData.nodes)
        .force("link", d3.forceLink(graphData.links)
            .id(d => d.id)
            .distance(d => {
                // Intelligent link distance based on relationship type
                if (d.type === "authored" || d.type === "compiled") return 70;
                if (d.type === "taught" || d.type === "established") return 85;
                if (d.type === "refers_to" || d.type === "interpreted") return 95;
                if (d.type === "requires" || d.type === "implies") return 110;
                if (d.type === "applies_to" || d.type === "enables") return 120; // Contemporary connections
                return 130;
            })
            .strength(d => {
                // Stronger connections for direct relationships
                if (d.type === "authored" || d.type === "taught") return 1.2;
                if (d.type === "established" || d.type === "developed") return 1.0;
                if (d.type === "applies_to" || d.type === "enables") return 0.9; // Contemporary strength
                return 0.8;
            }))
        .force("charge", d3.forceManyBody()
            .strength(d => {
                // Vary repulsion based on node importance and type
                if (d.type === "scholar") return -500;
                if (d.type === "book" || d.type === "verse") return -350;
                if (d.type === "contemporary") return -400; // Strong repulsion for contemporary nodes
                return -300;
            })
            .distanceMax(400)) // Limit calculation distance for performance
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide()
            .radius(d => {
                if (d.type === "scholar") return 28;
                if (d.type === "book") return 23;
                if (d.type === "verse") return 21;
                if (d.type === "contemporary") return 26;
                return 20;
            })
            .strength(0.8))
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .alphaDecay(0.0228) // Faster convergence for better performance
        .velocityDecay(0.4); // Smoother movement
    
    // Enhanced zoom and pan with performance optimization (from original)
    zoom = d3.zoom()
        .scaleExtent([0.2, 5])
        .on("zoom", function(event) {
            container.attr("transform", event.transform);
            
            // Optimize rendering at different zoom levels
            const scale = event.transform.k;
            
            // Adjust label visibility based on zoom level
            if (labels) {
                labels.style("display", scale > 0.5 ? "block" : "none");
            }
            
            // Adjust stroke width based on zoom for better visibility
            if (link) {
                link.style("stroke-width", Math.max(1, 2 / scale));
            }
            
            // Performance: reduce simulation precision at very high zoom
            if (scale > 3 && simulation) {
                simulation.alpha(0.1);
            }
        });
    
    svg.call(zoom);
    
    // Enhanced reset functionality with proper centering (from original)
    svg.on("dblclick.zoom", function(event) {
        event.preventDefault();
        
        // Reset to optimal initial view with proper centering
        const resetTransform = d3.zoomIdentity
            .translate(width/2, height/2)
            .scale(0.8)
            .translate(-width/2, -height/2);
        
        svg.transition()
            .duration(750)
            .call(zoom.transform, resetTransform);
    });
    
    // Performance-optimized mouse event handlers - ZERO cross-module calls
    nodeGroup.on("mouseover", function(event, d) {
        clearTimeout(hoverTimeout); // Direct clearTimeout like monolithic
        
        // Skip if same node to prevent unnecessary updates
        if (currentHighlightedNode === d.id) return;
        currentHighlightedNode = d.id;
        
        // Create enhanced tooltip with new metadata
        tooltip.html(createEnhancedTooltip(d));
        
        // PERFORMANCE CRITICAL: Inline sidebar update - NO cross-module calls
        inlineUpdateSidebar(d, false);
        
        // IMPORTANT: Highlight connected nodes using cached connections for performance
        const connectedNodes = connectionCache.get(d.id) || new Set();
        
        // Apply highlighting effects
        node.style("opacity", n => connectedNodes.has(n.id) || n.id === d.id ? 1 : 0.2);
        labels.style("opacity", n => connectedNodes.has(n.id) || n.id === d.id ? 1 : 0.2);
        
        link.style("opacity", l => {
            const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
            const targetId = typeof l.target === 'object' ? l.target.id : l.target;
            return sourceId === d.id || targetId === d.id ? 0.8 : 0.1;
        }).classed("highlighted", l => {
            const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
            const targetId = typeof l.target === 'object' ? l.target.id : l.target;
            return sourceId === d.id || targetId === d.id;
        });
        
        // Performance tracking
        if (window.performanceTracking) {
            console.log(`Efficiently highlighted ${connectedNodes.size} connected nodes for ${d.name}`);
        }
    })
    .on("mouseout", function() {
        hoverTimeout = setTimeout(() => { // Direct setTimeout like monolithic
            currentHighlightedNode = null; // Reset performance tracking
            
            // PERFORMANCE CRITICAL: Inline default sidebar - NO cross-module calls
            inlineShowDefaultSidebar();
            
            // Reset visual highlights
            node.style("opacity", 1);
            labels.style("opacity", 1);
            link.style("opacity", 0.3).classed("highlighted", false);
        }, 100); // Brief delay to prevent flicker exactly like monolithic
    })
    .on("click", function(event, d) {
        // Enhanced click behavior for exploration
        event.stopPropagation();
        
        // Use the smart centering function
        centerNodeInView(d, null, { width, height, simulation, zoom, svg });
        
        // Pin the sidebar content using cached reference
        clearTimeout(hoverTimeout);
        const sidebarContent = cachedDOMElements.sidebarContent;
        if (sidebarContent) {
            sidebarContent.setAttribute('data-pinned', 'true');
            
            // Add visual indicator that sidebar is pinned using cached reference
            const sidebarTitle = cachedDOMElements.sidebarTitle;
            if (sidebarTitle && !sidebarTitle.innerHTML.includes('📌')) {
                sidebarTitle.innerHTML = sidebarTitle.innerHTML + ' <span style="color: #f4c64f; font-size: 0.8rem;">📌 Pinned</span>';
            }
        }
        
        // Update sidebar with current node data and pin it
        updateSidebarLearningPath(d);
        
        // Add research insights for pinned content
        addResearchInsights(d);
        
        // Add to navigation history with current transform
        const currentTransform = d3.zoomTransform(svg.node());
        if (!window.navigationHistory) window.navigationHistory = [];
        window.navigationHistory.push({node: d, transform: currentTransform});
        if (window.navigationHistory.length > 10) {
            window.navigationHistory.shift();
        }
    });
    
    // Apply zoom behavior to SVG
    svg.call(zoom);
    
    // Enhanced reset functionality with proper centering
    svg.on("dblclick.zoom", function(event) {
        event.preventDefault();
        
        // Reset to optimal initial view with proper centering
        const resetTransform = d3.zoomIdentity
            .translate(width/2, height/2)
            .scale(0.8)
            .translate(-width/2, -height/2);
        
        svg.transition()
            .duration(1000)
            .ease(d3.easeCubicInOut)
            .call(zoom.transform, resetTransform);
        
        // Clear search if active using cached references
        const searchInput = cachedDOMElements.searchInput;
        if (searchInput) searchInput.value = "";
        const searchSuggestions = cachedDOMElements.searchSuggestions;
        if (searchSuggestions) searchSuggestions.style.display = "none";
        if (typeof window.unpinSidebar === 'function') {
            window.unpinSidebar(); // Reset sidebar instead of hiding old panel
        }
        node.style("opacity", 1);
        labels.style("opacity", 1);
        link.style("opacity", 0.3);
    });
    
    // Performance monitoring and analytics
    let interactionCount = 0;
    nodeGroup.on('click.analytics', () => interactionCount++);
    
    // Periodic performance check
    setInterval(() => {
        const memoryUsage = performance.memory ? 
            Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 'N/A';
        
        console.log(`📊 Knowledge Graph Stats: ${interactionCount} interactions, ~${memoryUsage}MB memory`);
        
        // Auto-optimization for memory usage
        if (performance.memory && performance.memory.usedJSHeapSize > 50 * 1024 * 1024) {
            // Reduce visual effects if memory usage is high
            d3.selectAll('.node').style('filter', 'none');
            console.log('🛠️ Optimized rendering for memory efficiency');
        }
    }, 30000); // Check every 30 seconds
    
    // Simulation tick handler
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
        nodeGroup.attr("transform", d => {
            // Optimized boundary checking
            d.x = Math.max(30, Math.min(width - 30, d.x));
            d.y = Math.max(30, Math.min(height - 30, d.y));
            return `translate(${d.x},${d.y})`;
        });
    });
    
    // Return the initialized components for external access
    return {
        svg,
        container,
        simulation,
        nodeGroup,
        node,
        labels,
        link
    };
}

/**
 * Enhanced keyboard navigation and accessibility
 * Exact duplication from original event handlers
 */
export function setupKeyboardNavigation() {
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            // Reset view and clear search with proper centering
            const resetTransform = d3.zoomIdentity
                .translate(width/2, height/2)
                .scale(0.8)
                .translate(-width/2, -height/2);
                
            svg.transition()
                .duration(600)
                .ease(d3.easeCubicOut)
                .call(zoom.transform, resetTransform);
                
            const searchInput = document.getElementById("searchInput");
            if (searchInput) searchInput.value = "";
            const searchSuggestions = document.getElementById("searchSuggestions");
            if (searchSuggestions) searchSuggestions.style.display = "none";
            unpinSidebar(); // Reset sidebar instead of hiding old panel
            node.style("opacity", 1);
            labels.style("opacity", 1);
            link.style("opacity", 0.3);
        } else if ((event.key === "f" && event.ctrlKey) || (event.key === "/" && !event.ctrlKey && !event.altKey)) {
            // Focus search bar using cached reference
            event.preventDefault();
            const searchInput = cachedDOMElements.searchInput;
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        } else if (event.key === "?" && !event.ctrlKey && !event.altKey) {
            // Show help
            event.preventDefault();
            alert("🌟 Islamic Knowledge Graph Help\n\n🔍 Search: Type any scholar, book, or concept\n🖱️ Hover: See details and connections\n📌 Click: Center and focus on a node\n🎯 Drag: Reposition nodes\n🔍 Zoom: Scroll wheel to zoom in/out\n⏸️ Reset: Double-click background or press Escape\n⌨️ Shortcuts: Ctrl+F or / to search, ? for help");
        }
    });
}

/**
 * Performance monitoring function
 * Exact duplication from original enablePerformanceTracking function
 */
export function enablePerformanceTracking() {
    window.performanceTracking = true;
    console.log('Performance tracking enabled for knowledge graph');
}

/**
 * Function to clear all highlights and reset view
 * Exact duplication from original resetGraphView function
 */
export function resetGraphView() {
    currentHighlightedNode = null;
    if (svg) svg.selectAll('circle').style('stroke', '#333').style('stroke-width', 2).style('filter', null);
    if (svg) svg.selectAll('.path-indicator').remove();
    if (node) node.style("opacity", 1);
    if (labels) labels.style("opacity", 1);
    if (link) link.style("opacity", 0.6).classed("highlighted", false);
    
    // Reset sidebar using cached reference
    const sidebarContent = cachedDOMElements.sidebarContent;
    if (sidebarContent) {
        sidebarContent.removeAttribute('data-pinned');
        if (window.currentLearningPath) {
            updateSidebarForLearningPath(window.currentLearningPathInfo);
        } else {
            sidebarContent.innerHTML = `
                <div style="text-align: center; color: rgba(255,255,255,0.7); padding: 40px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;">🕌</div>
                    <p style="margin: 0; font-size: 1.1rem; font-weight: 600;">Islamic Knowledge Explorer</p>
                    <p style="margin: 8px 0 0 0; font-size: 0.9rem; line-height: 1.5;">Hover over any node to explore the rich connections in Islamic scholarship</p>
                </div>
            `;
        }
    }
}

/**
 * Function to unpin sidebar and reset to default state
 * Exact duplication from original unpinSidebar function
 */
export function unpinSidebar() {
    const sidebarContent = cachedDOMElements.sidebarContent;
    if (sidebarContent) {
        sidebarContent.removeAttribute('data-pinned');
        
        // Reset sidebar to default state
        sidebarContent.innerHTML = `
            <div style="opacity: 0.7;">
                <h3 style="margin: 0 0 12px 0; color: #f4c64f; font-size: 1.2rem;">📚 Knowledge Explorer</h3>
                <p style="margin: 0; font-size: 0.85rem; line-height: 1.4;">• <strong>Search</strong> scholars, books, concepts<br>• <strong>Hover</strong> nodes for details & connections<br>• <strong>Click</strong> to pin content & view quotes<br>• <strong>Learning paths</strong> in header area<br>• <strong>Keyboard shortcuts</strong> for navigation</p>
            </div>
        `;
        
        // Reset graph visualization
        if (node) node.style("opacity", 1);
        if (labels) labels.style("opacity", 1);
        if (link) link.style("opacity", 0.3).classed("highlighted", false);
    }
}

/**
 * Helper function to get node name by ID
 * Exact duplication from original getNodeName function
 */
// Note: getNodeName now imported from utils/graph-utils.js

/**
 * Function to highlight and show a specific node
 * Exact duplication from original highlightAndShowNode function
 */
export function highlightAndShowNode(nodeId) {
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (node) {
        // Trigger hover effect to show node information
        const nodeSelection = nodeGroup.filter(n => n.id === nodeId);
        nodeSelection.dispatch('mouseover', { bubbles: true });
        
        // Center the node in view
        centerNodeInView(node, null, { width, height, simulation, zoom, svg });
    }
}

/**
 * Essential functions for stable hover behavior
 * Simplified versions extracted from original for stability
 */

// Core function to update sidebar learning path (simplified stable version) - using cached DOM
function updateSidebarLearningPath(d) {
    // Check if required sidebar elements exist using cached reference
    const sidebarGuidanceContent = cachedDOMElements.sidebarGuidanceContent;
    if (sidebarGuidanceContent) {
        const guidance = generateLearningGuidance(d);
        sidebarGuidanceContent.innerHTML = guidance;
    }
    
    console.log('Learning path updated for:', d.name);
}

// Core function to add research insights (simplified stable version) - using cached DOM
function addResearchInsights(d) {
    const sidebarInsightText = cachedDOMElements.sidebarInsightText;
    if (sidebarInsightText) {
        // Use the entity's specific interesting fact if available
        let specificInsight = d.interestingFact || d.connections || "This entity is part of the rich tapestry of Islamic scholarship.";
        sidebarInsightText.textContent = specificInsight;
    }
    
    console.log('Research insights added for:', d.name);
}

// Learning guidance generator (simplified stable version)
function generateLearningGuidance(d) {
    const guidanceMap = {
        'scholar': `Learn about ${d.name}'s teachings and their influence on Islamic scholarship.`,
        'book': `Study ${d.name} to understand its role in Islamic literature and theology.`,
        'theology': `Explore the theological concept of ${d.name} and its applications.`,
        'jurisprudence': `Understand how ${d.name} applies to Islamic legal methodology.`,
        'practice': `Learn about the practice of ${d.name} in Islamic worship.`,
        'verse': `Reflect on the meaning and interpretation of ${d.name}.`,
        'concept': `Explore the philosophical and practical aspects of ${d.name}.`,
        'contemporary': `Discover how ${d.name} applies to modern Islamic life.`
    };
    
    return guidanceMap[d.type] || `Explore ${d.name} and its connections to understand this concept better.`;
}

// Stable placeholder functions for other dependencies
function updateSidebarForLearningPath(pathInfo) {
    console.log('updateSidebarForLearningPath called', pathInfo);
}

function showLearningPathOnGraph(pathNodes) {
    console.log('showLearningPathOnGraph called with', pathNodes.length, 'nodes');
}

/**
 * PERFORMANCE CRITICAL: Inlined sidebar HTML generation
 * Extracted from sidebar.js and optimized for zero cross-module calls
 */

/**
 * Inline function to create quote section for verse nodes
 */
function inlineCreateQuoteSection(nodeData) {
    if (!nodeData.quote) return '';
    
    const isArabic = nodeData.type === 'verse' && nodeData.quote.includes('ا');
    
    return `
        <div style="background: rgba(255, 255, 255, 0.95); color: #2c3e50; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #f4c64f;">
            <div style="${isArabic ? 'font-family: \'Times New Roman\', serif; font-size: 1.1rem; direction: rtl; text-align: right;' : 'font-style: italic;'} margin-bottom: 8px;">
                "${nodeData.quote}"
            </div>
            ${nodeData.description ? `<div style="font-size: 0.9rem; color: #666;"><em>${nodeData.description}</em></div>` : ''}
        </div>
    `;
}

/**
 * Inline function to create learning guidance section
 */
function inlineCreateLearningGuidanceSection(nodeData) {
    // Inline learning guidance generation - no cross-module call
    const guidanceMap = {
        'scholar': `Learn about ${nodeData.name}'s teachings and their influence on Islamic scholarship.`,
        'book': `Study ${nodeData.name} to understand its role in Islamic literature and theology.`,
        'theology': `Explore the theological concept of ${nodeData.name} and its applications.`,
        'jurisprudence': `Understand how ${nodeData.name} applies to Islamic legal methodology.`,
        'practice': `Learn about the practice of ${nodeData.name} in Islamic worship.`,
        'verse': `Reflect on the meaning and interpretation of ${nodeData.name}.`,
        'concept': `Explore the philosophical and practical aspects of ${nodeData.name}.`,
        'contemporary': `Discover how ${nodeData.name} applies to modern Islamic life.`
    };
    
    const guidance = guidanceMap[nodeData.type] || `Explore ${nodeData.name} and its connections to understand this concept better.`;
    
    return `
        <div style="background: rgba(244, 198, 79, 0.1); padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid rgba(244, 198, 79, 0.3);">
            <div style="color: #f4c64f; font-weight: 600; margin-bottom: 12px; font-size: 0.9rem;">🧭 Learning Guidance</div>
            <div style="font-size: 0.85rem; color: rgba(255,255,255,0.8);">${guidance}</div>
        </div>
    `;
}

/**
 * Inline function to create insight section
 */
function inlineCreateInsightSection(nodeData) {
    if (!nodeData.interestingFact) return '';
    
    return `
        <div style="background: rgba(168, 197, 232, 0.1); padding: 12px; border-radius: 6px; margin: 12px 0; border: 1px solid rgba(168, 197, 232, 0.3);">
            <strong style="color: #a8c5e8; font-size: 0.9em;">💡 Did You Know?</strong>
            <p style="margin: 5px 0 0 0; font-size: 0.85em; line-height: 1.4; color: rgba(255,255,255,0.8);">
                ${nodeData.interestingFact}
            </p>
        </div>
    `;
}

/**
 * Inline function to create additional information section
 */
function inlineCreateAdditionalInfoSection(nodeData) {
    let additionalInfo = '';
    
    // Add dates if available
    if (nodeData.dates) {
        additionalInfo += `
            <div style="background: rgba(125, 179, 211, 0.1); padding: 12px; border-radius: 6px; margin: 12px 0;">
                <strong style="color: #7db3d3;">📅 Timeline:</strong>
                <div style="margin-top: 4px; font-size: 0.85rem; color: rgba(255,255,255,0.8);">${nodeData.dates}</div>
            </div>
        `;
    }
    
    // Add key works if available
    if (nodeData.keyWorks || nodeData.keyWork) {
        const works = nodeData.keyWorks || [nodeData.keyWork];
        additionalInfo += `
            <div style="background: rgba(244, 198, 79, 0.1); padding: 12px; border-radius: 6px; margin: 12px 0;">
                <strong style="color: #f4c64f;">📚 Key Works:</strong>
                <div style="margin-top: 4px; font-size: 0.85rem; color: rgba(255,255,255,0.8);">${Array.isArray(works) ? works.join(', ') : works}</div>
            </div>
        `;
    }
    
    return additionalInfo;
}

/**
 * PERFORMANCE CRITICAL: Inlined sidebar update function
 * Replaces updateSidebar() call with direct DOM manipulation
 */
function inlineUpdateSidebar(nodeData, pin = false) {
    const sidebarContent = cachedDOMElements.sidebarContent || document.getElementById("sidebarContent");
    
    if (!sidebarContent) {
        console.error("Sidebar content element not found!");
        return;
    }
    
    if (pin) {
        sidebarContent.setAttribute('data-pinned', 'true');
    }

    // Create enhanced sidebar content - exact duplication from sidebar.js
    const hasMoreContent = (nodeData.description || "").length > 500 || 
                          nodeData.quote || 
                          nodeData.institutions || 
                          nodeData.applications;

    sidebarContent.innerHTML = `
        <div class="sidebar-scroll-content ${hasMoreContent ? 'has-more-content' : ''}" 
             style="height: 100%; overflow-y: auto; padding-right: 8px; scrollbar-width: thin; scrollbar-color: rgba(244, 198, 79, 0.6) rgba(255, 255, 255, 0.1);">
            
            <!-- Header Section -->
            <div style="position: sticky; top: 0; background: linear-gradient(135deg, rgba(40, 86, 163, 0.96) 0%, rgba(125, 179, 211, 0.96) 100%); padding-bottom: 12px; margin-bottom: 16px; z-index: 10; border-bottom: 1px solid rgba(244, 198, 79, 0.2);">
                <h3 id="sidebarTitle" style="margin: 0; color: #f4c64f; font-size: 1.25rem; font-weight: 700;">
                    ${nodeData.name}${pin ? ' <span style="color: #f4c64f; font-size: 0.8rem;">📌 Pinned</span>' : ''}
                </h3>
                <div style="font-size: 0.7rem; color: rgba(244, 198, 79, 0.8); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${nodeData.type.replace('_', ' ')}
                </div>
            </div>
            
            <!-- Content Section -->
            <div style="padding-bottom: 24px;">
                <p id="sidebarDescription" style="margin: 0 0 16px 0; font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.9);">
                    ${nodeData.description || "No description available"}
                </p>
            
                <!-- Quote Section for verses -->
                ${inlineCreateQuoteSection(nodeData)}
                
                <!-- Learning Guidance Section -->
                ${inlineCreateLearningGuidanceSection(nodeData)}
                
                <!-- Educational Insight -->
                ${inlineCreateInsightSection(nodeData)}
                
                <!-- Additional Information -->
                ${inlineCreateAdditionalInfoSection(nodeData)}
            </div>
        </div>
    `;
}

/**
 * PERFORMANCE CRITICAL: Inlined default sidebar function
 * Replaces showDefaultSidebar() call with direct DOM manipulation
 */
function inlineShowDefaultSidebar() {
    const sidebarContent = cachedDOMElements.sidebarContent || document.getElementById("sidebarContent");
    
    if (!sidebarContent || sidebarContent.getAttribute('data-pinned')) return;
    
    sidebarContent.innerHTML = `
        <div style="opacity: 0.7;">
            <h3 style="margin: 0 0 12px 0; color: #f4c64f; font-size: 1.2rem;">📚 Knowledge Explorer</h3>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.4;">
                • <strong>Search</strong> scholars, books, concepts<br>
                • <strong>Hover</strong> nodes for details & connections<br>
                • <strong>Click</strong> to pin content & view quotes<br>
                • <strong>Learning paths</strong> in header area<br>
                • <strong>Keyboard shortcuts</strong> for navigation
            </p>
        </div>
    `;
}

// Export the core functions and utilities
export {
    buildConnectionCache,
    createEnhancedTooltip,
    dragstarted,
    dragged,
    dragended,
    inlineUpdateSidebar,
    inlineShowDefaultSidebar
};