// ============================================================================
// Browser IDE Boot Script
// Initializes Monaco Editor, Brython, SQL.js, and Terminal
// ============================================================================

console.log('🚀 Boot sequence starting...');

// Global IDE state
const IDE = {
    editor: null,
    terminal: null,
    db: null,
    isReady: false,
    logs: []
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

    error(message) {
        this.log(message, 'error');
    }

    success(message) {
        this.log(message, 'success');
    }

    warn(message) {
        this.log(message, 'warning');
    }

    info(message) {
        this.log(message, 'info');
    }
}

// ============================================================================
// Initialize Terminal First
// ============================================================================
console.log('Initializing terminal...');
IDE.terminal = new TerminalManager('terminal');
IDE.terminal.info('Terminal initialized');

// ============================================================================
// Redirect console to terminal
// ============================================================================
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function(...args) {
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    IDE.terminal.log(message, 'info');
    originalLog.apply(console, args);
};

console.error = function(...args) {
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    IDE.terminal.error(message);
    originalError.apply(console, args);
};

console.warn = function(...args) {
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    IDE.terminal.warn(message);
    originalWarn.apply(console, args);
};

// ============================================================================
// Wait for Monaco to be ready (initialized in HTML)
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
// Initialize SQL.js
// ============================================================================
async function initSqlJs() {
    return new Promise((resolve) => {
        console.log('Initializing SQL.js...');
        
        if (typeof initSqlJs !== 'undefined') {
            // Configure SQL.js with correct WASM path
            initSqlJs({
                locateFile: (file) => {
                    // Resolve WASM file path relative to HTML
                    const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
                    return basePath + '/../lib/' + file;
                }
            }).then((SQL) => {
                IDE.db = new SQL.Database();
                console.log('✓ SQL.js initialized');
                resolve();
            }).catch((err) => {
                console.error('✗ SQL.js initialization failed:', err);
                resolve();
            });
        } else {
            console.warn('⚠ initSqlJs not available');
            resolve();
        }
    });
}

// ============================================================================
// Initialize Brython
// ============================================================================
async function initBrython() {
    return new Promise((resolve) => {
        console.log('Initializing Brython...');
        
        if (typeof Brython !== 'undefined') {
            try {
                // Set Brython path
                if (typeof __BRYTHON__ !== 'undefined') {
                    __BRYTHON__.brython_path = '../lib/';
                }
                
                // Configure stdout/stderr to send to terminal
                Brython({
                    debug: 0,
                    hash: 'none',
                    static_stdlib_modules: true
                });
                
                console.log('✓ Brython initialized');
                resolve();
            } catch (err) {
                console.error('✗ Brython initialization failed:', err);
                resolve();
            }
        } else {
            console.warn('⚠ Brython not available');
            resolve();
        }
    });
}

// ============================================================================
// Run Python Code
// ============================================================================
async function runPython(code) {
    if (!IDE.db) {
        IDE.terminal.error('SQL.js not initialized');
        return;
    }

    IDE.terminal.log('═══════════════════════════════════');
    IDE.terminal.info('Executing Python code...');
    IDE.terminal.log('═══════════════════════════════════');

    try {
        // Create a custom execution environment
        const pythonEnv = {
            __builtins__: {
                print: (...args) => {
                    const output = args.map(arg => String(arg)).join(' ');
                    IDE.terminal.info(output);
                }
            },
            db: IDE.db
        };

        // Execute code using Brython
        if (typeof Brython !== 'undefined') {
            // Wrap code in a try-catch for Brython
            const wrappedCode = `
try:
    ${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
`;
            eval(wrappedCode);
        } else {
            IDE.terminal.error('Brython runtime not available');
        }

        IDE.terminal.success('✓ Execution completed');
    } catch (err) {
        IDE.terminal.error(`Execution error: ${err.message}`);
    }

    IDE.terminal.log('═══════════════════════════════════');
}

// ============================================================================
// Event Listeners
// ============================================================================
function setupEventListeners() {
    const runBtn = document.getElementById('run-btn');
    const clearBtn = document.getElementById('clear-btn');

    runBtn.addEventListener('click', () => {
        if (!window.IDE || !window.IDE.editor) {
            IDE.terminal.error('Editor not ready');
            return;
        }
        const code = window.IDE.editor.getValue();
        runPython(code);
    });

    clearBtn.addEventListener('click', () => {
        IDE.terminal.clear();
        IDE.terminal.info('Terminal cleared');
    });

    // Keyboard shortcut: Ctrl+Enter to run
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('run-btn').click();
        }
    });
}

// ============================================================================
// Main Boot Sequence
// ============================================================================
async function boot() {
    try {
        IDE.terminal.info('📦 Loading dependencies...');
        
        await initMonaco();
        await initBrython();
        await initSqlJs();
        
        setupEventListeners();
        
        IDE.isReady = true;
        IDE.terminal.success('✓ IDE Ready! (Ctrl+Enter to run)');
        
    } catch (err) {
        IDE.terminal.error(`Boot failed: ${err.message}`);
        console.error(err);
    }
}

// Start boot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
