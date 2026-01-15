import { IDE } from './index.js';
import { createNewFile } from './createNewFile.js';
import { saveCurrentFile } from './saveCurrentFile.js';
import { performSearch } from './performSearch.js';
import { renderGitHistory } from './renderGitHistory.js';

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

export function showMenu(menuId) {
    closeAllMenus();
    const menu = document.getElementById(menuId);
    const btn = document.getElementById('menu-' + menuId.replace('-menu', ''));
    const rect = btn.getBoundingClientRect();
    menu.style.top = (rect.bottom + 4) + 'px';
    menu.style.left = rect.left + 'px';
    menu.classList.add('open');
    btn.classList.add('active');
}

export function closeAllMenus() {
    document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('open'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
}

export function populateMenus() {
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
        if (IDE.editor) IDE.editor.trigger('', 'undo');
    }, 'Ctrl+Z'));
    editMenu.appendChild(createMenuItem('Redo', 'arrow-clockwise', () => {
        if (IDE.editor) IDE.editor.trigger('', 'redo');
    }, 'Ctrl+Y'));
    editMenu.appendChild(createMenuSeparator());
    editMenu.appendChild(createMenuItem('Cut', 'scissors', () => {
        if (IDE.editor) IDE.editor.trigger('', 'editor.action.clipboardCutAction');
    }, 'Ctrl+X'));
    editMenu.appendChild(createMenuItem('Copy', 'files', () => {
        if (IDE.editor) IDE.editor.trigger('', 'editor.action.clipboardCopyAction');
    }, 'Ctrl+C'));
    editMenu.appendChild(createMenuItem('Paste', 'clipboard', () => {
        if (IDE.editor) IDE.editor.trigger('', 'editor.action.clipboardPasteAction');
    }, 'Ctrl+V'));
    editMenu.appendChild(createMenuSeparator());
    editMenu.appendChild(createMenuItem('Select All', 'select', () => {
        if (IDE.editor) IDE.editor.trigger('', 'editor.action.selectAll');
    }, 'Ctrl+A'));
    editMenu.appendChild(createMenuItem('Find', 'search', () => {
        if (IDE.editor) IDE.editor.trigger('', 'actions.find');
    }, 'Ctrl+F'));
    editMenu.appendChild(createMenuItem('Replace', 'arrow-left-right', () => {
        if (IDE.editor) IDE.editor.trigger('', 'editor.action.startFindReplaceAction');
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
        if (IDE.editor) IDE.editor.trigger('', 'editor.action.fontZoomIn');
    }, 'Ctrl++'));
    viewMenu.appendChild(createMenuItem('Zoom Out', 'zoom-out', () => {
        if (IDE.editor) IDE.editor.trigger('', 'editor.action.fontZoomOut');
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
