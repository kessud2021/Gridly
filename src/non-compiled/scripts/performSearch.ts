/**
 * Perform Search - Performs full-text search on files
 */

import { getFileIcon } from './getFileIcon.js';
import { loadFile } from './loadFile.js';
import { saveCurrentFile } from './saveCurrentFile.js';
import { renderFileList } from './renderFileList.js';

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

export function performSearch(query: string): void {
    if (!IDE) return;

    if (!query.trim()) {
        renderFileList();
        return;
    }

    const results = IDE.searchIndex.search(query);
    const fileList = document.getElementById('file-list');
    if (!fileList) return;

    fileList.innerHTML = '';
    results.forEach((fileName: string) => {
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

        const fileNameSpan = fileItem.querySelector('.file-name') as HTMLElement;
        if (fileNameSpan) {
            fileNameSpan.addEventListener('click', () => {
                saveCurrentFile();
                loadFile(fileName);
            });
        }

        fileList.appendChild(fileItem);
    });

    IDE.terminal.info(`Found ${results.length} results`);
}
