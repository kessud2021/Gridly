// ============================================================================
// Production-Grade Browser IDE
// File management, git, search, Monaco editor
// ============================================================================

console.log('🚀 Browser IDE Starting...');

const LANGUAGE_MAP = {
    'html': 'html', 'htm': 'html', 'xml': 'xml',
    'css': 'css', 'scss': 'scss', 'sass': 'scss', 'less': 'less',
    'js': 'javascript', 'jsx': 'javascript', 'mjs': 'javascript',
    'ts': 'typescript', 'tsx': 'typescript',
    'json': 'json', 'jsonc': 'jsonc',
    'yml': 'yaml', 'yaml': 'yaml',
    'py': 'python', 'pyw': 'python', 'pyx': 'python',
    'php': 'php', 'java': 'java', 'cs': 'csharp',
    'go': 'go', 'rs': 'rust', 'c': 'c', 'cpp': 'cpp',
    'rb': 'ruby', 'sh': 'shell', 'bash': 'shell',
    'sql': 'sql', 'md': 'markdown', 'rst': 'rst',
    'default': 'plaintext'
};

const FILE_ICONS = {
    'html': '\ue60a', 'htm': '\ue60a', 'xml': '\uf072',
    'css': '\ue61d', 'scss': '\ue61d', 'sass': '\ue61d', 'less': '\ue61d',
    'js': '\ue74e', 'jsx': '\ue74e', 'mjs': '\ue74e',
    'ts': '\ue628', 'tsx': '\ue628',
    'json': '\ue60b', 'yml': '\ue481', 'yaml': '\ue481',
    'vue': '\ue6a0', 'svelte': '\ue697',
    'py': '\ue235', 'pyw': '\ue235', 'pyx': '\ue235',
    'php': '\ue73d', 'java': '\ue738', 'cs': '\uf81a',
    'go': '\ufa52', 'rs': '\ue7a8', 'rlib': '\ue7a8',
    'c': '\ue61e', 'h': '\ue61e', 'cpp': '\ue61d', 'cc': '\ue61d',
    'rb': '\ue791', 'erb': '\ue791',
    'sh': '\uf489', 'bash': '\uf489', 'zsh': '\uf489',
    'sql': '\uf1c0', 'md': '\ue60f', 'markdown': '\ue60f',
    'pdf': '\ue60e', 'txt': '\uf15c', 'rtf': '\uf15c',
    'default': '\uf15c'
};

const IDE = {
    editor: null,
    terminal: null,
    fileManager: null,
    gitManager: null,
    searchIndex: null,
    isReady: false,
    renaming: false
};

// ============================================================================
// Terminal System
// ============================================================================
class TerminalManager {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.logs = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { message, type, timestamp };
        this.logs.push(logEntry);

        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = `[${timestamp}] ${message}`;
        this.element.appendChild(line);
        this.element.scrollTop = this.element.scrollHeight;
    }

    clear() {
        this.logs = [];
        this.element.innerHTML = '';
    }

    error(message) { this.log(message, 'error'); }
    success(message) { this.log(message, 'success'); }
    warn(message) { this.log(message, 'warning'); }
    info(message) { this.log(message, 'info'); }
}

// ============================================================================
// Search Index System
// ============================================================================
class SearchIndex {
    constructor() {
        this.index = this.loadIndex();
    }

    loadIndex() {
        const stored = localStorage.getItem('ide-search-index');
        return stored ? JSON.parse(stored) : {};
    }

    saveIndex() {
        localStorage.setItem('ide-search-index', JSON.stringify(this.index));
    }

    indexFile(fileName, content) {
        this.index[fileName] = {
            name: fileName.toLowerCase(),
            content: content.toLowerCase(),
            timestamp: Date.now()
        };
        this.saveIndex();
    }

    removeFromIndex(fileName) {
        delete this.index[fileName];
        this.saveIndex();
    }

    search(query) {
        const q = query.toLowerCase();
        return Object.entries(this.index)
            .filter(([name, data]) => data.name.includes(q) || data.content.includes(q))
            .sort((a, b) => {
                const aMatch = a[1].name.includes(q);
                const bMatch = b[1].name.includes(q);
                if (aMatch !== bMatch) return bMatch - aMatch;
                return b[1].timestamp - a[1].timestamp;
            })
            .map(([name]) => name);
    }
}

// ============================================================================
// Git Manager
// ============================================================================
class GitManager {
    constructor() {
        this.commits = this.loadCommits();
    }

    loadCommits() {
        const stored = localStorage.getItem('ide-git-commits');
        return stored ? JSON.parse(stored) : [];
    }

    saveCommits() {
        localStorage.setItem('ide-git-commits', JSON.stringify(this.commits));
    }

    commit(message, fileSnapshot) {
        const commit = {
            id: this.generateId(),
            message: message,
            timestamp: Date.now(),
            files: fileSnapshot,
            stats: Object.keys(fileSnapshot).length
        };
        this.commits.push(commit);
        this.saveCommits();
        return commit;
    }

    generateId() {
        return Math.random().toString(36).substring(2, 9);
    }

    getCommits() {
        return this.commits;
    }
}

// ============================================================================
// File Manager
// ============================================================================
class FileManager {
    constructor() {
        this.files = this.loadFiles();
        this.currentFile = null;
    }

    generateFileName() {
        const bytes = new Uint8Array(24);
        crypto.getRandomValues(bytes);
        return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, '').substring(0, 32);
    }

    loadFiles() {
        const stored = localStorage.getItem('ide-files');
        return stored ? JSON.parse(stored) : {};
    }

    saveFiles() {
        localStorage.setItem('ide-files', JSON.stringify(this.files));
    }

    createFile(name = null) {
        const fileName = name || `${this.generateFileName()}.txt`;
        this.files[fileName] = '';
        this.saveFiles();
        IDE.searchIndex.indexFile(fileName, '');
        return fileName;
    }

    deleteFile(fileName) {
        delete this.files[fileName];
        this.saveFiles();
        IDE.searchIndex.removeFromIndex(fileName);
        if (this.currentFile === fileName) {
            this.currentFile = null;
        }
    }

    renameFile(oldName, newName) {
        if (this.files[newName]) {
            IDE.terminal.error(`File "${newName}" already exists`);
            return false;
        }
        this.files[newName] = this.files[oldName];
        delete this.files[oldName];
        this.saveFiles();
        IDE.searchIndex.removeFromIndex(oldName);
        IDE.searchIndex.indexFile(newName, this.files[newName]);
        
        if (this.currentFile === oldName) {
            this.currentFile = newName;
        }
        IDE.terminal.success(`✓ Renamed: ${oldName} → ${newName}`);
        return true;
    }

    getFile(fileName) {
        return this.files[fileName] || '';
    }

    setFile(fileName, content) {
        this.files[fileName] = content;
        this.saveFiles();
        IDE.searchIndex.indexFile(fileName, content);
    }

    listFiles() {
        return Object.keys(this.files).sort();
    }

    downloadFile(fileName) {
        const content = this.files[fileName];
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        IDE.terminal.success(`✓ Downloaded: ${fileName}`);
    }
}

// ============================================================================
// Helpers
// ============================================================================
function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    return FILE_ICONS[ext] || FILE_ICONS['default'];
}

function getMonacoLanguage(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    return LANGUAGE_MAP[ext] || LANGUAGE_MAP['default'];
}

function setMonacoLanguage(fileName) {
    if (!window.IDE || !window.IDE.editor || !window.monaco) return;
    const language = getMonacoLanguage(fileName);
    const model = window.IDE.editor.getModel();
    if (model) {
        window.monaco.editor.setModelLanguage(model, language);
        console.log(`✓ Language: ${language}`);
    }
}

// ============================================================================
// File UI Functions
// ============================================================================
function renderFileList() {
    const fileList = document.getElementById('file-list');
    if (!fileList) return;
    
    fileList.innerHTML = '';
    const files = IDE.fileManager.listFiles();
    
    files.forEach(fileName => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        if (IDE.fileManager.currentFile === fileName) {
            fileItem.classList.add('active');
        }
        
        const icon = getFileIcon(fileName);
        fileItem.innerHTML = `
            <span class="file-icon">${icon}</span>
            <span class="file-name">${fileName}</span>
            <div class="file-actions">
                <button class="file-btn rename-btn" title="Rename (F2)">✎</button>
                <button class="file-btn download-btn" title="Download">⬇</button>
                <button class="file-btn delete-btn" title="Delete">✕</button>
            </div>
        `;
        
        fileItem.querySelector('.file-name').addEventListener('click', () => {
            saveCurrentFile();
            loadFile(fileName);
        });
        
        fileItem.querySelector('.rename-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            startRename(fileItem, fileName);
        });
        
        fileItem.querySelector('.download-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            IDE.fileManager.downloadFile(fileName);
        });
        
        fileItem.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Delete ${fileName}?`)) {
                IDE.fileManager.deleteFile(fileName);
                if (IDE.fileManager.currentFile === fileName) {
                    const remaining = IDE.fileManager.listFiles();
                    if (remaining.length > 0) {
                        loadFile(remaining[0]);
                    } else {
                        const newFile = IDE.fileManager.createFile('untitled.txt');
                        loadFile(newFile);
                    }
                }
                renderFileList();
                IDE.terminal.info(`✓ Deleted: ${fileName}`);
            }
        });
        
        fileList.appendChild(fileItem);
    });
}

function startRename(fileItem, oldName) {
    if (IDE.renaming) return;
    IDE.renaming = true;
    
    const nameSpan = fileItem.querySelector('.file-name');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'file-rename-input';
    input.value = oldName;
    input.maxLength = 255;
    
    nameSpan.replaceWith(input);
    input.focus();
    input.select();
    
    const finishRename = () => {
        const newName = input.value.trim();
        if (newName && newName !== oldName) {
            IDE.fileManager.renameFile(oldName, newName);
            if (IDE.fileManager.currentFile === newName) {
                setMonacoLanguage(newName);
            }
            renderFileList();
        } else if (newName !== oldName) {
            IDE.terminal.warn('Invalid filename');
        }
        IDE.renaming = false;
    };
    
    input.addEventListener('blur', finishRename);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishRename();
        if (e.key === 'Escape') IDE.renaming = false;
    });
}

function loadFile(fileName) {
    if (!window.IDE || !window.IDE.editor) {
        setTimeout(() => loadFile(fileName), 100);
        return;
    }
    
    IDE.fileManager.currentFile = fileName;
    const content = IDE.fileManager.getFile(fileName);
    window.IDE.editor.setValue(content);
    setMonacoLanguage(fileName);
    renderFileList();
    IDE.terminal.info(`✓ Loaded: ${fileName}`);
}

function saveCurrentFile() {
    if (!window.IDE || !window.IDE.editor || !IDE.fileManager.currentFile) return;
    const content = window.IDE.editor.getValue();
    IDE.fileManager.setFile(IDE.fileManager.currentFile, content);
    IDE.terminal.success(`✓ Saved: ${IDE.fileManager.currentFile}`);
}

function createNewFile() {
    const fileName = IDE.fileManager.createFile();
    loadFile(fileName);
    renderFileList();
    IDE.terminal.success(`✓ Created: ${fileName}`);
}

function performSearch(query) {
    if (!query.trim()) {
        renderFileList();
        return;
    }
    
    const results = IDE.searchIndex.search(query);
    const fileList = document.getElementById('file-list');
    if (!fileList) return;
    
    fileList.innerHTML = '';
    results.forEach(fileName => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        if (IDE.fileManager.currentFile === fileName) {
            fileItem.classList.add('active');
        }
        
        const icon = getFileIcon(fileName);
        fileItem.innerHTML = `
            <span class="file-icon">${icon}</span>
            <span class="file-name">${fileName}</span>
        `;
        
        fileItem.querySelector('.file-name').addEventListener('click', () => {
            saveCurrentFile();
            loadFile(fileName);
        });
        
        fileList.appendChild(fileItem);
    });
    
    IDE.terminal.info(`Found ${results.length} results`);
}

function renderGitHistory() {
    const container = document.getElementById('git-commits');
    if (!container) return;
    
    container.innerHTML = '';
    const commits = IDE.gitManager.getCommits().slice().reverse();
    
    if (commits.length === 0) {
        container.innerHTML = '<div style="padding: 12px; color: #858585; font-size: 11px;">No commits yet</div>';
        return;
    }
    
    commits.forEach(commit => {
        const el = document.createElement('div');
        el.className = 'git-commit';
        el.innerHTML = `
            <div class="git-commit-msg">[${commit.id.substring(0, 7)}] ${commit.message}</div>
            <div class="git-commit-date">${new Date(commit.timestamp).toLocaleString()}</div>
        `;
        container.appendChild(el);
    });
}

// ============================================================================
// Menu System
// ============================================================================
function createMenuItem(label, icon, action, shortcut = null, disabled = false) {
    const item = document.createElement('div');
    item.className = `context-menu-item ${disabled ? 'disabled' : ''}`;
    if (!disabled) {
        item.addEventListener('click', () => {
            action();
            closeAllMenus();
        });
    }
    
    let html = `<i class="bi bi-${icon}"></i><span>${label}</span>`;
    if (shortcut) {
        html += `<span class="context-menu-shortcut">${shortcut}</span>`;
    }
    item.innerHTML = html;
    return item;
}

function createMenuSeparator() {
    const sep = document.createElement('div');
    sep.className = 'context-menu-sep';
    return sep;
}

function showMenu(menuId) {
    closeAllMenus();
    const menu = document.getElementById(menuId);
    const btn = document.getElementById('menu-' + menuId.replace('-menu', ''));
    const rect = btn.getBoundingClientRect();
    menu.style.top = (rect.bottom + 4) + 'px';
    menu.style.left = rect.left + 'px';
    menu.classList.add('open');
    btn.classList.add('active');
}

function closeAllMenus() {
    document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('open'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
}

function populateMenus() {
    // FILE MENU
    const fileMenu = document.getElementById('file-menu');
    fileMenu.innerHTML = '';
    fileMenu.appendChild(createMenuItem('New File', 'file-earmark-plus', createNewFile, 'Ctrl+N'));
    fileMenu.appendChild(createMenuItem('Save', 'cloud-check', saveCurrentFile, 'Ctrl+S'));
    fileMenu.appendChild(createMenuSeparator());
    fileMenu.appendChild(createMenuItem('Export All', 'download', () => {
        if (IDE.fileManager.listFiles().length > 0) {
            IDE.fileManager.listFiles().forEach(f => IDE.fileManager.downloadFile(f));
        }
    }));
    fileMenu.appendChild(createMenuSeparator());
    fileMenu.appendChild(createMenuItem('Exit', 'box-arrow-right', () => window.close()));

    // EDIT MENU
    const editMenu = document.getElementById('edit-menu');
    editMenu.innerHTML = '';
    editMenu.appendChild(createMenuItem('Undo', 'arrow-counterclockwise', () => {
        if (window.IDE && window.IDE.editor) window.IDE.editor.trigger('', 'undo');
    }, 'Ctrl+Z'));
    editMenu.appendChild(createMenuItem('Redo', 'arrow-clockwise', () => {
        if (window.IDE && window.IDE.editor) window.IDE.editor.trigger('', 'redo');
    }, 'Ctrl+Y'));
    editMenu.appendChild(createMenuSeparator());
    editMenu.appendChild(createMenuItem('Cut', 'scissors', () => {
        if (window.IDE && window.IDE.editor) window.IDE.editor.trigger('', 'editor.action.clipboardCutAction');
    }, 'Ctrl+X'));
    editMenu.appendChild(createMenuItem('Copy', 'files', () => {
        if (window.IDE && window.IDE.editor) window.IDE.editor.trigger('', 'editor.action.clipboardCopyAction');
    }, 'Ctrl+C'));
    editMenu.appendChild(createMenuItem('Paste', 'clipboard', () => {
        if (window.IDE && window.IDE.editor) window.IDE.editor.trigger('', 'editor.action.clipboardPasteAction');
    }, 'Ctrl+V'));
    editMenu.appendChild(createMenuSeparator());
    editMenu.appendChild(createMenuItem('Select All', 'select', () => {
        if (window.IDE && window.IDE.editor) window.IDE.editor.trigger('', 'editor.action.selectAll');
    }, 'Ctrl+A'));
    editMenu.appendChild(createMenuItem('Find', 'search', () => {
        if (window.IDE && window.IDE.editor) window.IDE.editor.trigger('', 'actions.find');
    }, 'Ctrl+F'));
    editMenu.appendChild(createMenuItem('Replace', 'arrow-left-right', () => {
        if (window.IDE && window.IDE.editor) window.IDE.editor.trigger('', 'editor.action.startFindReplaceAction');
    }, 'Ctrl+H'));

    // VIEW MENU
    const viewMenu = document.getElementById('view-menu');
    viewMenu.innerHTML = '';
    viewMenu.appendChild(createMenuItem('Toggle Sidebar', 'layout-sidebar', () => {
        const sidebar = document.querySelector('.sidebar');
        const panels = document.querySelectorAll('.sidebar-panel');
        const isVisible = sidebar.style.display !== 'none';
        sidebar.style.display = isVisible ? 'none' : 'flex';
        panels.forEach(p => p.style.display = isVisible ? 'none' : 'flex');
    }, 'Ctrl+B'));
    viewMenu.appendChild(createMenuItem('Toggle Terminal', 'terminal', () => {
        const panel = document.querySelector('.output-panel');
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    }));
    viewMenu.appendChild(createMenuSeparator());
    viewMenu.appendChild(createMenuItem('Zoom In', 'zoom-in', () => {
        if (window.IDE && window.IDE.editor) window.IDE.editor.trigger('', 'editor.action.fontZoomIn');
    }, 'Ctrl++'));
    viewMenu.appendChild(createMenuItem('Zoom Out', 'zoom-out', () => {
        if (window.IDE && window.IDE.editor) window.IDE.editor.trigger('', 'editor.action.fontZoomOut');
    }, 'Ctrl+-'));

    // GIT MENU
    const gitMenu = document.getElementById('git-menu');
    gitMenu.innerHTML = '';
    gitMenu.appendChild(createMenuItem('Commit', 'check-circle', () => {
        const msg = prompt('Commit message:');
        if (msg) {
            const commit = IDE.gitManager.commit(msg, IDE.fileManager.files);
            IDE.terminal.success(`✓ Committed: ${commit.id.substring(0, 7)}`);
            renderGitHistory();
        }
    }, 'Ctrl+Shift+G'));
    gitMenu.appendChild(createMenuItem('View History', 'clock-history', () => {
        const commits = IDE.gitManager.getCommits();
        IDE.terminal.clear();
        IDE.terminal.info(`Commit History (${commits.length} total):`);
        commits.slice(-10).reverse().forEach(c => {
            IDE.terminal.info(`[${c.id.substring(0, 7)}] ${c.message}`);
        });
    }));

    // HELP MENU
    const helpMenu = document.getElementById('help-menu');
    helpMenu.innerHTML = '';
    helpMenu.appendChild(createMenuItem('Keyboard Shortcuts', 'keyboard', () => {
        IDE.terminal.clear();
        IDE.terminal.info('⌨️ Keyboard Shortcuts:');
        IDE.terminal.info('  Ctrl+N          New File');
        IDE.terminal.info('  Ctrl+S          Save');
        IDE.terminal.info('  Ctrl+A          Select All');
        IDE.terminal.info('  Ctrl+F          Find');
        IDE.terminal.info('  Ctrl+H          Replace');
        IDE.terminal.info('  Ctrl+Z          Undo');
        IDE.terminal.info('  Ctrl+Y          Redo');
        IDE.terminal.info('  Ctrl+X          Cut');
        IDE.terminal.info('  Ctrl+C          Copy');
        IDE.terminal.info('  Ctrl+V          Paste');
        IDE.terminal.info('  Ctrl+B          Toggle Sidebar');
        IDE.terminal.info('  F2              Rename File');
    }, '?'));
    helpMenu.appendChild(createMenuSeparator());
    helpMenu.appendChild(createMenuItem('About', 'info-circle', () => {
        IDE.terminal.clear();
        IDE.terminal.info('Browser IDE v1.0.0');
        IDE.terminal.info('A lightweight, production-grade code editor');
        IDE.terminal.info('');
        IDE.terminal.info('Features:');
        IDE.terminal.info('  ✓ Syntax highlighting for 50+ languages');
        IDE.terminal.info('  ✓ File management with localStorage');
        IDE.terminal.info('  ✓ Git-like commit history');
        IDE.terminal.info('  ✓ Full-text search');
        IDE.terminal.info('  ✓ Monaco editor with Monaco capabilities');
    }));
}

// ============================================================================
// Event Setup
// ============================================================================
function setupEvents() {
    // Menu button clicks
    document.getElementById('menu-file').addEventListener('click', () => showMenu('file-menu'));
    document.getElementById('menu-edit').addEventListener('click', () => showMenu('edit-menu'));
    document.getElementById('menu-view').addEventListener('click', () => showMenu('view-menu'));
    document.getElementById('menu-git').addEventListener('click', () => showMenu('git-menu'));
    document.getElementById('menu-help').addEventListener('click', () => showMenu('help-menu'));
    
    // Close menus on document click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-item') && !e.target.closest('.context-menu')) {
            closeAllMenus();
        }
    });
    
    document.getElementById('new-file-btn').addEventListener('click', createNewFile);
    document.getElementById('save-btn').addEventListener('click', saveCurrentFile);
    document.getElementById('clear-btn').addEventListener('click', () => IDE.terminal.clear());
    document.getElementById('clear-terminal-btn').addEventListener('click', () => IDE.terminal.clear());

    document.querySelectorAll('.sidebar-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-icon').forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
            
            const panel = icon.getAttribute('data-panel');
            document.querySelectorAll('.sidebar-panel').forEach(p => p.classList.remove('active'));
            const panelEl = document.getElementById(`${panel}-panel`);
            if (panelEl) panelEl.classList.add('active');
        });
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveCurrentFile();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            createNewFile();
        }
        if (e.key === 'F2' && IDE.fileManager.currentFile && !IDE.renaming) {
            e.preventDefault();
            const fileItem = document.querySelector('.file-item.active');
            if (fileItem) startRename(fileItem, IDE.fileManager.currentFile);
        }
    });

    let saveTimeout;
    if (window.IDE && window.IDE.editor) {
        window.IDE.editor.onDidChangeModelContent(() => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (IDE.fileManager.currentFile) {
                    saveCurrentFile();
                }
            }, 1000);
        });
    }
}

// ============================================================================
// Terminal Redirect
// ============================================================================
console.log('Initializing terminal...');
IDE.terminal = new TerminalManager('terminal');
IDE.terminal.info('Terminal initialized');

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function(...args) {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    IDE.terminal.log(message, 'info');
    originalLog.apply(console, args);
};

console.error = function(...args) {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    IDE.terminal.error(message);
    originalError.apply(console, args);
};

console.warn = function(...args) {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    IDE.terminal.warn(message);
    originalWarn.apply(console, args);
};

// ============================================================================
// Boot
// ============================================================================
async function boot() {
    try {
        IDE.terminal.info('📦 Loading systems...');
        
        let attempts = 0;
        while (!window.monacoReady && attempts < 200) {
            await new Promise(r => setTimeout(r, 50));
            attempts++;
        }
        
        if (!window.monacoReady) {
            IDE.terminal.error('✗ Monaco failed to load');
            return;
        }
        
        IDE.searchIndex = new SearchIndex();
        IDE.gitManager = new GitManager();
        IDE.fileManager = new FileManager();
        
        const files = IDE.fileManager.listFiles();
        if (files.length === 0) {
            const defaultFile = IDE.fileManager.createFile('untitled.txt');
            IDE.fileManager.currentFile = defaultFile;
        } else {
            IDE.fileManager.currentFile = files[0];
        }
        
        populateMenus();
        setupEvents();
        renderFileList();
        renderGitHistory();
        loadFile(IDE.fileManager.currentFile);
        
        IDE.isReady = true;
        IDE.terminal.success('✓ IDE Ready!');
        
    } catch (err) {
        IDE.terminal.error(`✗ Boot failed: ${err.message}`);
        console.error(err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
