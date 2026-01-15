/**
 * Search Index - Manages full-text search functionality
 */

interface IndexedFile {
    name: string;
    content: string;
    timestamp: number;
}

interface FileIndex {
    [fileName: string]: IndexedFile;
}

export class SearchIndex {
    private index: FileIndex;

    constructor() {
        this.index = this.loadIndex();
    }

    private loadIndex(): FileIndex {
        const stored = localStorage.getItem('ide-search-index');
        return stored ? JSON.parse(stored) : {};
    }

    private saveIndex(): void {
        localStorage.setItem('ide-search-index', JSON.stringify(this.index));
    }

    indexFile(fileName: string, content: string): void {
        this.index[fileName] = {
            name: fileName.toLowerCase(),
            content: content.toLowerCase(),
            timestamp: Date.now()
        };
        this.saveIndex();
    }

    removeFromIndex(fileName: string): void {
        delete this.index[fileName];
        this.saveIndex();
    }

    search(query: string): string[] {
        const q = query.toLowerCase();
        return Object.entries(this.index)
            .filter(([name, data]: [string, IndexedFile]) =>
                data.name.includes(q) || data.content.includes(q)
            )
            .sort((a: [string, IndexedFile], b: [string, IndexedFile]) => {
                const aMatch = a[1].name.includes(q);
                const bMatch = b[1].name.includes(q);
                if (aMatch !== bMatch) return (bMatch ? 1 : 0) - (aMatch ? 1 : 0);
                return b[1].timestamp - a[1].timestamp;
            })
            .map(([name]: [string, IndexedFile]) => name);
    }
}
