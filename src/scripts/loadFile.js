import { IDE } from './index.js';
import { setMonacoLanguage } from './setMonacoLanguage.js';
import { renderFileList } from './renderFileList.js';

export function loadFile(fileName) {
    if (!IDE.editor) {
        setTimeout(() => loadFile(fileName), 100);
        return;
    }
    
    IDE.fileManager.currentFile = fileName;
    const content = IDE.fileManager.getFile(fileName);
    IDE.editor.setValue(content);
    setMonacoLanguage(fileName);
    renderFileList();
    IDE.terminal.info(`✓ Loaded: ${fileName}`);
}
