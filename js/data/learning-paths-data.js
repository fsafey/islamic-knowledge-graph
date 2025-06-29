/**
 * @fileoverview Learning Paths Data Layer
 * @version 1.0.0
 * 
 * Purpose: Static path definitions and user progress storage
 * Dependencies: None
 * Exports: Path configurations, progress management
 */

// Real learning path configurations from original file
export const learningPaths = {
    "new_muslim_foundations": {
        name: "New Muslim Foundations",
        persona: "New Muslims",
        difficulty: "Beginner", 
        nodes: ["imam_ali", "tawhid", "salah", "contemporary_ijtihad"],
        description: "Start with fundamental concepts like Tawhid and Imamate, then explore their connections to daily practices and contemporary Islamic life.",
        estimatedTime: "2-3 hours",
        contemporary_focus: true,
        useCase: "Understanding basic Islamic concepts and their modern applications"
    },
    "young_adult_engagement": {
        name: "Young Adult Modern Challenges", 
        persona: "Young Adults",
        difficulty: "Intermediate",
        nodes: ["contemporary_ijtihad", "medical_ethics_islam", "environmental_ethics_islam", "interfaith_dialogue"],
        description: "Navigate modern challenges while staying true to Islamic values. Explore how traditional principles guide contemporary decisions.",
        estimatedTime: "3-4 hours",
        contemporary_focus: true,
        useCase: "Applying Islamic principles to modern dilemmas and social issues"
    },
    "parent_family_guidance": {
        name: "Parenting with Islamic Values",
        persona: "Parents & Families", 
        difficulty: "Intermediate",
        nodes: ["imam_ali", "nahj_balagha", "salah", "moral_education"],
        description: "Learn from Imam Ali's wisdom on leadership and character. Discover how to instill Islamic values in family life.",
        estimatedTime: "3-4 hours",
        contemporary_focus: false,
        useCase: "Raising children with strong Islamic character and values"
    },
    "student_academic_path": {
        name: "Academic Islamic Studies",
        persona: "Students & Academics",
        difficulty: "Advanced", 
        nodes: ["imam_sadiq", "usul_fiqh", "ijtihad", "najaf_seminary"],
        description: "Rigorous exploration of Islamic methodology and scholarship. Understand how classical learning connects to modern academic inquiry.",
        estimatedTime: "4-5 hours",
        contemporary_focus: true,
        useCase: "Deep academic understanding of Islamic intellectual tradition"
    },
    "professional_ethics_path": {
        name: "Islamic Professional Ethics",
        persona: "Working Professionals",
        difficulty: "Intermediate",
        nodes: ["islamic_banking", "medical_ethics_islam", "environmental_ethics_islam", "contemporary_ijtihad"],
        description: "Apply Islamic principles in professional settings. Navigate ethical challenges in modern careers with religious guidance.",
        estimatedTime: "3-4 hours", 
        contemporary_focus: true,
        useCase: "Integrating Islamic ethics into professional decision-making"
    },
    "spiritual_seeker_path": {
        name: "Deepening Spiritual Connection",
        persona: "Spiritual Seekers",
        difficulty: "Beginner to Intermediate",
        nodes: ["wudu", "salah", "dua", "mourning", "hajj"],
        description: "Develop a deeper spiritual relationship through Islamic practices. Journey from purification to pilgrimage.",
        estimatedTime: "2-3 hours",
        contemporary_focus: false,
        useCase: "Enhancing personal spirituality and connection with Allah"
    },
    "beginner_theology": {
        name: "Understanding Core Beliefs",
        persona: "Beginners",
        difficulty: "Beginner",
        nodes: ["tawhid", "adalah", "imamate", "ismah", "maad"],
        description: "Master the five principles of Shia faith (Usul al-Din)",
        estimatedTime: "2-3 hours",
        contemporary_focus: false,
        useCase: "Foundational understanding of Shia Islamic beliefs"
    },
    "jurisprudence_journey": {
        name: "Islamic Law Foundations", 
        persona: "Students",
        difficulty: "Intermediate",
        nodes: ["usul_fiqh", "aql", "ijtihad", "taqlid", "marjaiyyah"],
        description: "Explore how Islamic law is derived in Shia methodology",
        estimatedTime: "3-4 hours",
        contemporary_focus: true,
        useCase: "Understanding Islamic legal methodology and authority"
    },
    "classical_scholarship": {
        name: "Major Scholars & Their Works",
        persona: "Academics",
        difficulty: "Advanced",
        nodes: ["imam_sadiq", "sheikh_mufid", "sharif_murtada", "sheikh_tusi", "allamah_hilli"],
        description: "Journey through foundational scholarship chain",
        estimatedTime: "4-5 hours",
        contemporary_focus: false,
        useCase: "Historical development of Islamic scholarship"
    }
};

// Real educational facts from original file
export const didYouKnowFacts = {
    "scholar": [
        "Imam Ja'far as-Sadiq taught over 4,000 students, including founders of Sunni schools",
        "Sheikh al-Tusi founded Najaf Seminary in 1057 CE, still active today after 1000 years",
        "Al-Kulayni spent 20 years compiling Al-Kafi with 16,199 authentic narrations"
    ],
    "book": [
        "Nahj al-Balagha contains 239 sermons, 79 letters, and 489 short sayings",
        "Al-Kafi's 8 volumes form the foundation of Shia jurisprudence and theology",
        "The Holy Quran has been preserved in the same text across all Islamic sects"
    ],
    "theology": [
        "The five principles of Shia faith are: Tawhid, Adalah, Imamate, Ma'ad, and Ismah",
        "Wilayah means both spiritual authority and love/devotion to the Ahl al-Bayt",
        "Barzakh is the intermediate state between death and resurrection"
    ],
    "jurisprudence": [
        "Ijtihad in Shia Islam allows ongoing legal reasoning by qualified scholars",
        "Aql (reason) is uniquely emphasized in Shia legal methodology",
        "Khums (one-fifth tax) helps support religious education and the needy"
    ],
    "practice": [
        "Salah involves specific recitations and movements performed 5 times daily",
        "Mourning rituals for Imam Hussain draw millions to Karbala annually",
        "Du'a Kumayl is recited every Thursday night by devout Shia Muslims"
    ],
    "verse": [
        "The Verse of Wilayah (5:55) is central to Shia beliefs about leadership",
        "Hadith of Ghadir was proclaimed before 100,000+ pilgrims",
        "Verse of Purification (33:33) establishes the special status of Ahl al-Bayt"
    ],
    "concept": [
        "Marjaiyyah system provides contemporary guidance through qualified scholars",
        "Occultation doctrine explains the Twelfth Imam's hidden presence",
        "Hadith authentication uses chains of transmission to verify authenticity"
    ]
};

// Real progress management from original file
export function updatePathProgress(pathKey, currentStep) {
    const path = learningPaths[pathKey];
    const progress = `${currentStep}/${path.nodes.length}`;
    
    localStorage.setItem(`learning_path_${pathKey}`, JSON.stringify({
        progress: currentStep,
        lastVisited: Date.now()
    }));
    
    // Update visible progress indicators
    document.querySelectorAll(`[data-path="${pathKey}"] .path-progress`).forEach(indicator => {
        if (currentStep === 0) {
            indicator.textContent = 'Start';
        } else if (currentStep === path.nodes.length) {
            indicator.textContent = 'Complete';
            indicator.style.background = 'rgba(46, 139, 87, 0.2)';
            indicator.style.color = '#2e8b57';
        } else {
            indicator.textContent = progress;
            indicator.style.background = 'rgba(244, 198, 79, 0.2)';
            indicator.style.color = '#d4a843';
        }
    });
}

export function loadSavedProgress() {
    Object.keys(learningPaths).forEach(pathKey => {
        const saved = localStorage.getItem(`learning_path_${pathKey}`);
        if (saved) {
            const data = JSON.parse(saved);
            updatePathProgress(pathKey, data.progress);
        }
    });
}

export function getDidYouKnowFact(nodeType) {
    const facts = didYouKnowFacts[nodeType] || didYouKnowFacts.concept;
    return facts[Math.floor(Math.random() * facts.length)];
}