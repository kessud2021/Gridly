/**
 * Terminal Manager - Handles logging and terminal UI updates
 */

interface LogEntry {
    message: string;
    type: 'info' | 'error' | 'success' | 'warning';
    timestamp: string;
}

export class TerminalManager {
    private element: HTMLElement;
    private logs: LogEntry[];

    constructor(elementId: string) {
        const el = document.getElementById(elementId);
        if (!el) {
            throw new Error(`Element with id "${elementId}" not found`);
        }
        this.element = el;
        this.logs = [];
    }

    log(message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info'): void {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry: LogEntry = { message, type, timestamp };
        this.logs.push(logEntry);

        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = `[${timestamp}] ${message}`;
        this.element.appendChild(line);
        this.element.scrollTop = this.element.scrollHeight;
    }

    clear(): void {
        this.logs = [];
        this.element.innerHTML = '';
    }

    error(message: string): void {
        this.log(message, 'error');
    }

    success(message: string): void {
        this.log(message, 'success');
    }

    warn(message: string): void {
        this.log(message, 'warning');
    }

    info(message: string): void {
        this.log(message, 'info');
    }
}
