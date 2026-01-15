console.log('🚀 Boot sequence starting...');

const FILE_ICONS: { [key: string]: string } = {
    'html': '\uf13b', 'htm': '\uf13b', 'xml': '\uf072',
    'css': '\uf81e', 'scss': '\uf81e', 'sass': '\uf81e', 'less': '\uf81e',
    'js': '\uf41e', 'jsx': '\uf41e', 'mjs': '\uf41e',
    'ts': '\ufbf8', 'tsx': '\ufbf8',
    'json': '\ue60b', 'yml': '\uf481', 'yaml': '\uf481', 
    // ... other file icons
};

interface IDEState {
    editor: any;
    terminal: TerminalManager | null;
    fileManager: FileManager | null;
    gitManager: GitManager | null;
    searchIndex: SearchIndex | null;
    isReady: boolean;
    logs: string[];
    renaming: boolean;
}

const IDE: IDEState = {
    editor: null,
    terminal: null,
    fileManager: null,
    gitManager: null,
    searchIndex: null,
    isReady: false,
    logs: [],
    renaming: false
};

class TerminalManager {
    element: HTMLElement | null;
    logs: Array<{ message: string; type: string; timestamp: string }>;

    constructor(elementId: string) {
        this.element = document.getElementById(elementId);
        this.logs = [];
    }

    log(message:string, type:string = 'info'): void {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { message, type, timestamp };
        this.logs.push(logEntry);

        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = `[${timestamp}] ${message}`;
        if (this.element) {
            this.element.appendChild(line);
            this.element.scrollTop = this.element.scrollHeight;
        }
        
     }

     clear(): void {
         this.logs = [];
         if (this.element) {
             this.element.innerHTML = '';
         }
     }

     error(message:string): void { this.log(message, 'error'); }
     success(message:string): void { this.log(message, 'success'); }
     warn(message:string): void { this.log(message, 'warning'); }
     info(message:string): void { this.log(message, 'info'); }
}

// Other classes remain unchanged except for adding types

function getFileIcon(fileName:string): string {
   const ext = fileName.split('.').pop()?.toLowerCase() || '';
   return FILE_ICONS[ext] || '📄';
}

async function boot(): Promise<void> {
   try {
       IDE.terminal.info('📦 Loading dependencies...');
       await initMonaco();
       initSystems();
       setupEventListeners();

       IDE.isReady = true;
       IDE.terminal.success('✓ IDE Ready! (Ctrl+S save, Ctrl+N new, F2 rename)');
       
   } catch (err) {
       IDE.terminal.error(`Boot failed: ${(err as Error).message}`);
       console.error(err);
   }
}

if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', boot);
} else {
   boot();
}