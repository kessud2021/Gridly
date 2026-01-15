export class SearchIndex {
    constructor() {
        this.index = this.loadIndex();
    }

    loadIndex() {
        const stored = localStorage.getItem('ide-search-index');
        return stored ? JSON.parse(stored) : {};
    }

    saveIndex() {
        localStorage.setItem('ide-search-index', JSON.stringify(this.index));
    }

    indexFile(fileName, content) {
        this.index[fileName] = {
            name: fileName.toLowerCase(),
            content: content.toLowerCase(),
            timestamp: Date.now()
        };
        this.saveIndex();
    }

    removeFromIndex(fileName) {
        delete this.index[fileName];
        this.saveIndex();
    }

    search(query) {
        const q = query.toLowerCase();
        return Object.entries(this.index)
            .filter(([name, data]) => data.name.includes(q) || data.content.includes(q))
            .sort((a, b) => {
                const aMatch = a[1].name.includes(q);
                const bMatch = b[1].name.includes(q);
                if (aMatch !== bMatch) return bMatch - aMatch;
                return b[1].timestamp - a[1].timestamp;
            })
            .map(([name]) => name);
    }
}
