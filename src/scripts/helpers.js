import { LANGUAGE_MAP, FILE_ICONS } from './constants.js';
import { IDE } from './index.js';

export function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    return FILE_ICONS[ext] || FILE_ICONS['default'];
}

export function getMonacoLanguage(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    return LANGUAGE_MAP[ext] || LANGUAGE_MAP['default'];
}

export function setMonacoLanguage(fileName) {
    if (!window.IDE || !window.IDE.editor || !window.monaco) return;
    const language = getMonacoLanguage(fileName);
    const model = window.IDE.editor.getModel();
    if (model) {
        window.monaco.editor.setModelLanguage(model, language);
        console.log(`✓ Language: ${language}`);
    }
}
