import { IDE } from './index.js';

export class FileManager {
    constructor() {
        this.files = this.loadFiles();
        this.currentFile = null;
    }

    generateFileName() {
        const bytes = new Uint8Array(24);
        crypto.getRandomValues(bytes);
        return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, '').substring(0, 32);
    }

    loadFiles() {
        const stored = localStorage.getItem('ide-files');
        return stored ? JSON.parse(stored) : {};
    }

    saveFiles() {
        localStorage.setItem('ide-files', JSON.stringify(this.files));
    }

    createFile(name = null) {
        const fileName = name || `${this.generateFileName()}.txt`;
        this.files[fileName] = '';
        this.saveFiles();
        IDE.searchIndex.indexFile(fileName, '');
        return fileName;
    }

    deleteFile(fileName) {
        delete this.files[fileName];
        this.saveFiles();
        IDE.searchIndex.removeFromIndex(fileName);
        if (this.currentFile === fileName) {
            this.currentFile = null;
        }
    }

    renameFile(oldName, newName) {
        if (this.files[newName]) {
            IDE.terminal.error(`File "${newName}" already exists`);
            return false;
        }
        this.files[newName] = this.files[oldName];
        delete this.files[oldName];
        this.saveFiles();
        IDE.searchIndex.removeFromIndex(oldName);
        IDE.searchIndex.indexFile(newName, this.files[newName]);
        
        if (this.currentFile === oldName) {
            this.currentFile = newName;
        }
        IDE.terminal.success(`✓ Renamed: ${oldName} → ${newName}`);
        return true;
    }

    getFile(fileName) {
        return this.files[fileName] || '';
    }

    setFile(fileName, content) {
        this.files[fileName] = content;
        this.saveFiles();
        IDE.searchIndex.indexFile(fileName, content);
    }

    listFiles() {
        return Object.keys(this.files).sort();
    }

    downloadFile(fileName) {
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
        IDE.terminal.success(`✓ Downloaded: ${fileName}`);
    }
}
