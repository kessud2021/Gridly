import { LANGUAGE_MAP } from './constants.js';

export function getMonacoLanguage(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    return LANGUAGE_MAP[ext] || LANGUAGE_MAP['default'];
}
