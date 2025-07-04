# 🚀 Islamic Knowledge Graph - Quick Start

## Single Command Startup
```bash
cd "/Users/farieds/lab/islamic-knowledge-graph-deploy" && python3 -m http.server 8080
```
**Open:** http://localhost:8080

## Kill Ports (if needed)
```bash
# Kill specific port
lsof -ti:8080 | xargs kill -9

# Kill all common ports
lsof -ti:8080,8081,9000 | xargs kill -9
```

## Alternative Ports
```bash
python3 -m http.server 8081  # http://localhost:8081
python3 -m http.server 9000  # http://localhost:9000
```

## Using Node.js serve (alternative)
```bash
npx serve -l 8080
```

## ⚠️ Important
- **Don't open index.html directly** - requires server for ES6 modules
- **CORS errors?** Use `http://localhost:` not `file://`

## 🌐 Live Deployment
**https://islamic-knowledge-graph.netlify.app**

## 🛠️ Development Notes
- **Zero build tools** - Pure ES6 modules
- **Auto-deploy** - Push to main branch triggers Netlify deployment
- **Modular architecture** - Core, Data, UI, Utils layers
- **Current scale** - 66 nodes with 140+ streamlined relationships
- **Enhanced tooltips** - Scannable 2-4 word relationship indicators