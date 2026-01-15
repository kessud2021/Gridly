import { IDE } from './index.js';
import { getFileIcon, setMonacoLanguage } from './helpers.js';

export function renderFileList() {
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

export function startRename(fileItem, oldName) {
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

export function loadFile(fileName) {
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

export function saveCurrentFile() {
    if (!window.IDE || !window.IDE.editor || !IDE.fileManager.currentFile) return;
    const content = window.IDE.editor.getValue();
    IDE.fileManager.setFile(IDE.fileManager.currentFile, content);
    IDE.terminal.success(`✓ Saved: ${IDE.fileManager.currentFile}`);
}

export function createNewFile() {
    const fileName = IDE.fileManager.createFile();
    loadFile(fileName);
    renderFileList();
    IDE.terminal.success(`✓ Created: ${fileName}`);
}

export function performSearch(query) {
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

export function renderGitHistory() {
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
