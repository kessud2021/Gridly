/**
 * Set Monaco Language - Sets the language for Monaco editor
 */

import { getMonacoLanguage } from './getMonacoLanguage.js';

export interface IDEInterface {
    editor: any | null;
    terminal: any;
    fileManager: any;
    gitManager: any;
    searchIndex: any;
    isReady: boolean;
    renaming: boolean;
}

let IDE: IDEInterface;

export function setIDEInstance(ideInstance: IDEInterface): void {
    IDE = ideInstance;
}

export function setMonacoLanguage(fileName: string): void {
    if (!IDE || !IDE.editor || !(window as any).monaco) {
        return;
    }
    const language = getMonacoLanguage(fileName);
    const model = IDE.editor.getModel();
    if (model) {
        (window as any).monaco.editor.setModelLanguage(model, language);
        console.log(`✓ Language: ${language}`);
    }
}
