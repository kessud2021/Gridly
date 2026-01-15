/**
 * Git Manager - Manages git-like commit history
 */

interface FileSnapshot {
    [fileName: string]: string;
}

interface Commit {
    id: string;
    message: string;
    timestamp: number;
    files: FileSnapshot;
    stats: number;
}

export class GitManager {
    private commits: Commit[];

    constructor() {
        this.commits = this.loadCommits();
    }

    private loadCommits(): Commit[] {
        const stored = localStorage.getItem('ide-git-commits');
        return stored ? JSON.parse(stored) : [];
    }

    private saveCommits(): void {
        localStorage.setItem('ide-git-commits', JSON.stringify(this.commits));
    }

    commit(message: string, fileSnapshot: FileSnapshot): Commit {
        const commit: Commit = {
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

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    getCommits(): Commit[] {
        return this.commits;
    }
}
