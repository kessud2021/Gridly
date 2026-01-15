/**
 * File Manager - Manages file operations and storage
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

interface FileSnapshot {
    [fileName: string]: string;
}

let IDE: IDEInterface;

export function setIDEInstance(ideInstance: IDEInterface): void {
    IDE = ideInstance;
}

export class FileManager {
    private files: FileSnapshot;
    currentFile: string | null;

    constructor() {
        this.files = this.loadFiles();
        this.currentFile = null;
    }

    private generateFileName(): string {
        const bytes = new Uint8Array(24);
        crypto.getRandomValues(bytes);
        return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, '').substring(0, 32);
    }

    private loadFiles(): FileSnapshot {
        const stored = localStorage.getItem('ide-files');
        return stored ? JSON.parse(stored) : {};
    }

    private saveFiles(): void {
        localStorage.setItem('ide-files', JSON.stringify(this.files));
    }

    createFile(name: string | null = null): string {
        const fileName = name || `${this.generateFileName()}.txt`;
        this.files[fileName] = '';
        this.saveFiles();
        if (IDE && IDE.searchIndex) {
            IDE.searchIndex.indexFile(fileName, '');
        }
        return fileName;
    }

    deleteFile(fileName: string): void {
        delete this.files[fileName];
        this.saveFiles();
        if (IDE && IDE.searchIndex) {
            IDE.searchIndex.removeFromIndex(fileName);
        }
        if (this.currentFile === fileName) {
            this.currentFile = null;
        }
    }

    renameFile(oldName: string, newName: string): boolean {
        if (this.files[newName]) {
            if (IDE && IDE.terminal) {
                IDE.terminal.error(`File "${newName}" already exists`);
            }
            return false;
        }
        this.files[newName] = this.files[oldName];
        delete this.files[oldName];
        this.saveFiles();
        if (IDE && IDE.searchIndex) {
            IDE.searchIndex.removeFromIndex(oldName);
            IDE.searchIndex.indexFile(newName, this.files[newName]);
        }

        if (this.currentFile === oldName) {
            this.currentFile = newName;
        }
        if (IDE && IDE.terminal) {
            IDE.terminal.success(`✓ Renamed: ${oldName} → ${newName}`);
        }
        return true;
    }

    getFile(fileName: string): string {
        return this.files[fileName] || '';
    }

    setFile(fileName: string, content: string): void {
        this.files[fileName] = content;
        this.saveFiles();
        if (IDE && IDE.searchIndex) {
            IDE.searchIndex.indexFile(fileName, content);
        }
    }

    listFiles(): string[] {
        return Object.keys(this.files).sort();
    }

    downloadFile(fileName: string): void {
        const content = this.files[fileName];
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (IDE && IDE.terminal) {
            IDE.terminal.success(`✓ Downloaded: ${fileName}`);
        }
    }
}
