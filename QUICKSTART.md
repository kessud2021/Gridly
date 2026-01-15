# Quick Start Guide

## 30-Second Setup

```bash
cd d:\my-ide
node server.js
```

Then visit: **http://localhost:3000**

## First Program

1. The editor loads with example code:
   ```python
   # Write Python code here
   print("Hello from Browser IDE!")
   ```

2. Click **▶ Run Python** or press **Ctrl+Enter**

3. See output in the **Terminal Output** panel on the right

## Common Tasks

### Run Python Code
```python
# Press Ctrl+Enter or click ▶ Run Python
print("Hello")
x = 42
print(x * 2)
```

### Access the Database
```python
# SQL.js database is available as IDE.db
# (Requires JavaScript execution within Brython context)
```

### Clear Terminal
Click **🗑️ Clear** button to reset output

## Troubleshooting

**Editor doesn't appear?**
- Open DevTools (F12) → Console
- Wait 5 seconds for Monaco to load
- Check for errors like `"Cannot read property 'editor' of undefined"`

**WASM error?**
- Verify `lib/sql-wasm.wasm` exists (660KB file)
- Check Network tab in DevTools
- Should show `sql-wasm.wasm` with status 200

**Python won't execute?**
- Check browser console for Brython errors
- Ensure code is valid Python syntax
- Note: Not all Python features are supported (no file I/O)

## What's Installed

- ✅ Monaco Editor (VS Code)
- ✅ Brython (Python runtime)
- ✅ sql.js (SQLite database)
- ✅ Bootstrap CSS
- ✅ Tailwind CSS
- ✅ JetBrains Mono Font

## Next Steps

1. Edit code in the left panel
2. Run with Ctrl+Enter
3. View output on the right
4. Check `README.md` for full API docs

---
**Ready to code!** 🚀
