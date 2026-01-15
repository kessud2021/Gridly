/**
 * Browser IDE - Main Index/Boot Module
 * Imports and initializes all modules
 */

import { TerminalManager } from './terminal.js';
import { SearchIndex } from './search-index.js';
import { GitManager } from './git-manager.js';
import { FileManager, setIDEInstance as setFileManagerIDE } from './file-manager.js';
import { setupEvents, setIDEInstance as setEventsIDE } from './events.js';
import { populateMenus, setIDEInstance as setMenusIDE } from './menus.js';
import { renderFileList, setIDEInstance as setRenderFileListIDE } from './renderFileList.js';
import { renderGitHistory, setIDEInstance as setRenderGitHistoryIDE } from './renderGitHistory.js';
import { loadFile, setIDEInstance as setLoadFileIDE } from './loadFile.js';
import { saveCurrentFile, setIDEInstance as setSaveCurrentFileIDE } from './saveCurrentFile.js';
import { createNewFile, setIDEInstance as setCreateNewFileIDE } from './createNewFile.js';
import { performSearch, setIDEInstance as setPerformSearchIDE } from './performSearch.js';
import { startRename, setIDEInstance as setStartRenameIDE } from './startRename.js';
import { setMonacoLanguage, setIDEInstance as setMonacoLanguageIDE } from './setMonacoLanguage.js';

// ============================================================================
// IDE State - Global IDE interface
// ============================================================================
export interface IDEInterface {
    editor: any | null;
    terminal: TerminalManager | null;
    fileManager: FileManager | null;
    gitManager: GitManager | null;
    searchIndex: SearchIndex | null;
    isReady: boolean;
    renaming: boolean;
    files?: Record<string, string>;
}

// Global IDE state
export const IDE: IDEInterface = {
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

console.log = function (...args: any[]): void {
    const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
    if (IDE.terminal) IDE.terminal.log(message, 'info');
    originalLog.apply(console, args);
};

console.error = function (...args: any[]): void {
    const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
    if (IDE.terminal) IDE.terminal.error(message);
    originalError.apply(console, args);
};

console.warn = function (...args: any[]): void {
    const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
    if (IDE.terminal) IDE.terminal.warn(message);
    originalWarn.apply(console, args);
};

// ============================================================================
// Main Boot Function
// ============================================================================
async function boot(): Promise<void> {
    try {
        if (!IDE.terminal) return;

        IDE.terminal.info('📦 Loading systems...');

        let attempts = 0;
        while (!(window as any).monacoReady && attempts < 200) {
            await new Promise((r) => setTimeout(r, 50));
            attempts++;
        }

        if (!(window as any).monacoReady) {
            if (IDE.terminal) IDE.terminal.error('✗ Monaco failed to load');
            return;
        }

        // Capture Monaco editor from window.IDE
        IDE.editor = (window as any).IDE.editor;

        IDE.searchIndex = new SearchIndex();
        IDE.gitManager = new GitManager();
        IDE.fileManager = new FileManager();

        // Set IDE instance for all modules that need it
        setFileManagerIDE(IDE);
        setEventsIDE(IDE);
        setMenusIDE(IDE);
        setRenderFileListIDE(IDE);
        setRenderGitHistoryIDE(IDE);
        setLoadFileIDE(IDE);
        setSaveCurrentFileIDE(IDE);
        setCreateNewFileIDE(IDE);
        setPerformSearchIDE(IDE);
        setStartRenameIDE(IDE);
        setMonacoLanguageIDE(IDE);

        // Make fileManager.files accessible for menu
        Object.defineProperty(IDE, 'files', {
            get() {
                return IDE.fileManager?.files || {};
            }
        });

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
        if (IDE.terminal) IDE.terminal.success('✓ IDE Ready!');
    } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        if (IDE.terminal) IDE.terminal.error(`✗ Boot failed: ${errMsg}`);
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
