/**
 * @fileoverview DOM Manager - Centralized DOM Element Access
 * @author Islamic Knowledge Graph Team
 * @since 2025-01-XX
 * @version 1.0.0
 * 
 * Purpose: Centralized DOM element access with error handling
 * Dependencies: None
 * Exports: DOMManager class with static methods
 * 
 * Usage:
 * import { DOMManager } from './ui/dom-manager.js';
 * const sidebar = DOMManager.getSidebarContent();
 */

/**
 * Custom error for missing DOM elements
 */
class DOMElementError extends Error {
    constructor(elementId) {
        super(`Required DOM element '${elementId}' not found`);
        this.name = 'DOMElementError';
        this.isOperational = true; // Following Node.js best practices
    }
}

/**
 * Enhanced DOM element manager with cache integration
 * Provides single point of access for all DOM elements with performance optimization
 */
export class DOMManager {
    
    /**
     * Initialize cache integration with graph-core cached elements
     * @param {Object} externalCache - The cachedDOMElements from graph-core
     */
    static initializeCache(externalCache = null) {
        this._cache = externalCache || window.cachedDOMElements || {};
        this._cacheInitialized = Boolean(this._cache);
        
        if (this._cacheInitialized) {
            console.log('✅ DOMManager integrated with performance cache');
        }
    }
    
    /**
     * Core graph container
     * @returns {HTMLElement} The graph SVG container
     * @throws {DOMElementError} When element not found
     */
    static getGraphContainer() {
        return this._getCachedOrFetch('graphContainer', 'graph');
    }
    
    /**
     * Sidebar content area
     * @returns {HTMLElement} The sidebar content container
     * @throws {DOMElementError} When element not found
     */
    static getSidebarContent() {
        return this._getCachedOrFetch('sidebarContent', 'sidebarContent');
    }
    
    /**
     * Search input field
     * @returns {HTMLElement} The search input element
     * @throws {DOMElementError} When element not found
     */
    static getSearchInput() {
        return this._getCachedOrFetch('searchInput', 'searchInput');
    }
    
    /**
     * Search suggestions dropdown
     * @returns {HTMLElement} The search suggestions container
     * @throws {DOMElementError} When element not found
     */
    static getSearchSuggestions() {
        return this._getCachedOrFetch('searchSuggestions', 'searchSuggestions');
    }
    
    /**
     * Learning paths container
     * @returns {HTMLElement} The learning paths expanded container
     * @throws {DOMElementError} When element not found
     */
    static getLearningPathsContainer() {
        return this._getCachedOrFetch('learningPathsExpanded', 'learningPathsExpanded');
    }
    
    /**
     * Learning paths trigger button
     * @returns {HTMLElement} The learning paths trigger element
     * @throws {DOMElementError} When element not found
     */
    static getLearningPathTrigger() {
        return this._getCachedOrFetch('learningPathTrigger', 'learningPathTrigger');
    }
    
    /**
     * Get element from cache or fetch from DOM
     * @private
     * @param {string} cacheKey - Key in the cache object
     * @param {string} elementId - DOM element ID
     * @returns {HTMLElement} The found element
     * @throws {DOMElementError} When element not found
     */
    static _getCachedOrFetch(cacheKey, elementId) {
        // Use cached element if available and cache is initialized
        if (this._cacheInitialized && this._cache[cacheKey]) {
            return this._cache[cacheKey];
        }
        
        // Fallback to DOM query
        return this._getElement(elementId);
    }
    
    /**
     * Safe element getter with error handling
     * @private
     * @param {string} id - Element ID to find
     * @returns {HTMLElement} The found element
     * @throws {DOMElementError} When element not found
     */
    static _getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new DOMElementError(id);
        }
        return element;
    }
    
    /**
     * Validate that all required elements exist
     * @returns {boolean} True if all elements exist
     * @throws {DOMElementError} When any required element is missing
     */
    static validateElements() {
        const required = ['graph', 'sidebarContent', 'searchInput'];
        
        for (const id of required) {
            this._getElement(id); // Will throw if missing
        }
        
        return true;
    }
    
    /**
     * Safe element getter - returns null instead of throwing
     * @param {string} id - Element ID to find
     * @returns {HTMLElement|null} The found element or null
     */
    static findElement(id) {
        try {
            return this._getElement(id);
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Get feature detection status from cache
     * @param {string} feature - Feature name to check
     * @returns {boolean} Feature availability
     */
    static hasFeature(feature) {
        if (this._cacheInitialized && this._cache.features) {
            return Boolean(this._cache.features[feature]);
        }
        
        // Fallback feature detection
        const featureElementMap = {
            hasSearchSuggestions: 'searchSuggestions',
            hasLearningPaths: 'learningPathsExpanded', 
            hasMobileSupport: () => Boolean(document.querySelector('.mobile-sidebar-toggle')),
            hasSidebarPathProgress: 'sidebarPathProgress'
        };
        
        const elementId = featureElementMap[feature];
        if (typeof elementId === 'function') {
            return elementId();
        }
        
        return Boolean(document.getElementById(elementId));
    }
    
    /**
     * Refresh cache for a specific element
     * @param {string} cacheKey - Cache key to refresh
     * @param {string} elementId - DOM element ID
     */
    static refreshCacheElement(cacheKey, elementId) {
        if (this._cacheInitialized) {
            this._cache[cacheKey] = document.getElementById(elementId);
        }
    }
}