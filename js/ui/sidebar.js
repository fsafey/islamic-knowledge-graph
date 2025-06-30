/**
 * Sidebar UI Module
 * Manages sidebar content and interactions
 * Extracted from monolithic HTML file - maintains exact functionality
 */

import { graphData } from '../data/graph-data.js';
import { determineLearningPath } from './learning-paths.js';
// Note: timeout management handled directly in graph-core.js
import { getNodeName, generateLearningGuidance } from '../utils/graph-utils.js';
import { DOMManager } from './dom-manager.js';

let sidebarPinned = false;

/**
 * Update sidebar with node information
 * @param {Object} nodeData - The node to display information for
 * @param {boolean} pin - Whether to pin the sidebar content
 */
export function updateSidebar(nodeData, pin = false) {
    try {
        const sidebarContent = DOMManager.getSidebarContent();
        
        // Note: timeout management handled in graph-core.js
        
        if (pin) {
            sidebarPinned = true;
            sidebarContent.setAttribute('data-pinned', 'true');
        }

    // Create enhanced sidebar content
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
                ${nodeData.quote ? createQuoteSection(nodeData) : ''}
                
                <!-- Learning Guidance Section -->
                ${createLearningGuidanceSection(nodeData)}
                
                <!-- Educational Insight -->
                ${nodeData.interestingFact ? createInsightSection(nodeData) : ''}
                
                <!-- Additional Information -->
                ${createAdditionalInfoSection(nodeData)}
            </div>
        </div>
    `;
    } catch (error) {
        console.error('Failed to update sidebar:', error.message);
    }
}

/**
 * Create quote section for verse nodes
 */
function createQuoteSection(nodeData) {
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
 * Create learning guidance section
 */
function createLearningGuidanceSection(nodeData) {
    const guidance = generateLearningGuidance(nodeData);
    
    return `
        <div style="background: rgba(244, 198, 79, 0.1); padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid rgba(244, 198, 79, 0.3);">
            <div style="color: #f4c64f; font-weight: 600; margin-bottom: 12px; font-size: 0.9rem;">🧭 Learning Guidance</div>
            <div style="font-size: 0.85rem; color: rgba(255,255,255,0.8);">${guidance}</div>
        </div>
    `;
}

/**
 * Create insight section
 */
function createInsightSection(nodeData) {
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
 * Create additional information section
 */
function createAdditionalInfoSection(nodeData) {
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

// Note: generateLearningGuidance now imported from utils/graph-utils.js

/**
 * Show default sidebar content
 */
export function showDefaultSidebar() {
    try {
        const sidebarContent = DOMManager.getSidebarContent();
        if (sidebarContent.getAttribute('data-pinned')) return;
        
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
    } catch (error) {
        console.error('Failed to show default sidebar:', error.message);
    }
}

/**
 * Unpin sidebar and reset to default state
 */
export function unpinSidebar() {
    try {
        const sidebarContent = DOMManager.getSidebarContent();
        sidebarContent.removeAttribute('data-pinned');
        sidebarPinned = false;
        showDefaultSidebar();
    } catch (error) {
        console.error('Failed to unpin sidebar:', error.message);
    }
}

// Note: setupHoverDelay functionality moved to graph-core.js for direct timeout management

/**
 * Check if sidebar is currently pinned
 */
export function isSidebarPinned() {
    return sidebarPinned;
}

/**
 * Update sidebar learning path information with persona-aware display
 * @param {Object} nodeData - The node data to display path information for
 */
export function updateSidebarLearningPath(nodeData) {
    const pathInfo = determineLearningPath(nodeData.id, nodeData.type);
    
    // Update progress indicators in sidebar
    const sidebarPathProgress = document.getElementById('sidebarPathProgress');
    const sidebarPathInfo = document.getElementById('sidebarPathInfo');
    
    if (sidebarPathProgress) {
        const totalSteps = pathInfo.totalSteps;
        const currentStep = pathInfo.currentStep;
        
        // Generate persona-aware progress visualization
        let progressHTML = '';
        
        // Handle off-path case
        if (pathInfo.isOffPath) {
            progressHTML = `
                <div style="padding: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; text-align: center;">
                    <div style="color: #ef4444; font-weight: 600; margin-bottom: 4px;">📍 Off Your Path</div>
                    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.8);">This concept isn't part of your selected learning journey</div>
                </div>
            `;
        } else {
            // Normal progress visualization
            for (let i = 1; i <= Math.min(totalSteps, 4); i++) {
                if (i < currentStep) {
                    // Completed step
                    progressHTML += `<div style="width: 20px; height: 20px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">✓</div>`;
                } else if (i === currentStep) {
                    // Current step
                    progressHTML += `<div style="width: 20px; height: 20px; background: #fbbf24; border-radius: 50%; border: 2px solid #fbbf24; display: flex; align-items: center; justify-content: center; color: #0d1117; font-size: 10px; font-weight: bold; animation: pulse 2s infinite;">●</div>`;
                } else {
                    // Future step
                    progressHTML += `<div style="width: 20px; height: 20px; background: #374151; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 10px;">○</div>`;
                }
                
                // Add connector (except for last step)
                if (i < Math.min(totalSteps, 4)) {
                    const connectorColor = i < currentStep ? '#10b981' : (i === currentStep ? '#fbbf24' : '#374151');
                    progressHTML += `<div style="flex: 1; height: 2px; background: ${connectorColor};"></div>`;
                }
            }
        }
        
        sidebarPathProgress.innerHTML = progressHTML;
    }
    
    if (sidebarPathInfo) {
        // Persona-aware path information display
        const personaIcon = {
            "New Muslims": "🌟",
            "Young Adults": "🚀", 
            "Parents & Families": "👨‍👩‍👧‍👦",
            "Students & Academics": "🎓",
            "Working Professionals": "💼", 
            "Spiritual Seekers": "🕊️",
            "Beginners": "📚",
            "Students": "📖",
            "Academics": "🔬"
        };
        
        const difficultyColor = {
            "Beginner": "#22c55e",
            "Intermediate": "#f59e0b", 
            "Advanced": "#ef4444",
            "Beginner to Intermediate": "#84cc16"
        };
        
        const icon = personaIcon[pathInfo.persona] || "📍";
        const diffColor = difficultyColor[pathInfo.difficulty] || "#6b7280";
        
        let infoHTML = `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="font-size: 1.1rem;">${icon}</span>
                    <div>
                        <div style="font-weight: 600; color: #f4c64f; font-size: 0.95rem;">${pathInfo.pathName}</div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                            <span style="background: rgba(244, 198, 79, 0.2); color: #f4c64f; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600;">${pathInfo.persona}</span>
                            <span style="background: rgba(107, 114, 128, 0.2); color: ${diffColor}; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600;">${pathInfo.difficulty}</span>
                            ${pathInfo.contemporary_focus ? '<span style="background: rgba(139, 90, 150, 0.2); color: #8b5a96; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600;">Contemporary</span>' : ''}
                        </div>
                    </div>
                </div>
        `;
        
        // Add use case if available
        if (pathInfo.useCase) {
            infoHTML += `
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.8); line-height: 1.3; margin-bottom: 8px; font-style: italic;">
                    "${pathInfo.useCase}"
                </div>
            `;
        }
        
        // Progress and next step info
        if (pathInfo.isOffPath) {
            infoHTML += `
                <div style="background: rgba(244, 198, 79, 0.1); padding: 8px 12px; border-radius: 6px; border-left: 3px solid #f4c64f;">
                    <strong style="color: #f4c64f; font-size: 0.85rem;">Return to Path</strong><br>
                    <span style="font-size: 0.75rem; color: rgba(255,255,255,0.8);">Continue with "${getNodeName(pathInfo.nextNode)}" to stay on track</span>
                </div>
            `;
        } else if (pathInfo.suggested || pathInfo.isDefaultSuggestion) {
            infoHTML += `
                <div style="color: rgba(255,255,255,0.8); font-size: 0.8rem; margin-bottom: 8px;">
                    💡 <strong>Suggested Path:</strong> Progress ${pathInfo.progress}
                </div>
                ${pathInfo.nextNode ? `
                    <div style="background: rgba(125, 179, 211, 0.1); padding: 8px 12px; border-radius: 6px; border-left: 3px solid #7db3d3;">
                        <strong style="color: #7db3d3; font-size: 0.85rem;">Try This Path</strong><br>
                        <span style="font-size: 0.75rem; color: rgba(255,255,255,0.8);">Start with "${getNodeName(pathInfo.nextNode)}" to explore this learning journey</span>
                    </div>
                ` : ''}
            `;
        } else {
            infoHTML += `
                <div style="color: rgba(255,255,255,0.8); font-size: 0.8rem; margin-bottom: 8px;">
                    📊 Progress: ${pathInfo.progress} • Step ${pathInfo.currentStep} of ${pathInfo.totalSteps}
                </div>
                ${pathInfo.nextNode ? `
                    <div style="background: rgba(46, 204, 113, 0.1); padding: 8px 12px; border-radius: 6px; border-left: 3px solid #2ecc71;">
                        <strong style="color: #2ecc71; font-size: 0.85rem;">Next Step</strong><br>
                        <span style="font-size: 0.75rem; color: rgba(255,255,255,0.8);">Continue to "${getNodeName(pathInfo.nextNode)}"</span>
                    </div>
                ` : `
                    <div style="background: rgba(244, 198, 79, 0.1); padding: 8px 12px; border-radius: 6px; border-left: 3px solid #f4c64f;">
                        <strong style="color: #f4c64f; font-size: 0.85rem;">🎊 Path Complete!</strong><br>
                        <span style="font-size: 0.75rem; color: rgba(255,255,255,0.8);">Consider exploring another learning path</span>
                    </div>
                `}
            `;
        }
        
        infoHTML += '</div>';
        sidebarPathInfo.innerHTML = infoHTML;
    }
    
    // Store current learning path for "Show Path" button
    window.currentLearningPath = pathInfo.pathNodes;
    window.currentLearningPathKey = pathInfo.pathKey;
}

// Note: Relationship explanations removed - using simplified edge tooltips

/**
 * Add research insights and contextual data to enhance panel information
 * @param {Object} nodeData - The node data to generate insights for
 */
export function addResearchInsights(nodeData) {
    const insightContainer = document.getElementById('sidebarInsight');
    const insightText = document.getElementById('sidebarInsightText');
    
    if (!insightContainer || !insightText) return;
    
    // Research insights based on node type and ID
    const researchInsights = {
        // Scholar insights from research reports
        'imam_ali': "As the pinnacle of Islamic scholarship and governance, Imam Ali's influence spans 14 centuries, with his teachings foundational to contemporary Islamic institutions from the Najaf Seminary to modern interfaith dialogue initiatives.",
        'imam_sadiq': "Recognized as the intellectual pinnacle of Shia scholarship, Imam Sadiq established the methodological foundations that directly enable contemporary ijtihad practiced by Grand Ayatollah Sistani and modern Islamic institutions worldwide.",
        'sistani': "At 94 years old, Grand Ayatollah Sistani represents the global authority for 21 million Shia Muslims, demonstrating how traditional religious scholarship adapts to modern challenges through his support for democracy and resistance to extremism.",
        'sheikh_mufid': "The Baghdad Renaissance period under Sheikh al-Mufid (948-1022 CE) established systematic theological methodology that became the intellectual foundation for the Najaf Seminary and modern Islamic scholarly institutions.",
        'allamah_hilli': "The first scholar to hold the title 'Ayatollah,' Allamah Hilli's methodological innovations in the 13th century directly precedent contemporary ijtihad and modern jurisprudential reasoning practiced today.",
        'sheikh_tusi': "Sheikh al-Tusi's establishment of the Najaf Seminary created the institutional foundation that continues today with over 13,000 students from 170+ countries, demonstrating 1,000 years of continuous Islamic education.",
        
        // Contemporary application insights
        'islamic_banking': "With $2 trillion in global assets and 10-12% annual growth, Islamic banking successfully demonstrates how classical Islamic commercial law principles adapt to modern financial systems while maintaining ethical foundations.",
        'najaf_seminary': "Housing over 13,000 students from 170+ countries, the Najaf Seminary represents the unbroken 1,000-year tradition of Islamic education while adapting to contemporary challenges and international academic standards.",
        'medical_ethics_islam': "Islamic medical ethics uniquely integrates traditional moral teachings with cutting-edge biomedical challenges, providing frameworks for organ transplantation, genetic counseling, and pandemic response that respect both religious sensibilities and medical standards.",
        'environmental_ethics_islam': "The Islamic Declaration on Global Climate Change (2015) mobilized 1.6 billion Muslims for environmental action, demonstrating how traditional concepts like Khalifa (stewardship) provide powerful frameworks for addressing climate change.",
        'interfaith_dialogue': "Grand Ayatollah Sistani's historic 2021 meeting with Pope Francis exemplifies how traditional Islamic principles of engaging with 'People of the Book' have evolved into sophisticated frameworks for international cooperation and mutual understanding.",
        'contemporary_ijtihad': "Contemporary ijtihad addresses 21st-century challenges from biomedical ethics to artificial intelligence, demonstrating how traditional Islamic reasoning methodologies established by classical scholars remain relevant for modern jurisprudential needs.",
        
        // Theological concept insights
        'marjaiyyah': "The Marjaiyyah system encompasses over 50 living Grand Ayatollahs globally, providing structured religious guidance for 150-200 million Shia Muslims through a unique decentralized authority system that responds to contemporary community needs.",
        'ijtihad': "Originally developed by classical scholars like Imam Sadiq, ijtihad has evolved to address modern challenges from biotechnology to climate change, with contemporary mujtahids now engaging with cutting-edge scientific research and international frameworks.",
        'tawhid': "The principle of divine unity serves as the foundation for contemporary environmental ethics in Islam, inspiring climate action initiatives and sustainable development projects across the Muslim world.",
        
        // Sacred text insights
        'al_kafi': "One of the 'Four Books' of Shia Islam, Al-Kafi's systematic organization of Islamic knowledge continues to influence contemporary Islamic scholarship and is preserved and studied at modern institutions like the Najaf Seminary.",
        'nahj_balagha': "Recognized as a masterpiece of Arabic rhetoric and governance wisdom, Nahj al-Balagha's principles continue to influence contemporary Islamic political thought and leadership approaches worldwide.",
        'quran': "The Holy Quran's environmental stewardship principles now inspire contemporary Islamic climate action, with religious authorities citing Quranic teachings in support of renewable energy transitions and sustainable development.",
        
        // Practice insights
        'salah': "The five daily prayers represent a comprehensive spiritual discipline that contemporary Muslim communities maintain globally, with digital platforms now enabling prayer time calculations and guidance for 1.6 billion Muslims worldwide.",
        'hajj': "The annual Hajj pilgrimage continues to serve as the pinnacle spiritual practice, now incorporating modern technology and international coordination to facilitate religious observance for millions of pilgrims from 180+ countries.",
        'khums': "The distinctive Shia financial obligation of khums has found contemporary application in Islamic banking systems, with modern institutions developing sophisticated mechanisms for collection and distribution according to traditional principles."
    };
    
    const insight = researchInsights[nodeData.id];
    if (insight) {
        insightText.textContent = insight;
        insightContainer.style.display = 'block';
    } else {
        // Default insight for unmapped nodes
        const typeInsights = {
            'scholar': 'This Islamic scholar contributed to the rich tradition of learning that continues to influence contemporary Islamic institutions and thought.',
            'book': 'This text represents part of the extensive Islamic literary tradition that provides guidance for both classical and contemporary scholarship.',
            'contemporary': 'This contemporary application demonstrates how traditional Islamic principles continue to provide frameworks for addressing modern challenges.',
            'concept': 'This Islamic concept continues to evolve through contemporary scholarly interpretation and practical application in modern Muslim communities.',
            'practice': 'This Islamic practice maintains its spiritual significance while adapting to contemporary contexts and technological innovations.'
        };
        
        const defaultInsight = typeInsights[nodeData.type] || 'This element represents an important component of the interconnected network of Islamic scholarship and practice.';
        insightText.textContent = defaultInsight;
        insightContainer.style.display = 'block';
    }
    
    // Add contextual connections information
    const connections = graphData.links.filter(link => 
        (typeof link.source === 'object' ? link.source.id : link.source) === nodeData.id ||
        (typeof link.target === 'object' ? link.target.id : link.target) === nodeData.id
    );
    
    if (connections.length > 0) {
        // Add connection count and types
        const connectionTypes = [...new Set(connections.map(link => link.type))];
        const connectionInfo = document.createElement('div');
        connectionInfo.style.cssText = `
            margin-top: 12px; 
            padding: 8px 12px; 
            background: rgba(125, 179, 211, 0.1); 
            border-radius: 6px; 
            border-left: 3px solid #7db3d3;
            font-size: 0.8rem;
        `;
        connectionInfo.innerHTML = `
            <strong style="color: #7db3d3;">🔗 Connections:</strong> ${connections.length} relationships
            <div style="margin-top: 4px; color: rgba(255,255,255,0.7);">${connectionTypes.slice(0, 3).join(', ')}${connectionTypes.length > 3 ? '...' : ''}</div>
        `;
        insightContainer.appendChild(connectionInfo);
    }
}

/**
 * Update learning path visuals when node is hovered
 * @param {Object} nodeData - The node data to update path display for
 */
export function updateLearningPathDisplay(nodeData) {
    const pathInfo = determineLearningPath(nodeData.id, nodeData.type);
    
    // Update progress indicators
    const progressContainer = document.getElementById('learningPathProgress');
    if (progressContainer) {
        const totalSteps = pathInfo.totalSteps;
        const currentStep = pathInfo.currentStep;
        
        // Generate progress visualization
        let progressHTML = '';
        for (let i = 1; i <= Math.min(totalSteps, 4); i++) {
            if (i < currentStep) {
                // Completed step
                progressHTML += `<div style="width: 24px; height: 24px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">✓</div>`;
            } else if (i === currentStep) {
                // Current step
                progressHTML += `<div style="width: 24px; height: 24px; background: #fbbf24; border-radius: 50%; border: 2px solid #fbbf24; display: flex; align-items: center; justify-content: center; color: #0d1117; font-size: 10px; font-weight: bold; animation: pulse 2s infinite;">●</div>`;
            } else {
                // Future step
                progressHTML += `<div style="width: 24px; height: 24px; background: #374151; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 10px;">○</div>`;
            }
            
            // Add connector (except for last step)
            if (i < Math.min(totalSteps, 4)) {
                const connectorColor = i < currentStep ? '#10b981' : (i === currentStep ? '#fbbf24' : '#374151');
                progressHTML += `<div style="flex: 1; height: 2px; background: ${connectorColor};"></div>`;
            }
        }
        
        progressContainer.innerHTML = progressHTML;
    }
    
    // Update progress text
    const progressText = document.getElementById('pathProgressText');
    if (progressText) {
        const nextNodeName = pathInfo.nextNode ? 
            graphData.nodes.find(n => n.id === pathInfo.nextNode)?.name || 'Next Topic' : 
            'Path Complete';
            
        progressText.innerHTML = `
            Progress: ${pathInfo.progress} completed • Current: <span style="color: #fbbf24; font-weight: 600;">${nodeData.name}</span> • Next: <span style="color: #10b981;">${nextNodeName}</span>
        `;
    }
}

/**
 * Show node information - external access function
 * @param {Object} d - The node data to show information for
 */
export function showNodeInfo(d) {
    // This would trigger the mouseover effect programmatically
    // Implementation depends on the graph visualization library being used
    console.log('showNodeInfo called for node:', d.id);
    updateSidebar(d, true);
}

/**
 * Toggle mobile sidebar visibility
 */
export function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
    
    if (sidebar) {
        const isOpen = sidebar.classList.contains('mobile-open');
        if (isOpen) {
            sidebar.classList.remove('mobile-open');
            if (toggleBtn) {
                toggleBtn.textContent = '📚';
                toggleBtn.setAttribute('aria-label', 'Open sidebar');
            }
        } else {
            sidebar.classList.add('mobile-open');
            if (toggleBtn) {
                toggleBtn.textContent = '✕';
                toggleBtn.setAttribute('aria-label', 'Close sidebar');
            }
        }
    }
}

// Note: getNodeName now imported from utils/graph-utils.js

/**
 * Initialize sidebar with default content
 */
export function initializeSidebar() {
    showDefaultSidebar();
    
    // Set up click outside to unpin
    document.addEventListener('click', (event) => {
        const sidebar = document.getElementById('graphSidebar');
        const clickedInsideSidebar = sidebar && sidebar.contains(event.target);
        const clickedOnNode = event.target.classList.contains('node');
        
        if (!clickedInsideSidebar && !clickedOnNode && sidebarPinned) {
            unpinSidebar();
        }
    });
    
    // Set up mobile sidebar close on outside click
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
        
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('mobile-open')) {
            if (!sidebar.contains(event.target) && !toggleBtn?.contains(event.target)) {
                sidebar.classList.remove('mobile-open');
                if (toggleBtn) {
                    toggleBtn.textContent = '📚';
                    toggleBtn.setAttribute('aria-label', 'Open sidebar');
                }
            }
        }
    });
    
    // Handle window resize for mobile responsiveness
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
        
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('mobile-open');
            if (toggleBtn) {
                toggleBtn.textContent = '📚';
                toggleBtn.setAttribute('aria-label', 'Open sidebar');
            }
        }
    });
}