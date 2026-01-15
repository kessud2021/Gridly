import { IDE } from './index.js';
import { getFileIcon } from './getFileIcon.js';
import { loadFile } from './loadFile.js';
import { saveCurrentFile } from './saveCurrentFile.js';
import { renderFileList } from './renderFileList.js';

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
