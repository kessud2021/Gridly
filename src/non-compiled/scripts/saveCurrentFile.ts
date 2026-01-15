/**
 * Save Current File - Saves the current file
 */

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

export function saveCurrentFile(): void {
    if (!IDE || !IDE.editor || !IDE.fileManager.currentFile) {
        return;
    }
    const content = IDE.editor.getValue();
    IDE.fileManager.setFile(IDE.fileManager.currentFile, content);
    IDE.terminal.success(`✓ Saved: ${IDE.fileManager.currentFile}`);
}
