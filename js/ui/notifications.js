/**
 * Advanced Notification System - Enhanced Visual Feedback
 * Implements sophisticated notification animations and feedback systems
 * Based on monolithic lines 2778-2944 modal system patterns
 */

// Notification queue and state management
let notificationQueue = [];
let activeNotifications = new Set();
let maxNotifications = 3;

/**
 * Advanced notification types with sophisticated styling
 */
const notificationTypes = {
    success: {
        icon: '✓',
        gradient: 'linear-gradient(135deg, #2e8b57 0%, #3cb371 100%)',
        shadowColor: 'rgba(46, 139, 87, 0.3)',
        borderColor: '#2e8b57'
    },
    info: {
        icon: '📚',
        gradient: 'linear-gradient(135deg, #2856A3 0%, #7db3d3 100%)',
        shadowColor: 'rgba(40, 86, 163, 0.3)',
        borderColor: '#2856A3'
    },
    warning: {
        icon: '⚠',
        gradient: 'linear-gradient(135deg, #f4c64f 0%, #e6b566 100%)',
        shadowColor: 'rgba(244, 198, 79, 0.3)',
        borderColor: '#f4c64f'
    },
    error: {
        icon: '⚠',
        gradient: 'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)',
        shadowColor: 'rgba(220, 53, 69, 0.3)',
        borderColor: '#dc3545'
    },
    learning: {
        icon: '🎯',
        gradient: 'linear-gradient(135deg, #8b5a96 0%, #b19cd9 100%)',
        shadowColor: 'rgba(139, 90, 150, 0.3)',
        borderColor: '#8b5a96'
    }
};

/**
 * Create advanced notification with sophisticated animations
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, info, warning, error, learning)
 * @param {Object} options - Additional options
 */
export function createAdvancedNotification(message, type = 'info', options = {}) {
    const notificationId = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Queue management - prevent notification spam
    if (activeNotifications.size >= maxNotifications) {
        notificationQueue.push({ message, type, options, id: notificationId });
        return notificationId;
    }
    
    const notification = createNotificationElement(message, type, options, notificationId);
    document.body.appendChild(notification);
    activeNotifications.add(notificationId);
    
    // Advanced entrance animation
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    });
    
    // Auto-dismiss with configurable timing
    const duration = options.duration || (type === 'error' ? 6000 : 4000);
    setTimeout(() => {
        dismissNotification(notificationId);
    }, duration);
    
    return notificationId;
}

/**
 * Create sophisticated notification element with rich styling
 */
function createNotificationElement(message, type, options, notificationId) {
    const typeConfig = notificationTypes[type] || notificationTypes.info;
    const position = options.position || 'top-right';
    
    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.className = 'advanced-notification';
    
    // Calculate position based on existing notifications
    const existingNotifications = document.querySelectorAll('.advanced-notification');
    const offset = existingNotifications.length * 80; // 80px spacing
    
    notification.style.cssText = `
        position: fixed;
        ${getPositionStyles(position, offset)}
        background: ${typeConfig.gradient};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px ${typeConfig.shadowColor};
        z-index: 10000;
        max-width: 400px;
        min-width: 300px;
        font-family: Georgia, serif;
        font-weight: 600;
        transform: translateX(120%);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.320, 1.275);
        border: 1px solid ${typeConfig.borderColor};
        backdrop-filter: blur(10px);
    `;
    
    // Create notification content with rich layout
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="
                font-size: 1.2rem; 
                line-height: 1; 
                flex-shrink: 0;
                background: rgba(255, 255, 255, 0.2);
                padding: 6px;
                border-radius: 6px;
            ">
                ${typeConfig.icon}
            </div>
            <div style="flex: 1;">
                <div style="font-size: 0.95rem; line-height: 1.4; margin-bottom: ${options.subtitle ? '4px' : '0'};">
                    ${message}
                </div>
                ${options.subtitle ? `
                    <div style="font-size: 0.85rem; opacity: 0.9; font-weight: 400;">
                        ${options.subtitle}
                    </div>
                ` : ''}
                ${options.action ? `
                    <button onclick="${options.action.callback}" style="
                        background: rgba(255, 255, 255, 0.2);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        color: white;
                        padding: 6px 12px;
                        border-radius: 6px;
                        font-size: 0.8rem;
                        cursor: pointer;
                        margin-top: 8px;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                        ${options.action.text}
                    </button>
                ` : ''}
            </div>
            <button onclick="dismissNotification('${notificationId}')" style="
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s ease;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                ×
            </button>
        </div>
        
        ${options.progress ? `
            <div style="
                position: absolute;
                bottom: 0;
                left: 0;
                height: 2px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 0 0 12px 12px;
                width: 100%;
                animation: notificationProgress ${options.duration || 4000}ms linear;
            "></div>
        ` : ''}
    `;
    
    // Add hover pause functionality
    notification.addEventListener('mouseenter', () => {
        notification.style.animationPlayState = 'paused';
    });
    
    notification.addEventListener('mouseleave', () => {
        notification.style.animationPlayState = 'running';
    });
    
    return notification;
}

/**
 * Get position styles based on notification placement
 */
function getPositionStyles(position, offset) {
    switch (position) {
        case 'top-right':
            return `top: ${20 + offset}px; right: 20px;`;
        case 'top-left':
            return `top: ${20 + offset}px; left: 20px;`;
        case 'bottom-right':
            return `bottom: ${20 + offset}px; right: 20px;`;
        case 'bottom-left':
            return `bottom: ${20 + offset}px; left: 20px;`;
        case 'top-center':
            return `top: ${20 + offset}px; left: 50%; transform: translateX(-50%);`;
        default:
            return `top: ${20 + offset}px; right: 20px;`;
    }
}

/**
 * Dismiss notification with smooth exit animation
 */
export function dismissNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (!notification) return;
    
    // Exit animation
    notification.style.transform = 'translateX(120%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
        activeNotifications.delete(notificationId);
        
        // Process queue
        if (notificationQueue.length > 0) {
            const next = notificationQueue.shift();
            createAdvancedNotification(next.message, next.type, next.options);
        }
        
        // Reposition remaining notifications
        repositionNotifications();
    }, 400);
}

/**
 * Reposition notifications after dismissal
 */
function repositionNotifications() {
    const notifications = document.querySelectorAll('.advanced-notification');
    notifications.forEach((notification, index) => {
        const offset = index * 80;
        notification.style.top = `${20 + offset}px`;
    });
}

/**
 * Learning path specific notifications
 */
export function showLearningPathNotification(pathName, action = 'selected') {
    const messages = {
        selected: `Learning Path Selected: ${pathName}`,
        completed: `Congratulations! You've completed: ${pathName}`,
        progress: `Progress saved for: ${pathName}`
    };
    
    createAdvancedNotification(messages[action] || messages.selected, 'learning', {
        subtitle: action === 'selected' ? 'Follow the numbered nodes on the graph' : undefined,
        duration: 5000,
        progress: true,
        action: action === 'selected' ? {
            text: 'Show Path',
            callback: 'highlightCurrentLearningPath()'
        } : undefined
    });
}

/**
 * Search result notifications
 */
export function showSearchNotification(query, resultCount, enhancedCount = 0) {
    if (resultCount === 0) {
        createAdvancedNotification(`No results found for "${query}"`, 'warning', {
            subtitle: 'Try: Imam Ali, Tawhid, or Nahj al-Balagha',
            duration: 4000
        });
    } else if (resultCount === 1) {
        const enhancedText = enhancedCount > 0 ? ' ⭐ Enhanced content available' : '';
        createAdvancedNotification(`Found 1 result for "${query}"${enhancedText}`, 'success', {
            subtitle: 'Node automatically centered in view',
            duration: 3000
        });
    } else {
        const enhancedText = enhancedCount > 0 ? ` (${enhancedCount} with enhanced content ⭐)` : '';
        createAdvancedNotification(`Found ${resultCount} results for "${query}"${enhancedText}`, 'info', {
            subtitle: 'Scroll to explore all matches',
            duration: 3000
        });
    }
}

/**
 * System status notifications
 */
export function showSystemNotification(message, type = 'info') {
    createAdvancedNotification(message, type, {
        duration: 3000,
        position: 'top-center'
    });
}

/**
 * Initialize notification system CSS animations
 */
export function initializeNotificationSystem() {
    // Add CSS animations if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes notificationProgress {
                from { width: 100%; }
                to { width: 0%; }
            }
            
            .advanced-notification:hover {
                transform: translateX(-4px) !important;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
            }
            
            @media (max-width: 768px) {
                .advanced-notification {
                    max-width: calc(100vw - 40px) !important;
                    min-width: calc(100vw - 40px) !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    console.log('✅ Advanced notification system initialized');
}

// Initialize on module load
initializeNotificationSystem();