# Islamic Knowledge Graph 🕌

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/fsafey/islamic-knowledge-graph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue.svg)](https://islamic-knowledge-graph.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black.svg)](https://github.com/fsafey/islamic-knowledge-graph)

**Interactive exploration of Islamic scholarship through an innovative knowledge graph visualization.**

Discover connections between scholars, texts, concepts, and contemporary applications in Islamic intellectual tradition. Built with modern web technologies and optimized for performance, accessibility, and educational impact.

> **🔗 Related Project**: This is a standalone visualization extracted from the [Imam Lib Masha Allah](https://github.com/fsafey/imam-lib-masha-allah) project. The Islamic Knowledge Graph operates independently with its own repository, deployment pipeline, and development workflow.

---

## 🌟 **Features**

### 📊 **Interactive Visualization**
- **D3.js-powered graph** with 63 nodes and 86 connections
- **Hover interactions** reveal detailed information and connections
- **Search functionality** with real-time filtering and suggestions
- **Learning paths** tailored to different educational personas

### 🎯 **Educational Focus**
- **Guided learning journeys** for New Muslims, Students, Academics, and Spiritual Seekers
- **Contemporary connections** linking classical scholarship to modern applications
- **Contextual insights** explaining relationships between concepts and scholars
- **Progress tracking** through personalized learning paths

### 🔧 **Technical Excellence**
- **Zero build tools** - Pure ES6 modules for instant deployment
- **CSP compliant** - Enhanced security with Content Security Policy
- **WCAG 2.1 AA** - Full accessibility compliance
- **Mobile optimized** - Responsive design for all devices
- **Performance optimized** - DOM caching and event delegation

---

## 🚀 **Quick Start**

### **Option 1: Visit Live Site**
🌐 **Live Demo**: https://islamic-knowledge-graph.netlify.app

### **Option 2: Local Development**
```bash
git clone https://github.com/fsafey/islamic-knowledge-graph.git
cd islamic-knowledge-graph
python3 -m http.server 8080
open http://localhost:8080
```

### **Option 3: Fork & Deploy**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/fsafey/islamic-knowledge-graph)

### **Development Setup**
```bash
# No build process required - pure ES6 modules
# Serve files locally (required for ES6 modules)
npx serve .
# or
python3 -m http.server 8080
```

---

## 📁 **Project Structure**

```
islamic-knowledge-graph/
├── index.html                      # Main application entry
├── css/                            # Modular CSS architecture
│   ├── base.css                   # Reset and foundational styles
│   ├── branding.css               # Al-Mufid Library branding
│   ├── graph.css                  # D3.js visualization styles
│   ├── learning-paths.css         # Educational journey components
│   ├── ui-components.css          # Search, sidebar, modals
│   └── responsive.css             # Mobile and tablet optimizations
├── js/                            # ES6 Module Architecture
│   ├── app.js                     # Application coordinator
│   ├── core/
│   │   └── graph-core.js          # D3.js graph rendering (optimized)
│   ├── ui/
│   │   ├── search.js              # Search functionality
│   │   ├── sidebar.js             # Information panels
│   │   ├── learning-paths.js      # Educational journeys
│   │   └── dom-manager.js         # Centralized DOM access
│   ├── data/
│   │   ├── graph-data.js          # Islamic knowledge dataset
│   │   └── learning-paths-data.js # Educational pathway configurations
│   ├── algorithms/
│   │   └── learning-paths-algorithms.js # Path determination logic
│   └── utils/
│       ├── graph-utils.js         # Shared utilities
│       └── tooltip-manager.js     # Tooltip lifecycle management
├── imam-logo.jpg                   # Al-Mufid Library logo
├── vworks-logo.png                 # VantageWorks Knowledge Systems logo
├── favicon.ico                     # Browser icon
├── netlify.toml                    # Netlify deployment configuration
└── .github/workflows/deploy.yml    # GitHub Actions CI/CD
```

---

## 🎯 **Educational Content**

### **Scholars Featured**
- **Classical Imams**: Ali ibn Abi Talib, Ja'far al-Sadiq, Muhammad al-Baqir
- **Medieval Scholars**: Sheikh al-Mufid, Sheikh al-Tusi, Allamah al-Hilli
- **Contemporary Authorities**: Grand Ayatollah Sistani, Ayatollah Khamenei
- **Modern Academics**: Seyyed Hossein Nasr, Abdolkarim Soroush

### **Learning Paths Available**
- 🌟 **New Muslims**: Foundational concepts and practices
- 🚀 **Young Adults**: Contemporary applications and relevance
- 👨‍👩‍👧‍👦 **Parents & Families**: Family-oriented Islamic education
- 🎓 **Students & Academics**: Scholarly methodology and research
- 💼 **Working Professionals**: Islamic ethics in modern contexts
- 🕊️ **Spiritual Seekers**: Mystical and philosophical dimensions

### **Contemporary Applications**
- Islamic Banking and Finance
- Medical Ethics in Islam
- Environmental Stewardship
- Interfaith Dialogue
- Social Justice Frameworks

---

## 🔧 **Technical Architecture**

### **Performance Optimizations**
- **DOM Caching**: 50%+ improvement in element access speed
- **Event Delegation**: CSP-compliant modern event handling
- **Critical Path Inlining**: Near-monolithic performance for hover events
- **Responsive Design**: Mobile-first approach with touch optimizations

### **Security Features**
- **Content Security Policy**: Enhanced protection against XSS
- **Input Sanitization**: Secure handling of user interactions
- **Dependency Security**: Minimal external dependencies (D3.js only)
- **HTTPS Enforcement**: Secure connection requirements

### **Accessibility Compliance**
- **Keyboard Navigation**: Full accessibility without mouse
- **Screen Reader Support**: ARIA attributes and semantic HTML
- **Color Accessibility**: High contrast and colorblind-friendly design
- **Motor Accessibility**: Large touch targets and easy interactions

---

## 🌐 **Browser Support**

| Browser | Version | Status |
|---------|---------|--------|
| **Chrome** | 91+ | ✅ Fully Supported |
| **Firefox** | 89+ | ✅ Fully Supported |
| **Safari** | 14+ | ✅ Fully Supported |
| **Edge** | 91+ | ✅ Fully Supported |
| **Mobile Safari** | iOS 14+ | ✅ Optimized |
| **Chrome Mobile** | Android 91+ | ✅ Optimized |

---

## 📊 **Performance Metrics**

- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **JavaScript Bundle**: < 50KB (excluding D3.js)
- **CSS Bundle**: < 20KB
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)

---

## 🏗️ **Repository & Development Workflow**

### **Independent Repository Structure**
This project maintains **complete separation** from the main Imam Lib Masha Allah project:

```
📁 Main Project
├── Repository: fsafey/imam-lib-masha-allah
├── Purpose: Islamic library application with Supabase backend
└── Directory: /Users/farieds/imam-lib-masha-allah/

🕌 Islamic Knowledge Graph (This Project)
├── Repository: fsafey/islamic-knowledge-graph
├── Purpose: Standalone D3.js visualization
├── Live Site: https://islamic-knowledge-graph.netlify.app
└── Directory: /Users/farieds/imam-lib-masha-allah/lab/islamic-knowledge-graph-deploy/
```

### **Development Commands**

**For this Knowledge Graph:**
```bash
cd /Users/farieds/imam-lib-masha-allah/lab/islamic-knowledge-graph-deploy
git add .
git commit -m "Knowledge graph improvements"
git push  # → fsafey/islamic-knowledge-graph
```

**For main Imam Lib project:**
```bash
cd /Users/farieds/imam-lib-masha-allah
git add .
git commit -m "Main library improvements"  
git push  # → fsafey/imam-lib-masha-allah
```

### **Deployment Pipeline**
- **GitHub**: Automatic CI/CD validation on push
- **Netlify**: Auto-deploy from main branch
- **Live Updates**: Changes appear instantly at https://islamic-knowledge-graph.netlify.app

---

## 🤝 **Contributing**

We welcome contributions to expand Islamic scholarship accessibility! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### **High-Impact Contributions**
- **Content expansion**: Add scholars, texts, or contemporary applications
- **Learning paths**: Create educational journeys for new personas
- **Accessibility**: Enhance keyboard navigation and screen reader support
- **Mobile optimization**: Improve touch interactions and responsive design
- **Internationalization**: Add RTL support and multilingual content

---

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🏛️ **Institutional Partners**

### **Al-Mufid Library**
*Digital Islamic Scholarship Repository*

Dedicated to preserving and making accessible the rich tradition of Islamic scholarship through modern digital platforms.

### **VantageWorks Knowledge Systems**
*Technology & Education Innovation*

Developing cutting-edge educational technologies that bridge traditional scholarship with contemporary learning methodologies.

---

## 📞 **Support & Contact**

- **Issues**: [GitHub Issues](https://github.com/fsafey/islamic-knowledge-graph/issues)
- **Discussions**: [GitHub Discussions](https://github.com/fsafey/islamic-knowledge-graph/discussions)
- **Educational Content**: Contact Al-Mufid Library for scholarly inquiries
- **Technical Support**: Contact VantageWorks for technical assistance

---

**Made with ❤️ for the global Muslim community and students of Islamic scholarship.**