# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development Server
```bash
# Start local server (required for ES6 modules)
python3 -m http.server 8080
# Alternative ports if 8080 is busy
python3 -m http.server 8081
python3 -m http.server 9000

# Or using Node.js serve
npx serve -l 8080
```

### Live Deployment
- **Live Site**: https://islamic-knowledge-graph.netlify.app
- **Auto-deploy**: Push to main branch triggers Netlify deployment
- **No build process**: Pure ES6 modules with static file serving

## Architecture Overview

### Modular ES6 Structure
This is a **zero-build-tool application** using native ES6 modules with a sophisticated layered architecture:

- **Core Layer** (`js/core/`): D3.js visualization engine with performance optimizations
- **Data Layer** (`js/data/`): Islamic knowledge dataset and learning path definitions
- **UI Layer** (`js/ui/`): Search, sidebar, and interface components
- **Utils Layer** (`js/utils/`): Shared utilities and tooltip management
- **Algorithms Layer** (`js/algorithms/`): Learning path determination logic

### Frontend Architecture & Routing

#### Application Flow & Module Integration
The application uses a **single-page architecture** with ES6 module imports creating a dependency graph:

```
index.html (entry point)
├── js/app.js (main coordinator)
│   ├── js/core/graph-core.js (D3.js visualization)
│   │   ├── js/core/interaction-state-manager.js (state management)
│   │   └── js/utils/tooltip-manager.js (tooltip system)
│   ├── js/ui/search.js (search functionality)
│   ├── js/ui/learning-paths.js (learning path UI)
│   ├── js/ui/sidebar.js (sidebar management)
│   ├── js/ui/mobile.js (responsive behavior)
│   ├── js/data/graph-data.js (knowledge dataset)
│   └── js/ui/visual-effects.js (animations & effects)
```

#### Module Communication Patterns

**1. Initialization Chain**: `app.js` orchestrates startup sequence:
- DOM validation → Graph initialization → Connection caching → Search setup → Event delegation

**2. State Management**: Centralized through `InteractionStateManager`:
- IDLE → HOVERING → DRAGGING → CLICKING states prevent UI conflicts
- 150ms hover delays and automatic cleanup prevent race conditions

**3. Event Flow**: CSP-compliant event delegation:
- Document-level event listeners with `.matches()` selectors
- No inline JavaScript - all events handled through delegated patterns
- Mobile-specific touch events through `mobile.js`

### Key Architectural Patterns

**DOM Caching System**: All DOM elements are cached in `js/ui/dom-manager.js` for 50%+ performance improvement. Always use cached references rather than direct DOM queries.

**Event Delegation**: CSP-compliant event handling with centralized delegation patterns. No inline JavaScript allowed.

**Connection Pre-computation**: Node relationships are pre-computed into a Map for O(1) lookup performance during hover interactions.

## Core Components & Features

### Graph Visualization (`js/core/graph-core.js`)
- **Force Simulation**: Intelligent positioning with relationship-based link distances
- **Performance Optimized**: Inlined sidebar updates to eliminate cross-module calls  
- **Scale-Dependent Rendering**: Labels hide below 0.5x zoom, stroke width adapts
- **Memory Management**: Periodic cleanup with 30-second performance reporting
- **Interaction State Management**: Centralized state prevents hover/drag conflicts

### Data Structure (`js/data/graph-data.js`)
- **66 Nodes**: Scholars (11), Books (13), Theology (11), Jurisprudence (8), Practice (7), Concepts (6), Verses (5), Contemporary (5)
- **140+ Streamlined Relationships**: `taught`, `influenced`, `founded`, `applies to`, `manifests in`
- **Accessibility Levels**: `beginner`, `intermediate`, `advanced` for learning paths
- **Temporal Context**: Historical dates and contemporary applications
- **Enhanced Connectivity**: Bidirectional relationships and historical bridge concepts

### Search System (`js/ui/search.js`)
- **Fuzzy Matching**: Synonym expansion and partial matching
- **Beginner Suggestions**: Curated starting points when search is empty
- **Real-time Filtering**: Debounced input with suggestion highlighting
- **Viewport Integration**: Auto-centers on selected nodes
- **Keyboard Navigation**: Arrow keys and Enter for accessibility

### Learning Paths (`js/ui/learning-paths.js`, `js/data/learning-paths-data.js`)
- **Persona-Based**: New Muslims, Students, Academics, Spiritual Seekers
- **Algorithm-Driven**: Dynamic path generation based on user preferences
- **Progress Tracking**: User state persistence and journey guidance
- **Visual Indicators**: Progress bars and completion status

### Sidebar System (`js/ui/sidebar.js`)
- **Contextual Content**: Rich information display with scrollable layout
- **Research Insights**: Scholarly context and connection information
- **Learning Progress**: Persona-aware path visualization
- **Quote Integration**: Arabic text support with RTL formatting
- **Pinning/Unpinning**: Persistent content display during navigation

### Mobile Interface (`js/ui/mobile.js`)
- **Responsive Design**: 768px breakpoint with touch-friendly interactions
- **Sidebar Management**: Mobile-specific show/hide functionality
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Viewport Adaptation**: Automatic adjustment for orientation changes

### Tooltip System (`js/utils/tooltip-manager.js`)
- **Unified Management**: Centralized tooltip creation and cleanup
- **Relationship Tooltips**: Enhanced edge hover information
- **Automatic Cleanup**: 10-second garbage collection intervals
- **Conflict Prevention**: Singleton pattern prevents duplicate tooltips
- **Animation Support**: Smooth fade-in/out transitions

### Visual Effects (`js/ui/visual-effects.js`)
- **Node Highlighting**: Context-aware visual feedback
- **Learning Path Visualization**: Multi-node sequence indicators
- **Performance Optimization**: Scale-dependent rendering
- **Particle Effects**: Hover animations (disabled in performance mode)
- **Glow Effects**: Multi-layer shadow system for emphasis

## CSS Architecture

### Modular Stylesheets
- **`base.css`**: Typography, layout foundations, gradient backgrounds
- **`branding.css`**: Al-Mufid Library brand elements and logos
- **`graph.css`**: D3.js visualization styles with semantic color coding
- **`learning-paths.css`**: Progressive learning interface components
- **`ui-components.css`**: Interactive elements and form controls
- **`responsive.css`**: Mobile adaptations with 768px primary breakpoint

### Design System
- **Color Palette**: VantageWorks palette with semantic meaning
  - Scholars: Royal blue (`#2856A3`)
  - Books: Soft blue (`#7db3d3`)
  - Contemporary: Modern purple (`#8e44ad`)
- **8px Grid System**: Consistent spacing and proportions
- **Typography**: Georgia serif for readability and classical feel

## Security & Performance

### Content Security Policy
```
script-src 'self' https://cdnjs.cloudflare.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
img-src 'self' data:
```

### Performance Optimizations
- **DOM Caching**: Cached element references eliminate repeated queries
- **Connection Cache**: Pre-computed Map for O(1) hover performance
- **Timeout Management**: 100ms delays prevent interaction flicker
- **Memory Monitoring**: 30-second intervals with automatic cleanup

## Data Extensions

### Adding New Nodes
1. Add to `js/data/graph-data.js` in the `nodes` array
2. Include required fields: `id`, `name`, `type`, `description`, `accessibility`
3. Add connections in the `links` array with `source`, `target`, `relationship`
4. Update learning paths in `js/data/learning-paths-data.js` if relevant

### Learning Path Creation
1. Define persona in `js/data/learning-paths-data.js`
2. Specify `startingNodes`, `recommendedPath`, and `goals`
3. Algorithm will generate dynamic connections based on node relationships

## Application Features & User Experience

### Core Functionality
1. **Interactive Graph Exploration**: D3.js force-directed graph with zoom, pan, and drag
2. **Smart Search**: Real-time fuzzy search with beginner suggestions and keyboard navigation
3. **Learning Paths**: Persona-based guided exploration (7 user types)
4. **Rich Tooltips**: Contextual information on hover with relationship details
5. **Responsive Design**: Mobile-optimized interface with touch support
6. **Progress Tracking**: User journey persistence and learning path completion

### User Interaction Flow
```
Page Load → DOM Validation → Graph Initialization → Event Setup
     ↓
User Searches → Fuzzy Match → Center on Results → Show Suggestions
     ↓
Node Hover → State Management → Show Tooltip → Update Sidebar
     ↓
Learning Path → Persona Selection → Progress Tracking → Visual Indicators
```

### State Management & Conflict Resolution
- **InteractionStateManager**: Prevents hover/drag conflicts through state machine
- **Timeout Management**: 150ms hover delays prevent UI flicker
- **Memory Management**: Automatic cleanup of tooltips and event listeners

## Architecture Gaps & Opportunities

### Current Limitations
1. **No Backend**: Pure static application - no user authentication or data persistence
2. **No Real-time Updates**: Static dataset without dynamic content updates
3. **Limited Analytics**: No user behavior tracking or usage metrics
4. **Basic Error Handling**: Limited error recovery and user feedback
5. **No Offline Support**: Requires internet connection for all functionality

### Potential Enhancements
1. **User Accounts**: Progress tracking across devices and sessions
2. **Content Management**: Admin interface for updating nodes and relationships
3. **Social Features**: Sharing learning paths and collaborative exploration
4. **API Integration**: Connection to external Islamic scholarly databases
5. **Advanced Analytics**: User journey analysis and content optimization

## Common Development Patterns

### Module Import Structure
```javascript
// Always import from cached DOM manager
import { DOMManager } from './ui/dom-manager.js';

// Use cached elements for performance
const sidebar = DOMManager.getSidebarContent();
```

### Event Handling
```javascript
// Use delegation pattern (CSP compliant)
document.addEventListener('click', (event) => {
    if (event.target.matches('.learning-path-card')) {
        // Handle learning path selection
    }
});
```

### State Management
```javascript
// Use centralized interaction state
if (InteractionStateManager.canStartInteraction('hover')) {
    InteractionStateManager.startHover(nodeId, () => {
        // Hover callback
    });
}
```

### D3.js Integration
- Simulation parameters are relationship-type specific
- Use cached connection Map for hover performance
- Respect scale-dependent rendering thresholds
- Maintain alpha decay tuning for smooth animations

## Repository Structure

This is a **standalone repository** separate from the main Imam Lib Masha Allah project:
- **This repo**: `fsafey/islamic-knowledge-graph` (visualization only)
- **Main project**: `fsafey/imam-lib-masha-allah` (full library application)
- **Live deployment**: Auto-deployed to Netlify from main branch