# 🚀 Quick Start - Modular Knowledge Graph

## Single Command Startup

```bash
cd "/Users/farieds/imam-lib-masha-allah/lab/islamic-knowledge-graph/modular" && python3 -m http.server 8080
```

Then open: **http://localhost:8080**

## Alternative Ports (if 8080 busy)

```bash
cd "/Users/farieds/imam-lib-masha-allah/lab/islamic-knowledge-graph/modular" && python3 -m http.server 8081
```
Open: **http://localhost:8081**

```bash
cd "/Users/farieds/imam-lib-masha-allah/lab/islamic-knowledge-graph/modular" && python3 -m http.server 9000
```
Open: **http://localhost:9000**

## Option 2: Using VS Code Live Server

1. **Install Live Server extension** in VS Code
2. **Right-click** on `index.html` in the modular folder
3. **Select** "Open with Live Server"

## Option 3: Using Node.js serve

1. **Install serve** (if you have Node.js):
   ```bash
   npm install -g serve
   ```

2. **Navigate to modular directory**:
   ```bash
   cd "/Users/farieds/imam-lib-masha-allah/lab/islamic-knowledge-graph/modular"
   ```

3. **Start server**:
   ```bash
   serve -l 8080
   ```

4. **Open**: `http://localhost:8080`

## ⚠️ Important Notes

- **Don't open index.html directly** in the browser (file:// protocol won't work with ES6 modules)
- **You need a local server** for the modules to load properly
- **The server must be running** while you use the application

## 🧪 Test First

Before opening the main application, you can test if modules are working:

1. **Start server** (using any method above)
2. **Open**: `http://localhost:8080/test-basic.html`
3. **Check**: You should see "✅ All basic tests passed!"

## 🆘 Troubleshooting

- **Modules not loading**: Make sure you're using a server, not opening files directly
- **CORS errors**: Use `http://localhost:` not `file://`
- **Port busy**: Try different port numbers (8081, 8082, 9000, etc.)
- **Nothing appears**: Check browser console for error messages

## 📱 Mobile Testing

The modular version works on mobile too! Once the server is running, you can:
- **Open the same URL on your phone** (if on same network)
- **Use responsive design mode** in browser dev tools

Happy exploring! 🕌