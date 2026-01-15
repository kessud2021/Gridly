export class GitManager {
    constructor() {
        this.commits = this.loadCommits();
    }

    loadCommits() {
        const stored = localStorage.getItem('ide-git-commits');
        return stored ? JSON.parse(stored) : [];
    }

    saveCommits() {
        localStorage.setItem('ide-git-commits', JSON.stringify(this.commits));
    }

    commit(message, fileSnapshot) {
        const commit = {
            id: this.generateId(),
            message: message,
            timestamp: Date.now(),
            files: fileSnapshot,
            stats: Object.keys(fileSnapshot).length
        };
        this.commits.push(commit);
        this.saveCommits();
        return commit;
    }

    generateId() {
        return Math.random().toString(36).substring(2, 9);
    }

    getCommits() {
        return this.commits;
    }
}
