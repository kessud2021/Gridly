import { IDE } from './index.js';
import { setMonacoLanguage } from './setMonacoLanguage.js';
import { renderFileList } from './renderFileList.js';

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
