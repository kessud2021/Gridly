/**
 * Render Git History - Renders the git commit history UI
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

interface Commit {
    id: string;
    message: string;
    timestamp: number;
    files: Record<string, string>;
    stats: number;
}

let IDE: IDEInterface;

export function setIDEInstance(ideInstance: IDEInterface): void {
    IDE = ideInstance;
}

export function renderGitHistory(): void {
    if (!IDE) return;

    const container = document.getElementById('git-commits');
    if (!container) return;

    container.innerHTML = '';
    const commits: Commit[] = IDE.gitManager.getCommits().slice().reverse();

    if (commits.length === 0) {
        container.innerHTML = '<div style="padding: 12px; color: #858585; font-size: 11px;">No commits yet</div>';
        return;
    }

    commits.forEach((commit: Commit) => {
        const el = document.createElement('div');
        el.className = 'git-commit';
        el.innerHTML = `
            <div class="git-commit-msg">[${commit.id.substring(0, 7)}] ${commit.message}</div>
            <div class="git-commit-date">${new Date(commit.timestamp).toLocaleString()}</div>
        `;
        container.appendChild(el);
    });
}
