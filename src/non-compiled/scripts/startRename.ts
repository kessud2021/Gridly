/**
 * Start Rename - Handles file renaming
 */

import { setMonacoLanguage } from './setMonacoLanguage.js';
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

export function startRename(fileItem: HTMLElement, oldName: string): void {
    if (!IDE) return;

    if (IDE.renaming) return;
    IDE.renaming = true;

    const nameSpan = fileItem.querySelector('.file-name') as HTMLElement;
    if (!nameSpan) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'file-rename-input';
    input.value = oldName;
    input.maxLength = 255;

    nameSpan.replaceWith(input);
    input.focus();
    input.select();

    const finishRename = (): void => {
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
    input.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') finishRename();
        if (e.key === 'Escape') IDE.renaming = false;
    });
}
