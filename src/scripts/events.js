import { IDE } from './index.js';
import { showMenu, closeAllMenus } from './menus.js';
import { createNewFile } from './createNewFile.js';
import { saveCurrentFile } from './saveCurrentFile.js';
import { performSearch } from './performSearch.js';
import { startRename } from './startRename.js';

export function setupEvents() {
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
            if (fileItem) {
                startRename(fileItem, IDE.fileManager.currentFile);
            }
        }
    });

    let saveTimeout;
    if (IDE.editor) {
        IDE.editor.onDidChangeModelContent(() => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (IDE.fileManager.currentFile) {
                    saveCurrentFile();
                }
            }, 1000);
        });
    }
}
