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

### Key Architectural Patterns

**DOM Caching System**: All DOM elements are cached in `js/ui/dom-manager.js` for 50%+ performance improvement. Always use cached references rather than direct DOM queries.

**Event Delegation**: CSP-compliant event handling with centralized delegation patterns. No inline JavaScript allowed.

**Connection Pre-computation**: Node relationships are pre-computed into a Map for O(1) lookup performance during hover interactions.

## Core Components

### Graph Visualization (`js/core/graph-core.js`)
- **Force Simulation**: Intelligent positioning with relationship-based link distances
- **Performance Optimized**: Inlined sidebar updates to eliminate cross-module calls
- **Scale-Dependent Rendering**: Labels hide below 0.5x zoom, stroke width adapts
- **Memory Management**: Periodic cleanup with 30-second performance reporting

### Data Structure (`js/data/graph-data.js`)
- **90+ Nodes**: Scholars, books, concepts with rich metadata
- **Typed Relationships**: `authored`, `taught`, `interpreted`, `influenced`
- **Accessibility Levels**: `beginner`, `intermediate`, `advanced` for learning paths
- **Temporal Context**: Historical dates and contemporary applications

### Search System (`js/ui/search.js`)
- **Fuzzy Matching**: Synonym expansion and partial matching
- **Beginner Suggestions**: Curated starting points when search is empty
- **Real-time Filtering**: Debounced input with suggestion highlighting
- **Viewport Integration**: Auto-centers on selected nodes

### Learning Paths (`js/ui/learning-paths.js`, `js/data/learning-paths-data.js`)
- **Persona-Based**: New Muslims, Students, Academics, Spiritual Seekers
- **Algorithm-Driven**: Dynamic path generation based on user preferences
- **Progress Tracking**: User state persistence and journey guidance

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

## Common Development Patterns

### Module Import Structure
```javascript
// Always import from cached DOM manager
import { getElement } from './ui/dom-manager.js';

// Use cached elements for performance
const sidebar = getElement('sidebar');
```

### Event Handling
```javascript
// Use delegation pattern (CSP compliant)
document.addEventListener('click', (event) => {
    if (event.target.matches('.node-selector')) {
        // Handle click
    }
});
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