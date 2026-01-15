/**
 * Load File - Loads a file into the editor
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

export function loadFile(fileName: string): void {
    if (!IDE || !IDE.editor) {
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
