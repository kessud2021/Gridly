# Browser IDE - Offline-First Python Development Environment

A fully offline-capable browser-based IDE with Monaco code editor, Python runtime (Brython), and SQL database support.

## Architecture

### File Structure
```
d:/my-ide/
├── lib/                                  (Third-party libraries, all local)
│   ├── bootstrap.css                     (UI framework)
│   ├── jetbrainsmono.css                 (Font definitions)
│   ├── brython.js                        (Python runtime)
│   ├── brython_stdlib.js                 (Python standard library)
│   ├── monaco-editor.js                  (VS Code editor)
│   ├── tailwind.js                       (CSS utility library)
│   ├── sql-wasm.js                       (SQL.js wrapper)
│   └── sql-wasm.wasm                     (WebAssembly binary)
├── src/
│   ├── index.html                        (Single-page app entry point)
│   ├── scripts/
│   │   ├── boot.js                       (IDE initialization & runtime)
│   │   └── script.js                     (User scripts)
│   ├── components/                       (Reserved for UI components)
│   └── style/                            (Reserved for CSS)
├── package.json                          (Dependencies)
├── server.js                             (Development server)
└── README.md                             (This file)
```

## Key Features

### 1. **Monaco Editor Integration**
- Full VS Code editor in the browser
- Python syntax highlighting
- Dark theme with monospace font
- Auto-layout for responsive design
- Keyboard shortcuts support

### 2. **Python Runtime (Brython)**
- Execute Python code in the browser
- Direct access to browser APIs
- Output captured to terminal panel
- Error handling with stack traces

### 3. **SQL Database (sql.js)**
- SQLite database running entirely in-memory
- No backend server required
- Available as `IDE.db` in global scope

### 4. **Terminal Output Panel**
- Real-time output from Python execution
- Color-coded messages (info, success, error, warning)
- Scrollable history
- Clear button to reset

### 5. **Offline-First**
- All libraries bundled locally
- Works without internet connection
- No CDN dependencies (except font fallback)
- Deterministic asset loading

## Bootstrap Sequence

When `index.html` is loaded, the following sequence occurs:

1. **HTML Parsing** (index.html)
   - Load CSS (Bootstrap, JetBrains Mono font)
   - Load libraries in order (Brython, Tailwind, Monaco, SQL.js)
   - Attach boot script

2. **Terminal Initialization** (boot.js)
   - Create `TerminalManager` instance
   - Redirect `console.*` to terminal panel
   - Display initialization messages

3. **Monaco Editor** (boot.js → initMonaco)
   - Wait for `monaco` global
   - Create editor instance in `#monaco-editor` div
   - Set Python language & dark theme
   - Enable auto-layout

4. **Brython Setup** (boot.js → initBrython)
   - Initialize Python runtime
   - Configure stdlib path
   - Ready for Python code execution

5. **SQL.js Loading** (boot.js → initSqlJs)
   - Locate WASM binary at `../lib/sql-wasm.wasm`
   - Initialize in-memory SQLite database
   - Make available as `IDE.db`

6. **Event Binding** (boot.js → setupEventListeners)
   - "Run Python" button → execute editor code
   - "Clear" button → clear terminal
   - Ctrl+Enter shortcut → run code

7. **Ready State** 
   - Display "✓ IDE Ready!" message
   - Accept user input

## Running the IDE

### Option 1: Node.js Development Server
```bash
npm install  # Install sql.js if needed
node server.js
```
Then open `http://localhost:3000` in your browser.

### Option 2: Any HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# npx http-server
npx http-server src -p 8000

# Node.js with http-server
npm install -g http-server
http-server src -p 8000
```

**Important**: Serve from the `src/` directory so that relative paths resolve correctly.

### Option 3: Direct Browser
```bash
# Windows
start src/index.html

# macOS
open src/index.html

# Linux
xdg-open src/index.html
```

This works offline but may have CORS restrictions on WASM loading depending on the browser.

## Path Resolution

### Critical: From where is the IDE served?

The HTML file expects to be served from the `src/` directory. Relative paths are:
- CSS/JS: `../lib/`  → resolves to `/lib/`
- Boot script: `scripts/boot.js`

If you need to serve from a different root, update these paths in `index.html`:
```html
<!-- If serving from root, change to: -->
<link rel="stylesheet" href="lib/bootstrap.css">
<script src="lib/brython.js"></script>
<script src="scripts/boot.js"></script>
```

## API Reference

### Global IDE Object
```javascript
IDE.editor          // Monaco editor instance
IDE.terminal        // Terminal manager
IDE.db              // SQL.js database instance
IDE.isReady         // Bootstrap complete flag
IDE.logs            // Array of all terminal messages
```

### Terminal Methods
```javascript
IDE.terminal.log(message, type)     // Log with type (default: 'info')
IDE.terminal.info(message)          // Blue text
IDE.terminal.error(message)         // Red text
IDE.terminal.success(message)       // Green text
IDE.terminal.warn(message)          // Yellow text
IDE.terminal.clear()                // Clear all output
```

### Monaco Editor
```javascript
IDE.editor.getValue()               // Get code text
IDE.editor.setValue(code)           // Set code text
IDE.editor.getModel()              // Get underlying model
IDE.editor.layout()                // Trigger layout recalc
```

### Python Execution
Python code is executed with:
```javascript
runPython(code)  // Internal function
```

Inside Python, use:
```python
print("Hello")         # Output to terminal
# Access: IDE.db (sql.js instance)
```

## Known Limitations

1. **Font Loading**: JetBrains Mono font requires CDN fallback (no offline font files included)
2. **Python Execution**: Limited to Brython's capabilities - no file I/O, limited async support
3. **Database**: SQL.js runs in-memory; database is lost on page refresh
4. **Brython Path**: If Monaco/Brython fail to load, check browser console for specific errors

## Debugging

Open browser DevTools (F12) and check:
- **Console tab**: Boot logs and Python errors
- **Network tab**: Verify WASM file is loading (should be ~660KB)
- **Elements tab**: Verify `#monaco-editor` and `#terminal` divs exist

Common issues:
- **Monaco not appearing**: Check if `monaco` global is defined in console
- **WASM load fails**: Verify `sql-wasm.wasm` exists in `/lib/` and file is not corrupted
- **Python won't run**: Ensure Brython initialized (check console logs)

## Development Notes

- **Bundled Libraries**: All JS/CSS in `lib/` are pre-bundled. Do NOT attempt to require/import them.
- **WASM Binary**: Must be served with correct MIME type (`application/wasm`)
- **Offline Usage**: Font fallback to system monospace if JetBrains Mono unavailable

## Future Enhancements

- [ ] File system integration via IndexedDB
- [ ] Python package manager (pyodide)
- [ ] Real-time collaboration
- [ ] Code completion and linting
- [ ] Persistent session storage
- [ ] Export/import projects

---

**Status**: Ready for offline use  
**Last Updated**: 2025-01-15  
**Browser Compatibility**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
