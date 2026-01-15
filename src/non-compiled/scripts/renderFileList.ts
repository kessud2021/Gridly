/**
 * Render File List - Renders the file list UI
 */

import { getFileIcon } from './getFileIcon.js';
import { startRename } from './startRename.js';
import { loadFile } from './loadFile.js';
import { saveCurrentFile } from './saveCurrentFile.js';
import { createNewFile } from './createNewFile.js';

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

export function renderFileList(): void {
    if (!IDE) return;

    const fileList = document.getElementById('file-list');
    if (!fileList) return;

    fileList.innerHTML = '';
    const files = IDE.fileManager.listFiles();

    files.forEach((fileName: string) => {
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

        const fileNameSpan = fileItem.querySelector('.file-name') as HTMLElement;
        if (fileNameSpan) {
            fileNameSpan.addEventListener('click', () => {
                saveCurrentFile();
                loadFile(fileName);
            });
        }

        const renameBtn = fileItem.querySelector('.rename-btn') as HTMLElement;
        if (renameBtn) {
            renameBtn.addEventListener('click', (e: Event) => {
                e.stopPropagation();
                startRename(fileItem, fileName);
            });
        }

        const downloadBtn = fileItem.querySelector('.download-btn') as HTMLElement;
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e: Event) => {
                e.stopPropagation();
                IDE.fileManager.downloadFile(fileName);
            });
        }

        const deleteBtn = fileItem.querySelector('.delete-btn') as HTMLElement;
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e: Event) => {
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
        }

        fileList.appendChild(fileItem);
    });
}
