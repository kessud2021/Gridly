import { IDE } from './index.js';

export function saveCurrentFile() {
    if (!IDE.editor || !IDE.fileManager.currentFile) return;
    const content = IDE.editor.getValue();
    IDE.fileManager.setFile(IDE.fileManager.currentFile, content);
    IDE.terminal.success(`✓ Saved: ${IDE.fileManager.currentFile}`);
}
