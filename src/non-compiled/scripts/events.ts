/**
 * Events - Event handler setup and management
 */

import { showMenu, closeAllMenus } from './menus.js';
import { createNewFile } from './createNewFile.js';
import { saveCurrentFile } from './saveCurrentFile.js';
import { performSearch } from './performSearch.js';
import { startRename } from './startRename.js';

export interface IDEInterface {
    editor: any | null;
    terminal: any;
    fileManager: any;
    gitManager: any;
    searchIndex: any;
    isReady: boolean;
    renaming: boolean;
}

let IDE: IDEInterface;

export function setIDEInstance(ideInstance: IDEInterface): void {
    IDE = ideInstance;
}

export function setupEvents(): void {
    if (!IDE) return;

    // Menu button clicks
    const menuFile = document.getElementById('menu-file');
    if (menuFile) menuFile.addEventListener('click', () => showMenu('file-menu'));

    const menuEdit = document.getElementById('menu-edit');
    if (menuEdit) menuEdit.addEventListener('click', () => showMenu('edit-menu'));

    const menuView = document.getElementById('menu-view');
    if (menuView) menuView.addEventListener('click', () => showMenu('view-menu'));

    const menuGit = document.getElementById('menu-git');
    if (menuGit) menuGit.addEventListener('click', () => showMenu('git-menu'));

    const menuHelp = document.getElementById('menu-help');
    if (menuHelp) menuHelp.addEventListener('click', () => showMenu('help-menu'));

    // Close menus on document click
    document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.menu-item') && !target.closest('.context-menu')) {
            closeAllMenus();
        }
    });

    const newFileBtn = document.getElementById('new-file-btn');
    if (newFileBtn) newFileBtn.addEventListener('click', createNewFile);

    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveCurrentFile);

    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', () => IDE.terminal.clear());

    const clearTerminalBtn = document.getElementById('clear-terminal-btn');
    if (clearTerminalBtn) clearTerminalBtn.addEventListener('click', () => IDE.terminal.clear());

    document.querySelectorAll('.sidebar-icon').forEach((icon) => {
        icon.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-icon').forEach((i) => i.classList.remove('active'));
            (icon as HTMLElement).classList.add('active');

            const panel = (icon as HTMLElement).getAttribute('data-panel');
            document.querySelectorAll('.sidebar-panel').forEach((p) => p.classList.remove('active'));
            if (panel) {
                const panelEl = document.getElementById(`${panel}-panel`);
                if (panelEl) panelEl.classList.add('active');
            }
        });
    });

    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    if (searchInput) {
        searchInput.addEventListener('input', (e: Event) => {
            performSearch((e.target as HTMLInputElement).value);
        });
    }

    document.addEventListener('keydown', (e: KeyboardEvent) => {
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
            const fileItem = document.querySelector('.file-item.active') as HTMLElement;
            if (fileItem) {
                startRename(fileItem, IDE.fileManager.currentFile);
            }
        }
    });

    let saveTimeout: ReturnType<typeof setTimeout>;
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
