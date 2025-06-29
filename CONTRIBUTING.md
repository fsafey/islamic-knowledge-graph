# Contributing to Islamic Knowledge Graph

Thank you for your interest in contributing to the Islamic Knowledge Graph project!

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch: `git checkout -b feature/your-feature-name`
4. **Test** your changes with a local server: `python3 -m http.server 8080`
5. **Commit** with clear messages
6. **Push** and create a Pull Request

## 📁 Project Structure

```
├── index.html              # Main application entry
├── css/                    # CSS modules (6 files)
├── js/                     # JavaScript ES6 modules
│   ├── core/              # Core graph functionality
│   ├── ui/                # User interface components
│   ├── data/              # Data modules
│   ├── utils/             # Utility functions
│   └── algorithms/        # Learning path algorithms
├── imam-logo.jpg          # Al-Mufid Library branding
└── vworks-logo.png        # VantageWorks branding
```

## 🛠 Development Guidelines

### Code Standards
- **ES6 modules** with import/export
- **CSP compliant** - no inline scripts/styles
- **Accessible** - WCAG 2.1 AA compliance
- **Performance optimized** - cached DOM access

### Testing
```bash
# Start local server (required for ES6 modules)
python3 -m http.server 8080

# Test in browser
open http://localhost:8080

# Check console for errors
# Validate hover performance
# Test keyboard navigation
```

### Code Style
- Use semantic variable names
- Add JSDoc comments for functions
- Follow existing patterns in the codebase
- Maintain error boundaries and graceful degradation

## 📊 Performance Requirements

- **DOM operations**: Use cached references via `DOMManager`
- **Event handling**: Implement event delegation
- **Hover events**: Direct timeout management (no cross-module calls)
- **Memory management**: Proper cleanup in event handlers

## 🔍 Areas for Contribution

### 🎯 High Impact
- **New learning paths**: Add educational journeys for different personas
- **Node data expansion**: Add scholars, concepts, or contemporary applications
- **Accessibility improvements**: Enhanced keyboard navigation, screen reader support
- **Mobile optimization**: Touch interactions, responsive improvements

### 🔧 Technical Enhancements
- **Search improvements**: Better fuzzy matching, category filters
- **Visualization features**: Zoom controls, minimap, graph layouts
- **Export functionality**: PDF generation, data export
- **Internationalization**: RTL support, multilingual content

### 📚 Content Contributions
- **Scholar biographies**: Detailed information about Islamic scholars
- **Book descriptions**: Enhanced metadata for Islamic texts
- **Contemporary connections**: Modern applications of classical concepts
- **Learning guidance**: Educational pathways and recommendations

## 🚨 What NOT to Change

- **Core architecture**: ES6 module structure is optimized
- **Performance-critical paths**: Hover event handling in `graph-core.js`
- **Branding elements**: Logo files and institutional information
- **CSP compliance**: Maintain zero inline scripts/styles

## 📝 Pull Request Process

1. **Description**: Clear explanation of changes and motivation
2. **Testing**: Include testing steps and validation
3. **Performance**: Verify no performance regressions
4. **Accessibility**: Test keyboard navigation and screen readers
5. **Browser compatibility**: Test in Chrome, Firefox, Safari, Edge

## 🔒 Security Guidelines

- **No external dependencies** except D3.js CDN
- **Input sanitization** for any user-generated content
- **CSP compliance** maintained
- **No secrets** in client-side code

## 📖 Resources

- **D3.js Documentation**: https://d3js.org/
- **ES6 Modules Guide**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Project README**: Full architecture documentation

## 💬 Questions?

- Open an **Issue** for bugs or feature requests
- Use **Discussions** for questions about Islamic scholarship content
- Tag relevant maintainers for architectural questions

Thank you for contributing to Islamic scholarship accessibility and education! 🌟