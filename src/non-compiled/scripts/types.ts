/**
 * TypeScript type definitions for the Browser IDE
 */

// @ts-nocheck

export interface LogEntry {
    message: string;
    type: 'info' | 'error' | 'success' | 'warning';
    timestamp: string;
}

export interface FileSnapshot {
    [fileName: string]: string;
}

export interface IndexedFile {
    name: string;
    content: string;
    timestamp: number;
}

export interface FileIndex {
    [fileName: string]: IndexedFile;
}

export interface Commit {
    id: string;
    message: string;
    timestamp: number;
    files: FileSnapshot;
    stats: number;
}

export interface IDEInterface {
    editor: any | null;
    terminal: TerminalManager | null;
    fileManager: FileManager | null;
    gitManager: GitManager | null;
    searchIndex: SearchIndex | null;
    isReady: boolean;
    renaming: boolean;
}

// Import classes for type references (they're defined in their own files)
export class TerminalManager {
    constructor(elementId: string);
    log(message: string, type?: 'info' | 'error' | 'success' | 'warning'): void;
    clear(): void;
    error(message: string): void;
    success(message: string): void;
    warn(message: string): void;
    info(message: string): void;
}

export class SearchIndex {
    constructor();
    loadIndex(): FileIndex;
    saveIndex(): void;
    indexFile(fileName: string, content: string): void;
    removeFromIndex(fileName: string): void;
    search(query: string): string[];
}

export class GitManager {
    constructor();
    loadCommits(): Commit[];
    saveCommits(): void;
    commit(message: string, fileSnapshot: FileSnapshot): Commit;
    generateId(): string;
    getCommits(): Commit[];
}

export class FileManager {
    constructor();
    generateFileName(): string;
    loadFiles(): FileSnapshot;
    saveFiles(): void;
    createFile(name?: string | null): string;
    deleteFile(fileName: string): void;
    renameFile(oldName: string, newName: string): boolean;
    getFile(fileName: string): string;
    setFile(fileName: string, content: string): void;
    listFiles(): string[];
    downloadFile(fileName: string): void;
}
