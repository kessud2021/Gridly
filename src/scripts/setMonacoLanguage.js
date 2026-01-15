import { IDE } from './index.js';
import { getMonacoLanguage } from './getMonacoLanguage.js';

export function setMonacoLanguage(fileName) {
    if (!IDE.editor || !window.monaco) return;
    const language = getMonacoLanguage(fileName);
    const model = IDE.editor.getModel();
    if (model) {
        window.monaco.editor.setModelLanguage(model, language);
        console.log(`✓ Language: ${language}`);
    }
}
