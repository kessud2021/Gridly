import { IDE } from './index.js';
import { getFileIcon } from './getFileIcon.js';
import { startRename } from './startRename.js';
import { loadFile } from './loadFile.js';
import { saveCurrentFile } from './saveCurrentFile.js';
import { createNewFile } from './createNewFile.js';

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
