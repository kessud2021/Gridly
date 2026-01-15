// ============================================================================
// Browser IDE - Main Index/Boot Module
// Imports and initializes all modules
// ============================================================================

import { TerminalManager } from './terminal.js';
import { SearchIndex } from './search-index.js';
import { GitManager } from './git-manager.js';
import { FileManager } from './file-manager.js';
import { setupEvents } from './events.js';
import { populateMenus } from './menus.js';
import { renderFileList } from './renderFileList.js';
import { renderGitHistory } from './renderGitHistory.js';
import { loadFile } from './loadFile.js';

// Global IDE state
export const IDE = {
    editor: null,
    terminal: null,
    fileManager: null,
    gitManager: null,
    searchIndex: null,
    isReady: false,
    renaming: false
};

console.log('🚀 Browser IDE Starting...');

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
// Main Boot Function
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
        
        // Capture Monaco editor from window.IDE
        IDE.editor = window.IDE.editor;
        
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

// Boot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

// Export for external use if needed
export { boot };
