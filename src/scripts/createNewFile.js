import { IDE } from './index.js';
import { loadFile } from './loadFile.js';
import { renderFileList } from './renderFileList.js';

export async function createNewFile() {
    const fileName = IDE.fileManager.createFile();
    loadFile(fileName);
    renderFileList();
    IDE.terminal.success(`✓ Created: ${fileName}`);
}
