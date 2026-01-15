// ============================================================================
// Browser IDE Boot Script
// File management, git tracking, search indexing, and icons
// ============================================================================

console.log('🚀 Boot sequence starting...');

// Nerd Font icon mappings for file extensions
// Icons from Nerd Fonts (https://www.nerdfonts.com/)
const FILE_ICONS = {
    // Web - HTML/CSS/JS
    'html': '\uf13b', 'htm': '\uf13b', 'xml': '\uf072',
    'css': '\uf81e', 'scss': '\uf81e', 'sass': '\uf81e', 'less': '\uf81e',
    'js': '\uf41e', 'jsx': '\uf41e', 'mjs': '\uf41e',
    'ts': '\ufbf8', 'tsx': '\ufbf8',
    'json': '\ue60b', 'yml': '\uf481', 'yaml': '\uf481', 'toml': '\uf0cd', 'ini': '\uf412',
    'vue': '\uf41f', 'svelte': '\ue697', 'react': '\ue625',
    
    // Python
    'py': '\ue235', 'pyw': '\ue235', 'pyx': '\ue235', 'pyi': '\ue235',
    
    // Backend Languages
    'php': '\ue73d', 'java': '\ue738', 'class': '\ue738', 'jar': '\ue738',
    'cs': '\uf81a', 'csx': '\uf81a',
    'go': '\ufa52', 'rs': '\ue7a8', 'rlib': '\ue7a8',
    'c': '\ue61e', 'h': '\ue61e', 'cpp': '\ue61d', 'cc': '\ue61d', 'cxx': '\ue61d',
    'rb': '\ue791', 'erb': '\ue791', 'gemfile': '\ue791',
    'sh': '\uf489', 'bash': '\uf489', 'zsh': '\uf489', 'fish': '\uf489',
    'sql': '\uf1c0', 'db': '\uf1c0',
    'swift': '\ue755', 'kt': '\ue70e',
    'lua': '\ue620', 'perl': '\ue769', 'r': '\ue76d', 'scala': '\ue737',
    
    // Data & Markup
    'md': '\ue60f', 'markdown': '\ue60f', 'rst': '\ue60f', 'adoc': '\ue60f',
    'csv': '\ue60a', 'tsv': '\ue60a', 'xlsx': '\uf1c3', 'xls': '\uf1c3',
    
    // Config & Build
    'env': '\uf613', 'dockerfile': '\ue7b0', 'docker': '\ue7b0',
    'gitignore': '\uf1d3', 'gitconfig': '\uf1d3', 'gitmodules': '\uf1d3',
    'htaccess': '\uf412', 'package': '\ue71e', 'lock': '\uf023', 'webpack': '\uf72f',
    'config': '\uf612', 'conf': '\uf612', 'toml': '\uf0cd', 'gradle': '\ue256',
    'makefile': '\uf18e', 'cmake': '\ue60d', 'cmake_lists': '\ue60d',
    
    // Images
    'png': '\uf1c5', 'jpg': '\uf1c5', 'jpeg': '\uf1c5', 'gif': '\uf1c5', 
    'svg': '\uf1c5', 'webp': '\uf1c5', 'ico': '\uf1c5', 'bmp': '\uf1c5',
    'tiff': '\uf1c5', 'psd': '\ue7c5',
    
    // Media
    'mp3': '\uf1c7', 'wav': '\uf1c7', 'flac': '\uf1c7', 'm4a': '\uf1c7',
    'aac': '\uf1c7', 'opus': '\uf1c7',
    'mp4': '\uf1c8', 'mov': '\uf1c8', 'avi': '\uf1c8', 'mkv': '\uf1c8', 
    'webm': '\uf1c8', 'flv': '\uf1c8', 'mov': '\uf1c8',
    
    // Archives
    'zip': '\uf410', 'rar': '\uf410', '7z': '\uf410', 'tar': '\uf410', 
    'gz': '\uf410', 'bz2': '\uf410', 'xz': '\uf410',
    
    // Documents
    'pdf': '\ue60e', 'doc': '\uf1c2', 'docx': '\uf1c2', 'odt': '\uf1c2',
    'xls': '\uf1c3', 'ods': '\uf1c3',
    'ppt': '\uf1c4', 'pptx': '\uf1c4', 'odp': '\uf1c4',
    'txt': '\uf15c', 'rtf': '\uf15c',
    
    // Fonts
    'ttf': '\uf031', 'otf': '\uf031', 'woff': '\uf031', 'woff2': '\uf031',
    
    // Code Quality & Testing
    'test': '\uf188', 'spec': '\uf188', 'eslintrc': '\uf499', 'editorconfig': '\ue615',
    'prettierrc': '\ue60f', 'babelrc': '\ue60f',
};

// Language mappings for Monaco editor syntax highlighting
const LANGUAGE_MAP = {
    // Web
    'html': 'html', 'htm': 'html', 'xml': 'xml',
    'css': 'css', 'scss': 'scss', 'sass': 'scss', 'less': 'less',
    'js': 'javascript', 'jsx': 'javascript', 'mjs': 'javascript',
    'ts': 'typescript', 'tsx': 'typescript',
    'json': 'json', 'jsonc': 'jsonc',
    'yml': 'yaml', 'yaml': 'yaml',
    'toml': 'toml', 'ini': 'ini',
    'vue': 'vue', 'svelte': 'svelte',
    
    // Python
    'py': 'python', 'pyw': 'python', 'pyx': 'python', 'pyi': 'python',
    
    // Backend Languages
    'php': 'php', 'phtml': 'php',
    'java': 'java', 'class': 'java', 'jar': 'java',
    'cs': 'csharp', 'csx': 'csharp',
    'go': 'go',
    'rs': 'rust', 'rlib': 'rust',
    'c': 'c', 'h': 'c',
    'cpp': 'cpp', 'cc': 'cpp', 'cxx': 'cpp', 'hpp': 'cpp',
    'rb': 'ruby', 'erb': 'ruby', 'gemfile': 'ruby',
    'sh': 'shell', 'bash': 'shell', 'zsh': 'shell', 'fish': 'shell',
    'sql': 'sql', 'db': 'sql',
    'swift': 'swift',
    'kt': 'kotlin', 'kts': 'kotlin',
    'lua': 'lua',
    'perl': 'perl', 'pl': 'perl',
    'r': 'r',
    'scala': 'scala',
    'groovy': 'groovy', 'gradle': 'groovy',
    'clj': 'clojure', 'cljs': 'clojure',
    'erl': 'erlang', 'hrl': 'erlang',
    'ex': 'elixir', 'exs': 'elixir',
    'edn': 'clojure',
    'nim': 'nim',
    'ml': 'ocaml', 'mli': 'ocaml',
    'fs': 'fsharp', 'fsi': 'fsharp', 'fsx': 'fsharp',
    'hx': 'haxe',
    'dart': 'dart',
    'pas': 'pascal', 'pp': 'pascal',
    'asm': 'assembly', 's': 'assembly',
    'vb': 'vb', 'vbs': 'vb',
    'ps1': 'powershell', 'psd1': 'powershell', 'psm1': 'powershell',
    
    // Markup & Data
    'md': 'markdown', 'markdown': 'markdown', 'rst': 'rst', 'adoc': 'asciidoc',
    'csv': 'csv', 'tsv': 'tsv',
    'latex': 'latex', 'tex': 'latex',
    'handlebars': 'handlebars', 'hbs': 'handlebars',
    'ejs': 'ejs', 'jsp': 'jsp', 'jspx': 'jsp',
    'pug': 'pug', 'jade': 'pug',
    'haml': 'haml', 'slim': 'slim',
    
    // Config & Build
    'env': 'plaintext', 'dockerfile': 'dockerfile', 'docker': 'dockerfile',
    'gitignore': 'plaintext', 'gitconfig': 'plaintext', 'gitmodules': 'plaintext',
    'htaccess': 'plaintext',
    'package': 'json', 'lock': 'json',
    'webpack': 'javascript', 'webpack_config': 'javascript',
    'config': 'plaintext', 'conf': 'plaintext',
    'makefile': 'makefile', 'cmake': 'cmake',
    'editorconfig': 'plaintext',
    'eslintrc': 'json',
    'prettierrc': 'json',
    'babelrc': 'json',
    
    // Documents
    'pdf': 'plaintext',
    'doc': 'plaintext', 'docx': 'plaintext', 'odt': 'plaintext',
    'xls': 'plaintext', 'xlsx': 'plaintext', 'ods': 'plaintext',
    'ppt': 'plaintext', 'pptx': 'plaintext', 'odp': 'plaintext',
    'txt': 'plaintext', 'rtf': 'plaintext', 'text': 'plaintext',
    
    // Default
    'default': 'plaintext'
};

// Global IDE state
const IDE = {
    editor: null,
    terminal: null,
    fileManager: null,
    gitManager: null,
    searchIndex: null,
    isReady: false,
    logs: [],
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
            .filter(([name, data]) => 
                data.name.includes(q) || data.content.includes(q)
            )
            .sort((a, b) => {
                // Prioritize filename matches
                const aMatch = a[1].name.includes(q);
                const bMatch = b[1].name.includes(q);
                if (aMatch !== bMatch) return bMatch - aMatch;
                return b[1].timestamp - a[1].timestamp;
            })
            .map(([name]) => name);
    }
}

// ============================================================================
// Git Management System
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

    getCommitStats() {
        const daily = {};
        this.commits.forEach(commit => {
            const date = new Date(commit.timestamp).toLocaleDateString();
            daily[date] = (daily[date] || 0) + 1;
        });
        return daily;
    }
}

// ============================================================================
// File Management System
// ============================================================================
class FileManager {
    constructor() {
        this.files = this.loadFiles();
        this.currentFile = null;
    }

    generateFileName() {
        const bytes = new Uint8Array(24);
        crypto.getRandomValues(bytes);
        return btoa(String.fromCharCode(...bytes))
            .replace(/[+/=]/g, '')
            .substring(0, 32);
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
// Get File Icon
// ============================================================================
function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    return FILE_ICONS[ext] || '\uf15c'; // Default to text file icon
}

// Get Monaco Language for file extension
function getMonacoLanguage(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    return LANGUAGE_MAP[ext] || LANGUAGE_MAP['default'];
}

// Set Monaco Editor Language
function setMonacoLanguage(fileName) {
    if (!window.IDE || !window.IDE.editor || !window.monaco) return;
    
    const language = getMonacoLanguage(fileName);
    const model = window.IDE.editor.getModel();
    
    if (model) {
        window.monaco.editor.setModelLanguage(model, language);
        console.log(`✓ Language set to: ${language}`);
    }
}

// ============================================================================
// Initialize Terminal
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
// Initialize Monaco Editor
// ============================================================================
function initMonaco() {
    return new Promise((resolve) => {
        console.log('Waiting for Monaco Editor...');
        let attempts = 0;
        const checkMonaco = setInterval(() => {
            if (window.monacoReady && window.IDE && window.IDE.editor) {
                clearInterval(checkMonaco);
                console.log('✓ Monaco Editor ready');
                resolve();
            } else {
                attempts++;
                if (attempts > 200) {
                    console.error('✗ Monaco failed to initialize');
                    clearInterval(checkMonaco);
                    resolve();
                }
            }
        }, 50);
    });
}

// ============================================================================
// Initialize Systems
// ============================================================================
function initSystems() {
    console.log('Initializing systems...');
    IDE.searchIndex = new SearchIndex();
    IDE.gitManager = new GitManager();
    IDE.fileManager = new FileManager();
    
    const files = IDE.fileManager.listFiles();
    if (files.length === 0) {
        const defaultFile = IDE.fileManager.createFile('untitled.txt');
        IDE.fileManager.currentFile = defaultFile;
        console.log('✓ Created default file');
    } else {
        IDE.fileManager.currentFile = files[0];
        console.log(`✓ Loaded ${files.length} files`);
    }
    
    renderFileList();
    loadFile(IDE.fileManager.currentFile);
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
            <span class="file-name" data-file="${fileName}">${fileName}</span>
            <div class="file-actions">
                <button class="file-btn rename-btn" title="Rename (F2)">✎</button>
                <button class="file-btn download-btn" title="Download">⬇</button>
                <button class="file-btn delete-btn" title="Delete">✕</button>
            </div>
        `;
        
        fileItem.querySelector('.file-name').addEventListener('click', () => {
            saveFile(IDE.fileManager.currentFile);
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
            // Update language if extension changed
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

function saveFile(fileName) {
    if (!window.IDE || !window.IDE.editor) return;
    const content = window.IDE.editor.getValue();
    IDE.fileManager.setFile(fileName, content);
    IDE.terminal.info(`✓ Saved: ${fileName}`);
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
            saveFile(IDE.fileManager.currentFile);
            loadFile(fileName);
        });
        
        fileList.appendChild(fileItem);
    });
    
    IDE.terminal.info(`Found ${results.length} results`);
}

// ============================================================================
// Event Listeners
// ============================================================================
function setupEventListeners() {
    const runBtn = document.getElementById('run-btn');
    const clearBtn = document.getElementById('clear-btn');

    runBtn.addEventListener('click', () => {
        if (!IDE.fileManager.currentFile) {
            IDE.terminal.error('No file open');
            return;
        }
        saveFile(IDE.fileManager.currentFile);
        IDE.terminal.success('✓ File saved');
    });

    clearBtn.addEventListener('click', () => {
        IDE.terminal.clear();
        IDE.terminal.info('Terminal cleared');
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (IDE.fileManager.currentFile) {
                saveFile(IDE.fileManager.currentFile);
            }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            createNewFile();
        }
        if (e.key === 'F2' && IDE.fileManager.currentFile && !IDE.renaming) {
            e.preventDefault();
            const fileItem = document.querySelector(`.file-item.active`);
            if (fileItem) {
                startRename(fileItem, IDE.fileManager.currentFile);
            }
        }
    });

    const sidebarIcons = document.querySelectorAll('.sidebar-icon');
    sidebarIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            sidebarIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
            
            const panel = icon.getAttribute('data-panel');
            document.querySelectorAll('.sidebar-panel').forEach(p => p.classList.remove('active'));
            const panelEl = document.getElementById(`${panel}-panel`);
            if (panelEl) panelEl.classList.add('active');
        });
    });

    const newFileBtn = document.getElementById('new-file-btn');
    if (newFileBtn) {
        newFileBtn.addEventListener('click', createNewFile);
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }

    // Auto-save on editor change
    let saveTimeout;
    if (window.IDE && window.IDE.editor) {
        window.IDE.editor.onDidChangeModelContent(() => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (IDE.fileManager.currentFile) {
                    saveFile(IDE.fileManager.currentFile);
                }
            }, 1000);
        });
    }
}

// ============================================================================
// Main Boot Sequence
// ============================================================================
async function boot() {
    try {
        IDE.terminal.info('📦 Loading dependencies...');
        await initMonaco();
        initSystems();
        setupEventListeners();
        
        IDE.isReady = true;
        IDE.terminal.success('✓ IDE Ready! (Ctrl+S save, Ctrl+N new, F2 rename)');
        
    } catch (err) {
        IDE.terminal.error(`Boot failed: ${err.message}`);
        console.error(err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
