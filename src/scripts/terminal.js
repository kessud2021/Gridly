export class TerminalManager {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.logs = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { message, type, timestamp };
        this.logs.push(logEntry);

        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = `[${timestamp}] ${message}`;
        this.element.appendChild(line);
        this.element.scrollTop = this.element.scrollHeight;
    }

    clear() {
        this.logs = [];
        this.element.innerHTML = '';
    }

    error(message) { this.log(message, 'error'); }
    success(message) { this.log(message, 'success'); }
    warn(message) { this.log(message, 'warning'); }
    info(message) { this.log(message, 'info'); }
}
