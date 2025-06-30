/**
 * Enhanced Learning Path Modal System
 * Implements rich discovery cards, animated transitions, and sophisticated modal layouts
 * Based on monolithic lines 2768-2944 advanced modal system
 */

import { learningPaths } from '../data/learning-paths-data.js';
import { selectLearningPath } from './learning-paths.js';
import { createAdvancedNotification } from './notifications.js';

// Modal state management
let isModalOpen = false;
let currentModalContent = null;
let modalAnimationTimeout = null;

/**
 * Enhanced learning path discovery cards with sophisticated styling
 */
const discoveryCards = [
    {
        id: 'scholarly_lineages',
        title: '🎓 Scholarly Lineages',
        path: 'Sheikh al-Mufid → Sharif al-Murtada → Sheikh al-Tusi',
        description: 'Trace how Islamic knowledge was transmitted from teacher to student across generations.',
        color: '#2856A3',
        gradient: 'linear-gradient(135deg, #2856A3 0%, #7db3d3 100%)',
        icon: '📚'
    },
    {
        id: 'understanding_law',
        title: '⚖️ Understanding Islamic Law',
        path: 'Usul al-Fiqh → Ijtihad → Taqlid → Khums',
        description: 'Understand how Islamic legal principles are derived and applied in practice.',
        color: '#f4c64f',
        gradient: 'linear-gradient(135deg, #f4c64f 0%, #e6b566 100%)',
        icon: '⚖️'
    },
    {
        id: 'foundational_beliefs',
        title: '🕌 Foundational Beliefs',
        path: 'Tawhid → Imamate → Wilayah → Adalah',
        description: 'Discover how core theological principles interconnect and shape Islamic thought.',
        color: '#d4a574',
        gradient: 'linear-gradient(135deg, #d4a574 0%, #c49660 100%)',
        icon: '🕌'
    },
    {
        id: 'sacred_texts',
        title: '📚 Sacred Texts & Literature',
        path: 'Holy Quran → Nahj al-Balagha → Al-Kafi → Verse of Wilayah',
        description: 'Follow connections between primary sources and their scholarly interpretations.',
        color: '#7db3d3',
        gradient: 'linear-gradient(135deg, #7db3d3 0%, #a8c5e8 100%)',
        icon: '📜'
    },
    {
        id: 'spiritual_practices',
        title: '🤲 Spiritual Practices',
        path: 'Salah → Wudu → Du\'a Kumayl → Mourning Rituals',
        description: 'See how Islamic practices connect to theological principles and scholarly guidance.',
        color: '#5a9b97',
        gradient: 'linear-gradient(135deg, #5a9b97 0%, #7ec8c3 100%)',
        icon: '🤲'
    },
    {
        id: 'advanced_concepts',
        title: '🌟 Advanced Concepts',
        path: 'Marjaiyyah → Occultation → Justice in Governance → Intercession',
        description: 'Engage with complex theological and philosophical concepts about leadership and authority.',
        color: '#4a5568',
        gradient: 'linear-gradient(135deg, #4a5568 0%, #718096 100%)',
        icon: '🌟'
    },
    {
        id: 'historical_development',
        title: '📜 Historical Development',
        path: 'Imam Sadiq → Al-Kafi → Hadith Authentication → Sistani',
        description: 'Trace how classical teachings evolved into contemporary religious guidance.',
        color: '#e6b566',
        gradient: 'linear-gradient(135deg, #e6b566 0%, #f4d03f 100%)',
        icon: '📚'
    },
    {
        id: 'theory_to_practice',
        title: '🔄 Theory to Practice',
        path: 'Verse of Wilayah → Imamate → Taqlid → Risalah Amaliyyah',
        description: 'See how Quranic verses transform into practical religious guidance for daily life.',
        color: '#8b5a96',
        gradient: 'linear-gradient(135deg, #8b5a96 0%, #b19cd9 100%)',
        icon: '🔄'
    }
];

/**
 * User type configurations for persona-based learning
 */
const userTypeConfig = {
    'new_muslims': {
        title: '🎓 For New Muslims',
        subtitle: 'Start with fundamental concepts and daily practices',
        color: '#2e8b57',
        recommendations: ['imam_ali', 'tawhid', 'salah', 'nahj_balagha']
    },
    'students': {
        title: '📚 For Students',
        subtitle: 'Trace scholarly lineages and jurisprudence development',
        color: '#f4c64f',
        recommendations: ['imam_sadiq', 'usul_fiqh', 'ijtihad', 'al_kafi']
    },
    'scholars': {
        title: '🔍 For Researchers',
        subtitle: 'Investigate complex theological relationships',
        color: '#8b7355',
        recommendations: ['imamate', 'wilayah', 'adalah', 'marjaiyyah']
    },
    'young_adults': {
        title: '🌟 For Young Adults',
        subtitle: 'Connect classical teachings to modern life',
        color: '#8b5a96',
        recommendations: ['contemporary_ijtihad', 'sistani', 'youth_guidance', 'modern_challenges']
    },
    'professionals': {
        title: '💼 For Working Professionals',
        subtitle: 'Apply Islamic principles to professional life',
        color: '#2856A3',
        recommendations: ['ethics_work', 'islamic_economics', 'leadership', 'social_justice']
    },
    'parents': {
        title: '👨‍👩‍👧‍👦 For Parents & Families',
        subtitle: 'Guidance for raising Muslim families',
        color: '#5a9b97',
        recommendations: ['family_guidance', 'child_education', 'family_prayers', 'moral_development']
    },
    'seekers': {
        title: '🔍 For Spiritual Seekers',
        subtitle: 'Deepen spiritual understanding and practice',
        color: '#d4a574',
        recommendations: ['spiritual_development', 'mysticism', 'inner_purification', 'divine_connection']
    }
};

/**
 * Create and show enhanced learning path modal
 */
export function showEnhancedModal() {
    if (isModalOpen) return;
    
    const modal = createEnhancedModalElement();
    document.body.appendChild(modal);
    isModalOpen = true;
    currentModalContent = modal;
    
    // Animate in with sophisticated transition
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    });
    
    // Setup escape key handler
    document.addEventListener('keydown', handleModalKeydown);
}

/**
 * Create sophisticated modal element with rich content
 */
function createEnhancedModalElement() {
    const modal = document.createElement('div');
    modal.className = 'enhanced-modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        z-index: 20000;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.320, 1.275);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        overflow-y: auto;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
            border-radius: 20px;
            max-width: 1200px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            transform: scale(0.9);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.320, 1.275);
            position: relative;
        ">
            ${generateModalHeader()}
            ${generateUserTypeSection()}
            ${generateDiscoverySection()}
            ${generateQuickTipsSection()}
            ${generateCallToActionSection()}
        </div>
    `;
    
    // Add event listeners
    modal.addEventListener('click', handleModalBackdropClick);
    modal.querySelector('.modal-close').addEventListener('click', closeEnhancedModal);
    
    // Add discovery card event listeners
    modal.querySelectorAll('.discovery-card').forEach(card => {
        card.addEventListener('click', handleDiscoveryCardClick);
    });
    
    // Add user type card event listeners
    modal.querySelectorAll('.user-type-card').forEach(card => {
        card.addEventListener('click', handleUserTypeClick);
    });
    
    return modal;
}

/**
 * Generate modal header with sophisticated styling
 */
function generateModalHeader() {
    return `
        <div style="padding: 40px 40px 0 40px; text-align: center; position: relative;">
            <button class="modal-close" style="
                position: absolute;
                top: 20px;
                right: 20px;
                background: none;
                border: none;
                font-size: 2rem;
                color: #666;
                cursor: pointer;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            " onmouseover="this.style.background='rgba(0,0,0,0.1)'" onmouseout="this.style.background='none'">
                ×
            </button>
            
            <h2 style="
                color: #2856A3;
                font-size: 2rem;
                margin: 0 0 16px 0;
                font-weight: 700;
                background: linear-gradient(135deg, #2856A3 0%, #f4c64f 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            ">
                🎓 Choose Your Learning Journey
            </h2>
            
            <p style="
                color: #555;
                font-size: 1.1rem;
                line-height: 1.6;
                margin: 0 0 32px 0;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            ">
                Discover Islamic scholarship through guided pathways tailored to your background and interests.
            </p>
        </div>
    `;
}

/**
 * Generate user type selection section
 */
function generateUserTypeSection() {
    return `
        <div style="padding: 0 40px 32px 40px;">
            <h3 style="
                color: #2856A3;
                font-size: 1.5rem;
                margin: 0 0 24px 0;
                font-weight: 700;
                text-align: center;
            ">
                👥 What Describes You Best?
            </h3>
            
            <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 16px;
                margin-bottom: 40px;
            ">
                ${Object.entries(userTypeConfig).map(([key, config]) => `
                    <div class="user-type-card" data-type="${key}" style="
                        background: white;
                        padding: 20px;
                        border-radius: 12px;
                        border-left: 4px solid ${config.color};
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                        cursor: pointer;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    " onmouseover="
                        this.style.transform='translateY(-2px)';
                        this.style.boxShadow='0 8px 24px rgba(0, 0, 0, 0.12)';
                    " onmouseout="
                        this.style.transform='translateY(0)';
                        this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.08)';
                    ">
                        <h4 style="
                            color: ${config.color};
                            margin: 0 0 8px 0;
                            font-size: 1.1rem;
                            font-weight: 700;
                        ">
                            ${config.title}
                        </h4>
                        <p style="
                            margin: 0 0 12px 0;
                            font-size: 0.9rem;
                            color: #666;
                            line-height: 1.4;
                        ">
                            ${config.subtitle}
                        </p>
                        <div style="
                            background: rgba(${config.color.replace('#', '')}, 0.1);
                            padding: 8px 12px;
                            border-radius: 6px;
                            font-size: 0.8rem;
                            color: ${config.color};
                        ">
                            Click to see recommended path →
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Generate discovery cards section
 */
function generateDiscoverySection() {
    return `
        <div style="padding: 0 40px 32px 40px;">
            <h3 style="
                color: #2856A3;
                font-size: 1.5rem;
                margin: 0 0 24px 0;
                font-weight: 700;
                text-align: center;
            ">
                🔍 Discover Knowledge Connections
            </h3>
            
            <p style="
                text-align: center;
                margin: 0 0 24px 0;
                color: #666;
                font-size: 0.95rem;
                line-height: 1.5;
            ">
                Explore specific research paths that demonstrate how Islamic scholarship interconnects across centuries:
            </p>
            
            <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: 16px;
            ">
                ${discoveryCards.map(card => `
                    <div class="discovery-card" data-card-id="${card.id}" style="
                        background: ${card.gradient};
                        padding: 20px;
                        border-radius: 12px;
                        color: white;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    " onmouseover="
                        this.style.transform='translateY(-2px) scale(1.02)';
                        this.style.boxShadow='0 12px 32px rgba(0, 0, 0, 0.15)';
                    " onmouseout="
                        this.style.transform='translateY(0) scale(1)';
                        this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.1)';
                    ">
                        <div style="
                            position: absolute;
                            top: -20px;
                            right: -20px;
                            font-size: 4rem;
                            opacity: 0.2;
                        ">
                            ${card.icon}
                        </div>
                        
                        <h4 style="
                            margin: 0 0 12px 0;
                            font-size: 1.1rem;
                            font-weight: 700;
                            position: relative;
                            z-index: 1;
                        ">
                            ${card.title}
                        </h4>
                        
                        <div style="
                            font-size: 0.85rem;
                            margin: 0 0 12px 0;
                            background: rgba(255, 255, 255, 0.2);
                            padding: 8px 12px;
                            border-radius: 6px;
                            font-weight: 600;
                            position: relative;
                            z-index: 1;
                        ">
                            ${card.path}
                        </div>
                        
                        <p style="
                            margin: 0;
                            font-size: 0.8rem;
                            line-height: 1.4;
                            opacity: 0.9;
                            position: relative;
                            z-index: 1;
                        ">
                            ${card.description}
                        </p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Generate quick tips section
 */
function generateQuickTipsSection() {
    return `
        <div style="padding: 0 40px 32px 40px;">
            <div style="
                background: rgba(125, 179, 211, 0.1);
                padding: 20px;
                border-radius: 12px;
                border: 1px solid rgba(125, 179, 211, 0.2);
                text-align: center;
            ">
                <h4 style="
                    color: #2856A3;
                    margin: 0 0 12px 0;
                    font-size: 1.125rem;
                    font-weight: 700;
                ">
                    ⌨️ Quick Access Tips
                </h4>
                <div style="
                    font-size: 0.95rem;
                    color: #555;
                    line-height: 1.5;
                ">
                    Press <strong style="
                        background: rgba(40, 86, 163, 0.1);
                        padding: 2px 6px;
                        border-radius: 4px;
                        color: #2856A3;
                    ">"/"</strong> to search instantly • 
                    <strong style="
                        background: rgba(40, 86, 163, 0.1);
                        padding: 2px 6px;
                        border-radius: 4px;
                        color: #2856A3;
                    ">"?"</strong> for help • 
                    <strong style="
                        background: rgba(40, 86, 163, 0.1);
                        padding: 2px 6px;
                        border-radius: 4px;
                        color: #2856A3;
                    ">"Escape"</strong> to reset view
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate call-to-action section
 */
function generateCallToActionSection() {
    return `
        <div style="padding: 0 40px 40px 40px;">
            <div style="
                background: linear-gradient(135deg, rgba(125, 179, 211, 0.15) 0%, rgba(244, 198, 79, 0.15) 100%);
                padding: 24px;
                border-radius: 16px;
                border: 1px solid rgba(125, 179, 211, 0.3);
                text-align: center;
            ">
                <p style="
                    margin: 0 0 16px 0;
                    color: #2856A3;
                    font-weight: 600;
                    font-size: 1.2rem;
                ">
                    💡 <strong>Ready to Explore?</strong>
                </p>
                <p style="
                    margin: 0 0 24px 0;
                    color: #555;
                    line-height: 1.6;
                    font-size: 0.95rem;
                ">
                    Choose a learning path above or close this modal to search for any concept. 
                    Hover over nodes to see details, click to explore connections. 
                    Each link reveals how Islamic knowledge developed across centuries.
                </p>
                
                <button onclick="closeEnhancedModal()" style="
                    background: linear-gradient(135deg, #2856A3 0%, #f4c64f 100%);
                    color: white;
                    border: none;
                    padding: 16px 32px;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(40, 86, 163, 0.3);
                " onmouseover="
                    this.style.transform='translateY(-2px)';
                    this.style.boxShadow='0 8px 24px rgba(40, 86, 163, 0.4)';
                " onmouseout="
                    this.style.transform='translateY(0)';
                    this.style.boxShadow='0 4px 16px rgba(40, 86, 163, 0.3)';
                ">
                    Start Exploring →
                </button>
            </div>
        </div>
    `;
}

/**
 * Handle discovery card clicks
 */
function handleDiscoveryCardClick(event) {
    const cardId = event.currentTarget.dataset.cardId;
    const card = discoveryCards.find(c => c.id === cardId);
    
    if (card) {
        // Extract node IDs from path
        const pathNodes = extractNodeIdsFromPath(card.path);
        
        createAdvancedNotification(`Exploring: ${card.title}`, 'learning', {
            subtitle: `Following path: ${card.path}`,
            duration: 4000
        });
        
        // Create custom learning path
        const customPath = {
            name: card.title,
            description: card.description,
            nodes: pathNodes,
            persona: 'Discovery Path',
            difficulty: 'Varies'
        };
        
        // Set as current learning path
        window.currentLearningPath = pathNodes;
        window.currentLearningPathInfo = customPath;
        
        closeEnhancedModal();
        
        // Highlight path on graph after modal closes
        setTimeout(() => {
            if (window.highlightLearningPath) {
                window.highlightLearningPath(pathNodes);
            }
        }, 500);
    }
}

/**
 * Handle user type card clicks
 */
function handleUserTypeClick(event) {
    const userType = event.currentTarget.dataset.type;
    const config = userTypeConfig[userType];
    
    if (config) {
        createAdvancedNotification(`Selected: ${config.title}`, 'success', {
            subtitle: config.subtitle,
            duration: 4000
        });
        
        // Find matching learning path
        const matchingPath = Object.values(learningPaths).find(path => 
            path.persona?.toLowerCase().includes(userType.replace('_', ' ')) ||
            path.name?.toLowerCase().includes(userType.replace('_', ' '))
        );
        
        if (matchingPath) {
            selectLearningPath(Object.keys(learningPaths).find(key => learningPaths[key] === matchingPath));
        }
        
        closeEnhancedModal();
    }
}

/**
 * Extract node IDs from discovery path string
 */
function extractNodeIdsFromPath(pathString) {
    // This would need to be customized based on actual node naming
    // For now, return a basic implementation
    const nodeNames = pathString.split(' → ').map(name => name.trim());
    return nodeNames.map(name => {
        // Convert to likely node ID format
        return name.toLowerCase()
            .replace(/'/g, '')
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
    });
}

/**
 * Handle modal backdrop clicks
 */
function handleModalBackdropClick(event) {
    if (event.target === event.currentTarget) {
        closeEnhancedModal();
    }
}

/**
 * Handle modal keyboard events
 */
function handleModalKeydown(event) {
    if (event.key === 'Escape') {
        closeEnhancedModal();
    }
}

/**
 * Close enhanced modal with smooth animation
 */
export function closeEnhancedModal() {
    if (!isModalOpen || !currentModalContent) return;
    
    currentModalContent.style.opacity = '0';
    currentModalContent.querySelector('.modal-content').style.transform = 'scale(0.9)';
    
    modalAnimationTimeout = setTimeout(() => {
        if (currentModalContent && currentModalContent.parentNode) {
            currentModalContent.parentNode.removeChild(currentModalContent);
        }
        isModalOpen = false;
        currentModalContent = null;
        document.removeEventListener('keydown', handleModalKeydown);
    }, 400);
}

/**
 * Initialize enhanced modal system
 */
export function initializeEnhancedModal() {
    // Make functions available globally for inline handlers
    window.closeEnhancedModal = closeEnhancedModal;
    
    console.log('✅ Enhanced modal system initialized');
}

// Auto-initialize
initializeEnhancedModal();