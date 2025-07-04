/**
 * Search Module - Exact duplication from original monolithic file
 * Enhanced search functionality with intelligent suggestions
 */

import { graphData } from '../data/graph-data.js';
import { width, height, zoom, simulation, timeouts, svg } from '../core/graph-core.js';
import { centerNodeInView, centerOnNodeGroup } from '../utils/graph-utils.js';
import { DOMManager } from './dom-manager.js';
import { showSearchNotification } from './notifications.js';
import { richContentManager } from '../utils/rich-content-manager.js';

// DOM elements - will be cached for performance
let searchInput, searchSuggestions;

// Keyboard navigation state
let selectedSuggestion = -1;

// Enhanced search terms and synonyms for better matching
const searchSynonyms = {
    'ali': ['imam ali', 'amir al-muminin', 'lion of god', 'commander of faithful'],
    'quran': ['holy quran', 'koran', 'book of allah', 'revelation'],
    'prayer': ['salah', 'namaz', 'worship', 'devotion'],
    'pilgrimage': ['hajj', 'ziyarat', 'sacred journey'],
    'fiqh': ['jurisprudence', 'islamic law', 'legal methodology'],
    'hadith': ['tradition', 'narration', 'prophetic saying'],
    'imam': ['leader', 'guide', 'religious authority'],
    'justice': ['adalah', 'adl', 'fairness', 'equity'],
    'ijtihad': ['independent reasoning', 'legal reasoning', 'scholarly interpretation'],
    'tawhid': ['divine unity', 'monotheism', 'oneness of god'],
    'nahj': ['nahj al-balagha', 'peak of eloquence', 'ali sayings'],
    'kafi': ['al-kafi', 'sufficient', 'hadith collection'],
    'sistani': ['grand ayatollah', 'maraji', 'religious authority'],
    'mufid': ['sheikh mufid', 'baghdad scholar', 'shia theologian']
};

// Enhanced starting points categorized by learning path
const beginnerSuggestions = {
    featured: ['Imam Ali', 'Tawhid', 'Nahj al-Balagha', 'Holy Quran'],
    enhanced: ['Imam Ali', 'Nahj al-Balagha', 'Ijtihad'], // Nodes with rich content
    scholars: ['Imam Ali', 'Imam Sadiq', 'Sheikh Mufid', 'Sistani'],
    concepts: ['Tawhid', 'Imamate', 'Ijtihad', 'Marjaiyyah'],
    practices: ['Salah', 'Hajj', 'Khums', 'Zakat'],
    texts: ['Nahj al-Balagha', 'Al-Kafi', 'Holy Quran', 'Usul al-Fiqh']
};

// Note: centerNodeInView now imported from utils/graph-utils.js

// Note: centerOnNodeGroup now imported from utils/graph-utils.js

// Show search suggestions function with graceful degradation
function showSearchSuggestions(searchTerm) {
    // Graceful degradation if suggestions element unavailable
    if (!searchSuggestions) {
        return;
    }
    
    if (!searchTerm || searchTerm.length < 2) {
        if (searchTerm === '') {
            // Show enhanced suggestions when search is empty and focused
            const enhancedNodes = beginnerSuggestions.enhanced.map(term => {
                const hasEnhanced = richContentManager.hasEnhancedContent(term.toLowerCase().replace(/\s+/g, '_'));
                return `<div class="suggestion-item enhanced" data-term="${term}" style="padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #e5e7eb; font-size: 0.95em; transition: all 0.2s ease; role: option; tabindex: 0; ${hasEnhanced ? 'background: linear-gradient(90deg, rgba(244, 198, 79, 0.1) 0%, rgba(40, 86, 163, 0.1) 100%);' : ''}" onmouseover="this.style.backgroundColor='${hasEnhanced ? 'rgba(244, 198, 79, 0.2)' : '#fef7ec'}'; this.style.borderLeft='4px solid #f4c64f'" onmouseout="this.style.backgroundColor='${hasEnhanced ? 'rgba(244, 198, 79, 0.1)' : 'white'}'; this.style.borderLeft='none'"><strong style="color: #d4a343;">${hasEnhanced ? '⭐' : '🌟'} ${term}</strong> <span style="color: #6b7280;">- ${hasEnhanced ? 'Enhanced content available' : 'Popular starting point'}</span></div>`;
            });
            
            const featuredNodes = beginnerSuggestions.featured.slice(1).map(term => 
                `<div class="suggestion-item" data-term="${term}" style="padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #e5e7eb; font-size: 0.95em; transition: all 0.2s ease; role: option; tabindex: 0;" onmouseover="this.style.backgroundColor='#fef7ec'; this.style.borderLeft='4px solid #f4c64f'" onmouseout="this.style.backgroundColor='white'; this.style.borderLeft='none'"><strong style="color: #d4a343;">🌟 ${term}</strong> <span style="color: #6b7280;">- Featured topic</span></div>`
            );
            
            const allSuggestions = [...enhancedNodes, ...featuredNodes].join('');
            
            searchSuggestions.innerHTML = '<div style="padding: 12px 16px; font-size: 0.9em; color: #4b5563; font-weight: 700; background: #f9fafb; border-bottom: 2px solid #e5e7eb;">Recommended Starting Points:</div>' + allSuggestions;
            searchSuggestions.style.display = 'block';
        }
        return;
    }
    
    // Find matching nodes with enhanced content priority
    const matches = graphData.nodes.filter(d => {
        const name = d.name.toLowerCase();
        const description = d.description.toLowerCase();
        
        // Basic matching
        if (name.includes(searchTerm) || description.includes(searchTerm)) return true;
        
        // Enhanced content matching
        if (richContentManager.hasEnhancedContent(d.id)) {
            const searchableContent = richContentManager.getSearchableContent(d.id);
            if (searchableContent && searchableContent.toLowerCase().includes(searchTerm)) {
                return true;
            }
        }
        
        return false;
    });
    
    // Prioritize enhanced content nodes in results
    const sortedMatches = matches.sort((a, b) => {
        const aHasEnhanced = richContentManager.hasEnhancedContent(a.id);
        const bHasEnhanced = richContentManager.hasEnhancedContent(b.id);
        
        if (aHasEnhanced && !bHasEnhanced) return -1;
        if (!aHasEnhanced && bHasEnhanced) return 1;
        
        // Secondary sort by name match relevance
        const aNameMatch = a.name.toLowerCase().includes(searchTerm);
        const bNameMatch = b.name.toLowerCase().includes(searchTerm);
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        return 0;
    }).slice(0, 6);
    
    // Add synonym matches
    const synonymMatches = [];
    Object.keys(searchSynonyms).forEach(key => {
        if (key.includes(searchTerm) || searchTerm.includes(key)) {
            searchSynonyms[key].forEach(synonym => {
                const synMatches = graphData.nodes.filter(d => 
                    d.name.toLowerCase().includes(synonym.toLowerCase())
                );
                synonymMatches.push(...synMatches);
            });
        }
    });
    
    const allMatches = [...sortedMatches, ...synonymMatches.slice(0, 3)]
        .filter((item, index, arr) => arr.findIndex(i => i.id === item.id) === index)
        .slice(0, 6);
    
    if (allMatches.length === 0) {
        if (searchSuggestions) {
            searchSuggestions.innerHTML = '<div style="padding: 16px; font-size: 0.95em; color: #6b7280; text-align: center; line-height: 1.5;"><strong style="color: #ef4444;">No matches found.</strong><br><span style="color: #9ca3af;">Try: Imam Ali, Tawhid, or Nahj al-Balagha</span></div>';
        }
    } else {
        const suggestions = allMatches.map(d => {
            const typeIcon = {
                'scholar': '📚',
                'book': '📜', 
                'jurisprudence': '⚖️',
                'theology': '🕋',
                'practice': '🤲',
                'verse': '✨',
                'concept': '🌟',
                'contemporary': '🌐'
            }[d.type] || '🔍';
            
            // Check if this node has enhanced content
            const hasEnhanced = richContentManager.hasEnhancedContent(d.id);
            const enhancedIndicator = hasEnhanced ? ' ⭐' : '';
            const enhancedStyle = hasEnhanced ? 'background: linear-gradient(90deg, rgba(244, 198, 79, 0.1) 0%, rgba(40, 86, 163, 0.1) 100%);' : '';
            const enhancedHover = hasEnhanced ? 'rgba(244, 198, 79, 0.2)' : '#f8fafc';
            const enhancedReset = hasEnhanced ? 'rgba(244, 198, 79, 0.1)' : 'white';
            
            // Get quality score if available
            let qualityIndicator = '';
            if (hasEnhanced) {
                const score = richContentManager.getContentQualityScore ? richContentManager.getContentQualityScore(d.id) : null;
                if (score && score >= 8) {
                    qualityIndicator = ` <span style="color: #10b981; font-size: 0.8em;">★${score}</span>`;
                }
            }
            
            return `<div class="suggestion-item ${hasEnhanced ? 'enhanced' : ''}" data-term="${d.name}" style="padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #e5e7eb; transition: all 0.2s ease; role: option; tabindex: 0; ${enhancedStyle}" onmouseover="this.style.backgroundColor='${enhancedHover}'; this.style.borderLeft='4px solid #2856A3'" onmouseout="this.style.backgroundColor='${enhancedReset}'; this.style.borderLeft='none'">
                <div style="font-weight: 600; color: #2856A3; font-size: 0.95em;">${typeIcon} ${d.name}${enhancedIndicator}${qualityIndicator}</div>
                <div style="font-size: 0.85em; color: #6b7280; margin-top: 4px; line-height: 1.4;">${d.description.substring(0, 85)}${d.description.length > 85 ? '...' : ''}</div>
                ${hasEnhanced ? '<div style="font-size: 0.75em; color: #f4c64f; margin-top: 2px;">Enhanced content available</div>' : ''}
            </div>`;
        }).join('');
        
        if (searchSuggestions) {
            searchSuggestions.innerHTML = suggestions;
        }
    }
    
    if (searchSuggestions) {
        searchSuggestions.style.display = 'block';
    }
}

/**
 * Batch DOM update for search highlighting - minimizes reflows for performance
 * @param {Set} matchingIds - IDs of matching nodes
 * @param {Set} connectedIds - IDs of connected nodes
 */
function batchHighlightUpdate(matchingIds, connectedIds) {
    // Single D3 selection and update for optimal performance
    const nodeSelection = d3.selectAll(".node");
    const labelSelection = d3.selectAll(".node-label");
    const linkSelection = d3.selectAll(".link");
    
    // Batch update all nodes at once
    nodeSelection.style("opacity", d => {
        if (matchingIds.has(d.id)) return 1;
        if (connectedIds.has(d.id)) return 0.6;
        return 0.15;
    });
    
    // Batch update all labels at once
    labelSelection.style("opacity", d => {
        if (matchingIds.has(d.id)) return 1;
        if (connectedIds.has(d.id)) return 0.7;
        return 0.15;
    });
    
    // Batch update all links at once
    linkSelection.style("opacity", l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        
        if (matchingIds.has(sourceId) || matchingIds.has(targetId)) return 0.8;
        if (connectedIds.has(sourceId) && connectedIds.has(targetId)) return 0.4;
        return 0.1;
    });
}

/**
 * Batch DOM update for resetting highlighting - minimizes reflows for performance
 */
function batchResetUpdate() {
    // Single batch update for all visual elements
    d3.selectAll(".node").style("opacity", 1);
    d3.selectAll(".node-label").style("opacity", 1);
    d3.selectAll(".link").style("opacity", 0.3);
}

/**
 * Update suggestion selection visual feedback with ARIA attributes
 * Implementation from monolithic Lines 2119-2155
 */
function updateSuggestionSelection(suggestions) {
    suggestions.forEach((item, index) => {
        if (index === selectedSuggestion) {
            item.style.backgroundColor = '#eff6ff';
            item.style.borderLeft = '4px solid #2856A3';
            item.style.transform = 'translateX(2px)';
            item.setAttribute('aria-selected', 'true');
        } else {
            item.style.backgroundColor = 'white';
            item.style.borderLeft = 'none';
            item.style.transform = 'translateX(0)';
            item.setAttribute('aria-selected', 'false');
        }
    });
}

/**
 * Initialize search functionality with cached DOM elements and graceful degradation
 */
export function initializeSearch() {
    try {
        // Initialize DOMManager cache integration
        DOMManager.initializeCache();
        
        // Get cached DOM elements for optimal performance
        searchInput = DOMManager.getSearchInput();
        searchSuggestions = DOMManager.getSearchSuggestions();
        
        // Feature detection for graceful degradation
        if (!DOMManager.hasFeature('hasSearchSuggestions')) {
            console.warn('⚠️ Search suggestions element not found - suggestions disabled');
        }
        
    } catch (error) {
        console.error('❌ Search initialization failed:', error.message);
        return;
    }
    
    // Add keyboard navigation for suggestions
    searchInput.addEventListener("keydown", function(e) {
        const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedSuggestion = Math.min(selectedSuggestion + 1, suggestions.length - 1);
            updateSuggestionSelection(suggestions);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedSuggestion = Math.max(selectedSuggestion - 1, -1);
            updateSuggestionSelection(suggestions);
        } else if (e.key === 'Enter' && selectedSuggestion >= 0) {
            e.preventDefault();
            suggestions[selectedSuggestion].click();
        } else if (e.key === 'Escape') {
            searchSuggestions.style.display = 'none';
            selectedSuggestion = -1;
        }
    });

    // Input event listener (exact from original)
    searchInput.addEventListener("input", function(e) {
        timeouts.setSearch(() => {
            const searchTerm = e.target.value.toLowerCase().trim();
            showSearchSuggestions(searchTerm);
            
            if (searchTerm) {
                // Enhanced search with content integration
                const matchingNodes = graphData.nodes.filter(d => {
                    const name = d.name.toLowerCase();
                    const description = d.description.toLowerCase();
                    
                    // Direct match in basic content
                    if (name.includes(searchTerm) || description.includes(searchTerm)) return true;
                    
                    // Search in enhanced content if available
                    if (richContentManager.hasEnhancedContent(d.id)) {
                        const searchableContent = richContentManager.getSearchableContent(d.id);
                        if (searchableContent && searchableContent.toLowerCase().includes(searchTerm)) {
                            return true;
                        }
                    }
                    
                    // Fuzzy matching for typos
                    const words = searchTerm.split(' ');
                    return words.some(word => 
                        name.includes(word) || description.includes(word) ||
                        word.length > 3 && (name.includes(word.slice(0, -1)) || description.includes(word.slice(0, -1)))
                    );
                });
                
                // Enhanced highlighting with connection visualization
                const matchingIds = new Set(matchingNodes.map(d => d.id));
                const connectedIds = new Set();
                
                // Include connected nodes for better context
                matchingNodes.forEach(matchNode => {
                    graphData.links.forEach(link => {
                        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                        
                        if (sourceId === matchNode.id) connectedIds.add(targetId);
                        if (targetId === matchNode.id) connectedIds.add(sourceId);
                    });
                });
                
                // Batch DOM update for optimal performance - minimize reflows
                batchHighlightUpdate(matchingIds, connectedIds);
                
                // Show enhanced search notification with content indicators
                const enhancedMatches = matchingNodes.filter(node => richContentManager.hasEnhancedContent(node.id));
                showSearchNotification(searchTerm, matchingNodes.length, enhancedMatches.length);
                
                // Intelligent navigation for search results
                if (matchingNodes.length === 1) {
                    centerNodeInView(matchingNodes[0], null, { width, height, simulation, zoom, svg });
                } else if (matchingNodes.length > 1 && matchingNodes.length <= 5) {
                    // Center on group for small result sets
                    centerOnNodeGroup(matchingNodes, { width, height, simulation, zoom, svg });
                }
                
            } else {
                // Batch DOM update for reset - optimal performance
                batchResetUpdate();
            }
        }, 150); // Debounce search for performance
    });
    
    // Focus event listener (exact from original)
    searchInput.addEventListener("focus", function(e) {
        if (e.target.value.trim() === '') {
            showSearchSuggestions('');
        }
    });
    
    // Blur event listener with graceful degradation
    searchInput.addEventListener("blur", function(e) {
        // Delay hiding to allow clicks on suggestions
        setTimeout(() => {
            if (searchSuggestions) {
                searchSuggestions.style.display = 'none';
            }
        }, 200);
    });
    
    // Handle suggestion clicks with graceful degradation
    if (searchSuggestions) {
        searchSuggestions.addEventListener("click", function(e) {
            const suggestionItem = e.target.closest('.suggestion-item');
            if (suggestionItem) {
                const term = suggestionItem.getAttribute('data-term');
                searchInput.value = term;
                searchSuggestions.style.display = 'none';
                
                // Trigger search
                const event = new Event('input', { bubbles: true });
                searchInput.dispatchEvent(event);
                
                // Focus on the matching node
                const matchingNode = graphData.nodes.find(d => d.name === term);
                if (matchingNode) {
                    centerNodeInView(matchingNode, null, { width, height, simulation, zoom, svg });
                }
            }
        });
    }
    
    console.log("Search functionality initialized");
}