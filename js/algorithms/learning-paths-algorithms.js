/**
 * @fileoverview Learning Paths Algorithm Layer
 * @version 1.0.0
 * 
 * Purpose: Path calculation and guidance generation algorithms
 * Dependencies: learning-paths-data.js, graph-data.js, graph-utils.js
 * Exports: Path determination, guidance generation, progress visualization
 */

import { learningPaths, getDidYouKnowFact } from '../data/learning-paths-data.js';
import { graphData } from '../data/graph-data.js';
import { getNodeName } from '../utils/graph-utils.js';

/**
 * Dynamic path determination based on current node and selected persona
 * Exact duplication from original determineLearningPath function
 */
export function determineLearningPath(nodeId, nodeType, selectedPersona) {
    // Priority 1: Check if we have a selected persona-based path
    if (window.currentLearningPathInfo && window.currentLearningPath) {
        const pathInfo = window.currentLearningPathInfo;
        const pathNodes = window.currentLearningPath;
        
        if (pathNodes.includes(nodeId)) {
            const currentIndex = pathNodes.indexOf(nodeId);
            const totalSteps = pathNodes.length;
            const completed = currentIndex;
            const nextNode = currentIndex < totalSteps - 1 ? pathNodes[currentIndex + 1] : null;
            
            return {
                pathName: pathInfo.name,
                persona: pathInfo.persona,
                difficulty: pathInfo.difficulty,
                useCase: pathInfo.useCase,
                contemporary_focus: pathInfo.contemporary_focus,
                progress: `${completed}/${totalSteps}`,
                currentStep: currentIndex + 1,
                totalSteps: totalSteps,
                nextNode: nextNode,
                pathNodes: pathNodes,
                pathKey: window.currentLearningPathKey
            };
        } else {
            // Node not in selected path - suggest returning to path
            return {
                pathName: pathInfo.name,
                persona: pathInfo.persona,
                difficulty: pathInfo.difficulty,
                useCase: pathInfo.useCase,
                contemporary_focus: pathInfo.contemporary_focus,
                progress: "off-path",
                currentStep: 0,
                totalSteps: pathNodes.length,
                nextNode: pathNodes[0],
                pathNodes: pathNodes,
                pathKey: window.currentLearningPathKey,
                isOffPath: true
            };
        }
    }
    
    // Priority 2: Check if node exists in any persona-based path
    for (const [pathKey, path] of Object.entries(learningPaths)) {
        if (path.nodes.includes(nodeId)) {
            const currentIndex = path.nodes.indexOf(nodeId);
            const totalSteps = path.nodes.length;
            const completed = currentIndex;
            const nextNode = currentIndex < totalSteps - 1 ? path.nodes[currentIndex + 1] : null;
            
            return {
                pathName: path.name,
                persona: path.persona,
                difficulty: path.difficulty,
                useCase: path.useCase,
                contemporary_focus: path.contemporary_focus,
                progress: `${completed}/${totalSteps}`,
                currentStep: currentIndex + 1,
                totalSteps: totalSteps,
                nextNode: nextNode,
                pathNodes: path.nodes,
                pathKey: pathKey,
                suggested: true // This path is suggested, not actively selected
            };
        }
    }
    
    // Priority 3: Suggest most relevant persona-based path based on node type and contemporary nature
    const nodeData = graphData.nodes.find(n => n.id === nodeId);
    const isContemporary = nodeData && nodeData.type === 'contemporary';
    
    let suggestedPathKey;
    if (isContemporary) {
        // For contemporary nodes, suggest professional ethics or young adult paths
        suggestedPathKey = "professional_ethics_path";
    } else {
        // Default suggestions based on node type
        const typeBasedSuggestions = {
            "theology": "new_muslim_foundations",
            "jurisprudence": "student_academic_path", 
            "scholar": "classical_scholarship",
            "practice": "spiritual_seeker_path",
            "book": "student_academic_path",
            "concept": "new_muslim_foundations"
        };
        suggestedPathKey = typeBasedSuggestions[nodeType] || "new_muslim_foundations";
    }
    
    const suggestedPath = learningPaths[suggestedPathKey];
    return {
        pathName: suggestedPath.name,
        persona: suggestedPath.persona,
        difficulty: suggestedPath.difficulty,
        useCase: suggestedPath.useCase,
        contemporary_focus: suggestedPath.contemporary_focus,
        progress: "0/" + suggestedPath.nodes.length,
        currentStep: 1,
        totalSteps: suggestedPath.nodes.length,
        nextNode: suggestedPath.nodes[0],
        pathNodes: suggestedPath.nodes,
        pathKey: suggestedPathKey,
        suggested: true,
        isDefaultSuggestion: true
    };
}

/**
 * Generate learning guidance based on current node
 * Exact duplication from original generateLearningGuidance function
 */
export function generateLearningGuidance(currentNode) {
    // Check if user has selected a learning path from header interface
    if (window.currentLearningPathInfo && window.currentLearningPath) {
        return generateContextAwareLearningGuidance(currentNode);
    }
    
    // Fallback to generic guidance if no learning path selected
    const learningGuidanceMap = {
        // Scholars - guide to their works and students
        "imam_ali": {
            question: "Want to explore Imam Ali's teachings?",
            suggestions: [
                {node: "nahj_balagha", reason: "Read his most famous collection of sermons and letters"},
                {node: "justice_governance", reason: "Understand his revolutionary approach to leadership"},
                {node: "verse_wilayah", reason: "See the Quranic basis for his authority"}
            ]
        },
        "imam_sadiq": {
            question: "Interested in the foundations of Islamic law?",
            suggestions: [
                {node: "usul_fiqh", reason: "Learn the methodology he established"},
                {node: "al_kafi", reason: "Explore the hadith collection containing his teachings"},
                {node: "ijtihad", reason: "Understand his approach to legal reasoning"}
            ]
        },
        "sheikh_mufid": {
            question: "Want to understand classical Shia scholarship?",
            suggestions: [
                {node: "al_irshad", reason: "Read his biographical work on the Imams"},
                {node: "sharif_murtada", reason: "Meet his most famous student"},
                {node: "sheikh_tusi", reason: "See how his teachings continued through his students"}
            ]
        },
        "al_kulayni": {
            question: "Curious about how Islamic traditions were preserved?",
            suggestions: [
                {node: "al_kafi", reason: "Explore his monumental hadith collection"},
                {node: "hadith_authentication", reason: "Learn how he verified traditions"},
                {node: "imam_sadiq", reason: "See the main source of his narrations"}
            ]
        },
        "sistani": {
            question: "Want to understand contemporary Islamic authority?",
            suggestions: [
                {node: "marjaiyyah", reason: "Learn about the religious authority system"},
                {node: "taqlid", reason: "Understand how believers follow religious guidance"},
                {node: "najaf_seminary", reason: "Explore the center of his scholarly training"}
            ]
        },
        
        // Books - guide to authors and related concepts
        "nahj_balagha": {
            question: "Ready to dive into Islamic political philosophy?",
            suggestions: [
                {node: "imam_ali", reason: "Meet the author of these teachings"},
                {node: "justice_governance", reason: "Explore the governance principles contained within"},
                {node: "sermon_shiqshiqiya", reason: "Read one of the most famous sermons"}
            ]
        },
        "al_kafi": {
            question: "Want to understand the foundations of Shia practice?",
            suggestions: [
                {node: "al_kulayni", reason: "Meet the scholar who compiled this collection"},
                {node: "imam_sadiq", reason: "Explore the main source of these teachings"},
                {node: "hadith_authentication", reason: "Learn how these traditions were verified"}
            ]
        },
        "al_irshad": {
            question: "Interested in the lives of the Twelve Imams?",
            suggestions: [
                {node: "sheikh_mufid", reason: "Meet the author of this biographical work"},
                {node: "imam_ali", reason: "Start with the First Imam's biography"},
                {node: "imam_mahdi", reason: "Learn about the Twelfth Imam in occultation"}
            ]
        },
        "quran": {
            question: "Want to explore Islamic theology and law?",
            suggestions: [
                {node: "tawhid", reason: "Understand the core concept of Divine Unity"},
                {node: "verse_wilayah", reason: "Read the verse about divine authority"},
                {node: "verse_tathir", reason: "Explore the verse about the purified family"}
            ]
        },
        
        // Theological concepts - guide to practical applications
        "tawhid": {
            question: "Want to see how Divine Unity shapes Islamic practice?",
            suggestions: [
                {node: "salah", reason: "See how this belief is expressed in daily prayer"},
                {node: "quran", reason: "Read the source of this fundamental teaching"},
                {node: "imam_ali", reason: "Learn from his teachings on Divine Unity"}
            ]
        },
        "imamate": {
            question: "Curious about the distinctive Shia belief in leadership?",
            suggestions: [
                {node: "imam_ali", reason: "Meet the First Imam"},
                {node: "verse_wilayah", reason: "Read the Quranic foundation for this doctrine"},
                {node: "hadith_ghadir", reason: "Learn about the Prophet's declaration of succession"}
            ]
        },
        "ismah": {
            question: "Want to understand why Imams are considered infallible?",
            suggestions: [
                {node: "verse_tathir", reason: "Read the Quranic basis for purification"},
                {node: "imam_sadiq", reason: "See how this applies to religious guidance"},
                {node: "marjaiyyah", reason: "Understand contemporary religious authority"}
            ]
        },
        
        // Jurisprudential concepts - guide to practical law
        "usul_fiqh": {
            question: "Ready to explore how Islamic law is derived?",
            suggestions: [
                {node: "imam_sadiq", reason: "Meet the founder of this methodology"},
                {node: "aql", reason: "Understand the role of reason in law"},
                {node: "ijtihad", reason: "Learn about independent legal reasoning"}
            ]
        },
        "ijtihad": {
            question: "Interested in how scholars derive new legal rulings?",
            suggestions: [
                {node: "usul_fiqh", reason: "Learn the underlying methodology"},
                {node: "taqlid", reason: "See how ordinary believers benefit from this"},
                {node: "sistani", reason: "Meet a contemporary practitioner"}
            ]
        },
        "taqlid": {
            question: "Want to understand how Islamic guidance reaches believers?",
            suggestions: [
                {node: "marjaiyyah", reason: "Learn about the authority system"},
                {node: "sistani", reason: "Meet a leading contemporary authority"},
                {node: "risalah", reason: "See practical guidance books"}
            ]
        },
        
        // Practices - guide to underlying concepts
        "salah": {
            question: "Want to understand the spiritual foundations of prayer?",
            suggestions: [
                {node: "wudu", reason: "Learn about ritual purification first"},
                {node: "tawhid", reason: "Understand the theological foundation"},
                {node: "dua", reason: "Explore additional forms of prayer"}
            ]
        },
        "hajj": {
            question: "Curious about the spiritual significance of pilgrimage?",
            suggestions: [
                {node: "dua", reason: "Learn the special prayers recited during Hajj"},
                {node: "imam_ali", reason: "Read his teachings on pilgrimage"},
                {node: "mourning", reason: "See how pilgrimage connects to Shia practices"}
            ]
        },
        "mourning": {
            question: "Want to understand this distinctive Shia practice?",
            suggestions: [
                {node: "dua", reason: "Learn the prayers recited during mourning"},
                {node: "imam_ali", reason: "Understand the historical foundation"},
                {node: "intercession", reason: "See the spiritual benefits believed"}
            ]
        },
        
        // Verses - guide to interpretation and context
        "verse_wilayah": {
            question: "Want to understand the interpretation of this verse?",
            suggestions: [
                {node: "imam_ali", reason: "Learn about the person this verse refers to"},
                {node: "imamate", reason: "Understand the doctrine this verse supports"},
                {node: "sheikh_mufid", reason: "Read classical commentary on this verse"}
            ]
        },
        "hadith_ghadir": {
            question: "Curious about this pivotal moment in Islamic history?",
            suggestions: [
                {node: "imam_ali", reason: "Meet the person appointed in this declaration"},
                {node: "imamate", reason: "Understand the doctrine this establishes"},
                {node: "sharif_murtada", reason: "Read scholarly analysis of this event"}
            ]
        },
        "dua_kumayl": {
            question: "Want to explore Islamic spirituality and prayer?",
            suggestions: [
                {node: "imam_ali", reason: "Meet the Imam who taught this prayer"},
                {node: "dua", reason: "Learn about other forms of Islamic prayer"},
                {node: "mourning", reason: "See when this prayer is often recited"}
            ]
        }
    };
    
    const guidance = learningGuidanceMap[currentNode.id];
    if (guidance) {
        let html = `<div style="margin-bottom: 8px; font-weight: 500; color: #f4c64f;">${guidance.question}</div>`;
        guidance.suggestions.forEach(suggestion => {
            html += `
                <div style="margin-bottom: 6px; padding: 6px; background: rgba(255,255,255,0.05); border-radius: 4px; cursor: pointer;" onclick="highlightAndShowNode('${suggestion.node}')">
                    <div style="font-weight: 600; color: #a8c5e8; font-size: 0.8rem;">→ ${getNodeName(suggestion.node)}</div>
                    <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 2px;">${suggestion.reason}</div>
                </div>
            `;
        });
        return html;
    } else {
        // Generic guidance based on node type
        const typeGuidance = {
            scholar: "Explore this scholar's works, students, and teachings to understand their contribution to Islamic knowledge.",
            book: "Consider reading this work or exploring its author and the concepts it discusses.",
            theology: "This theological concept connects to practices, verses, and scholarly interpretations.",
            jurisprudence: "This legal concept is applied in practical Islamic law and contemporary religious guidance.",
            practice: "This practice has theological foundations and specific legal requirements.",
            verse: "This verse has classical interpretations and connects to core Islamic doctrines.",
            concept: "This concept bridges classical scholarship with contemporary Islamic thought."
        };
        return typeGuidance[currentNode.type] || "Explore the connections to discover related concepts and teachings.";
    }
}

/**
 * Generate context-aware learning guidance based on selected learning path
 * Exact duplication from original generateContextAwareLearningGuidance function
 */
export function generateContextAwareLearningGuidance(currentNode) {
    const pathInfo = window.currentLearningPathInfo;
    const pathNodes = window.currentLearningPath;
    const currentNodeId = currentNode.id;
    
    // Find current position in the learning path
    const currentIndex = pathNodes.indexOf(currentNodeId);
    const pathLength = pathNodes.length;
    
    // Persona-specific guidance prefixes
    const personaGuidance = {
        "New Muslims": {
            prefix: "As someone new to Islam",
            encouragement: "Take your time to understand each concept fully",
            icon: "🌟"
        },
        "Young Adults": {
            prefix: "As a young adult navigating modern challenges",
            encouragement: "See how these timeless principles guide contemporary decisions",
            icon: "🚀"
        },
        "Parents & Families": {
            prefix: "As a parent or family member",
            encouragement: "Consider how to share these insights with your loved ones",
            icon: "👨‍👩‍👧‍👦"
        },
        "Students & Academics": {
            prefix: "As an academic or serious student",
            encouragement: "Examine the scholarly methodology and historical development",
            icon: "🎓"
        },
        "Working Professionals": {
            prefix: "As a working professional",
            encouragement: "Apply these ethical principles to your career decisions",
            icon: "💼"
        },
        "Spiritual Seekers": {
            prefix: "As someone seeking deeper spiritual connection",
            encouragement: "Reflect on how this enhances your relationship with Allah",
            icon: "🕊️"
        }
    };
    
    const persona = personaGuidance[pathInfo.persona] || {
        prefix: "As a learner",
        encouragement: "Consider how this concept connects to your spiritual journey",
        icon: "📚"
    };
    
    if (currentIndex === -1) {
        // Node is not in the current learning path
        return `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="font-size: 1.1rem;">${persona.icon}</span>
                    <strong style="color: #ef4444;">📍 Off Your Path</strong>
                </div>
                <div style="font-size: 0.85rem; margin-bottom: 8px;">
                    This concept isn't part of your "${pathInfo.name}" journey selected for <strong>${pathInfo.persona}</strong>.
                </div>
            </div>
            <div style="padding: 12px; background: rgba(244, 198, 79, 0.1); border-radius: 6px; border-left: 3px solid #f4c64f;">
                <strong style="color: #f4c64f;">Return to Your Path</strong><br>
                <span style="font-size: 0.8rem; color: rgba(255,255,255,0.8);">Continue with "${getNodeName(pathNodes[0])}" to stay focused on your "${pathInfo.useCase}" goal.</span>
            </div>
        `;
    }
    
    // Node is in the current learning path - show position and context
    const stepNumber = currentIndex + 1;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === pathLength - 1;
    
    let guidance = `
        <div style="margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 1.1rem;">${persona.icon}</span>
                <strong style="color: #f4c64f;">Step ${stepNumber} of ${pathLength}</strong>
                <span style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">• ${pathInfo.name}</span>
            </div>
        </div>
    `;
    
    // Persona-specific context and encouragement
    guidance += `
        <div style="margin-bottom: 12px; font-size: 0.85rem; color: rgba(255,255,255,0.9); line-height: 1.4;">
            <strong>${persona.prefix}</strong>, ${persona.encouragement.toLowerCase()}.
        </div>
    `;
    
    // Show path context and connections with persona awareness
    if (isFirst) {
        guidance += `
            <div style="background: rgba(34, 197, 94, 0.1); padding: 10px 12px; border-radius: 6px; border-left: 3px solid #22c55e; margin-bottom: 8px;">
                <strong style="color: #22c55e;">🎯 Starting Point</strong><br>
                <span style="font-size: 0.8rem; color: rgba(255,255,255,0.8);">This foundational concept begins your journey toward "${pathInfo.useCase}".</span>
            </div>
        `;
    } else if (isLast) {
        guidance += `
            <div style="background: rgba(244, 198, 79, 0.1); padding: 10px 12px; border-radius: 6px; border-left: 3px solid #f4c64f; margin-bottom: 8px;">
                <strong style="color: #f4c64f;">🎊 Final Destination</strong><br>
                <span style="font-size: 0.8rem; color: rgba(255,255,255,0.8);">You've completed your "${pathInfo.name}" journey!</span>
            </div>
        `;
    } else {
        guidance += `
            <div style="background: rgba(125, 179, 211, 0.1); padding: 10px 12px; border-radius: 6px; border-left: 3px solid #7db3d3; margin-bottom: 8px;">
                <strong style="color: #7db3d3;">🧭 Making Progress</strong><br>
                <span style="font-size: 0.8rem; color: rgba(255,255,255,0.8);">You're building toward mastery of "${pathInfo.useCase}".</span>
            </div>
        `;
    }
    
    // Show previous connection (if not first)
    if (!isFirst) {
        const previousNode = pathNodes[currentIndex - 1];
        guidance += `
            <div style="margin-bottom: 8px; font-size: 0.85rem;">
                <strong style="color: #a8c5e8;">⬅️ Built on:</strong> "${getNodeName(previousNode)}"<br>
                <span style="font-size: 0.75rem; opacity: 0.7;">Each concept builds on the previous foundation</span>
            </div>
        `;
    }
    
    // Show next step (if not last)
    if (!isLast) {
        const nextNode = pathNodes[currentIndex + 1];
        guidance += `
            <div style="padding: 12px; background: rgba(46, 204, 113, 0.1); border-radius: 6px; border-left: 3px solid #2ecc71; margin-top: 8px;">
                <strong style="color: #2ecc71;">➡️ Next Step:</strong> "${getNodeName(nextNode)}"<br>
                <span style="font-size: 0.8rem; color: rgba(255,255,255,0.8);">Continue building your understanding step by step</span>
            </div>
        `;
    } else {
        guidance += `
            <div style="padding: 12px; background: rgba(139, 90, 150, 0.1); border-radius: 6px; border-left: 3px solid #8b5a96; margin-top: 8px;">
                <strong style="color: #8b5a96;">🌟 Path Complete!</strong><br>
                <span style="font-size: 0.8rem; color: rgba(255,255,255,0.8);">Ready to explore another persona-based path or dive deeper into related concepts?</span>
            </div>
        `;
    }
    
    // Add persona-specific connection explanation
    const pathKey = window.currentLearningPathKey;
    const pathSpecificConnections = getPathSpecificConnections(currentNodeId, pathKey, pathNodes);
    if (pathSpecificConnections) {
        guidance += `
            <div style="margin-top: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 6px; border-top: 2px solid rgba(244, 198, 79, 0.4);">
                <strong style="color: #f4c64f;">🔗 Why This Matters for ${pathInfo.persona}:</strong><br>
                <span style="font-size: 0.85rem; color: rgba(255,255,255,0.9); line-height: 1.4; margin-top: 4px; display: block;">${pathSpecificConnections}</span>
            </div>
        `;
    }
    
    return guidance;
}

/**
 * Get path-specific connection explanations
 * Exact duplication from original getPathSpecificConnections function
 */
export function getPathSpecificConnections(nodeId, pathName, pathNodes) {
    const connectionMap = {
        // New Muslim Foundations path connections
        "new_muslim_foundations": {
            "imam_ali": "As the first Imam and cousin of Prophet Muhammad, Imam Ali represents the foundational leadership model for new Muslims to understand.",
            "tawhid": "Divine Unity is the core belief - as a new Muslim, understanding Allah's oneness is your spiritual foundation.",
            "salah": "Prayer connects your belief to daily practice - this is how you maintain your relationship with Allah throughout each day.",
            "contemporary_ijtihad": "Modern reasoning shows Islam is alive and relevant - see how ancient principles guide today's decisions."
        },
        
        // Young Adult Modern Challenges path connections  
        "young_adult_engagement": {
            "contemporary_ijtihad": "This is how Islamic scholars address your generation's unique challenges and questions.",
            "medical_ethics_islam": "Navigate healthcare decisions with Islamic guidance - relevant for your life choices and career considerations.",
            "environmental_ethics_islam": "Your generation faces climate change - discover how Islam motivates environmental action and sustainability.",
            "interfaith_dialogue": "Build bridges in diverse societies - learn how to engage respectfully with people of all backgrounds."
        },
        
        // Parent & Family Guidance path connections
        "parent_family_guidance": {
            "imam_ali": "Study the perfect father and leader - his wisdom on family, justice, and character provides parenting guidance.",
            "nahj_balagha": "This collection contains profound advice on leadership, character, and raising the next generation.",
            "salah": "Teaching prayer to children builds spiritual discipline and creates family bonding through shared worship.",
            "moral_education": "Islamic character development provides frameworks for raising ethical, confident children."
        },
        
        // Academic Islamic Studies path connections
        "student_academic_path": {
            "imam_sadiq": "The scholarly foundation - his methodology established academic rigor in Islamic study that continues today.",
            "usul_fiqh": "Legal methodology is essential for academic analysis - understand how Islamic scholarship actually works.",
            "ijtihad": "Independent reasoning demonstrates Islam's intellectual depth - this is how scholars engage with complex questions.",
            "najaf_seminary": "See academic Islamic education in practice - this 1,000-year institution bridges classical and modern learning."
        },
        
        // Professional Ethics path connections
        "professional_ethics_path": {
            "islamic_banking": "Learn how Islamic principles create ethical alternatives to conventional financial systems in your career.",
            "medical_ethics_islam": "If you work in healthcare, understand how Islamic bioethics guides medical decision-making.",
            "environmental_ethics_islam": "Apply Islamic stewardship principles to environmental challenges in your professional field.",
            "contemporary_ijtihad": "See how Islamic reasoning addresses modern workplace dilemmas and professional ethical challenges."
        },
        
        // Spiritual Seeker path connections  
        "spiritual_seeker_path": {
            "wudu": "Purification prepares your soul - physical cleanliness reflects and enables spiritual clarity.",
            "salah": "Prayer is your direct line to Allah - the core spiritual practice that structures your entire spiritual life.",
            "dua": "Personal supplication deepens intimacy with Allah - beyond formal prayer lies heartfelt conversation.",
            "mourning": "Connecting with Imam Hussain's sacrifice develops empathy and spiritual depth through shared emotion.",
            "hajj": "Pilgrimage represents the culmination of spiritual development - the ultimate journey of purification and unity."
        },
        
        // Legacy path connections (updated for persona awareness)
        "beginner_theology": {
            "tawhid": "Divine Unity is the absolute foundation - without understanding Allah's oneness, no other belief makes sense.",
            "adalah": "Divine Justice builds on Tawhid - since Allah is one and perfect, He must be perfectly just.",
            "imamate": "Divine leadership flows from justice - Allah's justice requires providing guidance through infallible Imams.",
            "ismah": "Infallibility is essential for Imamate - guides must be perfect to fulfill their divine role.",
            "maad": "Resurrection completes the system - ultimate justice requires accountability in the afterlife."
        },
        
        "jurisprudence_journey": {
            "usul_fiqh": "The methodology is your foundation - this determines how all Islamic law is derived.",
            "aql": "Reason works alongside revelation - it's one of the four sources of Islamic law in Shia methodology.",
            "ijtihad": "Independent reasoning applies the methodology - qualified scholars use reason to derive new rulings.",
            "taqlid": "Following scholars makes law accessible - most believers follow experts rather than deriving law themselves.",
            "marjaiyyah": "The authority system organizes modern application - this is how contemporary Islamic law functions."
        },
        
        "classical_scholarship": {
            "imam_sadiq": "The foundation of all Shia scholarship - his teachings shaped everything that followed.",
            "sheikh_mufid": "The bridge to classical scholarship - he systematized and defended early teachings.",
            "sharif_murtada": "The rational defender - he used logic and philosophy to strengthen Shia theology.",
            "sheikh_tusi": "The institution builder - he established the Najaf Seminary that continues today.",
            "allamah_hilli": "The great systematizer - he organized and codified centuries of legal development."
        }
    };
    
    const pathKey = window.currentLearningPathKey;
    return connectionMap[pathKey] && connectionMap[pathKey][nodeId];
}

/**
 * Generate learning path progress HTML visualization
 * Exact duplication from original generateLearningPathProgress function
 */
export function generateLearningPathProgress(pathNodes, currentIndex) {
    let progressHTML = '<div style="margin: 8px 0;">';
    
    pathNodes.forEach((nodeId, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;
        
        let icon = '○';
        let color = 'rgba(255,255,255,0.3)';
        
        if (isCompleted) {
            icon = '✓';
            color = '#4ade80';
        } else if (isCurrent) {
            icon = '●';
            color = '#f4c64f';
        } else {
            icon = '○';
            color = 'rgba(255,255,255,0.5)';
        }
        
        const nodeName = getNodeName(nodeId);
        progressHTML += `
            <div style="display: flex; align-items: center; margin: 4px 0; color: ${color}; font-size: 0.85rem;">
                <span style="margin-right: 8px; font-weight: bold;">${icon}</span>
                <span style="${isCurrent ? 'font-weight: 600;' : ''}">${nodeName}</span>
            </div>
        `;
    });
    
    progressHTML += '</div>';
    return progressHTML;
}