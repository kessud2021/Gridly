/**
 * Create New File - Creates a new file
 */

import { loadFile } from './loadFile.js';
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

export async function createNewFile(): Promise<void> {
    if (!IDE) return;
    const fileName = IDE.fileManager.createFile();
    loadFile(fileName);
    renderFileList();
    IDE.terminal.success(`✓ Created: ${fileName}`);
}
