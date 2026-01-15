import { IDE } from './index.js';

export function renderGitHistory() {
    const container = document.getElementById('git-commits');
    if (!container) return;
    
    container.innerHTML = '';
    const commits = IDE.gitManager.getCommits().slice().reverse();
    
    if (commits.length === 0) {
        container.innerHTML = '<div style="padding: 12px; color: #858585; font-size: 11px;">No commits yet</div>';
        return;
    }
    
    commits.forEach(commit => {
        const el = document.createElement('div');
        el.className = 'git-commit';
        el.innerHTML = `
            <div class="git-commit-msg">[${commit.id.substring(0, 7)}] ${commit.message}</div>
            <div class="git-commit-date">${new Date(commit.timestamp).toLocaleString()}</div>
        `;
        container.appendChild(el);
    });
}
