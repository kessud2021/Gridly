/**
 * Get Monaco Language - Returns Monaco language for file extension
 */

import { LANGUAGE_MAP } from './constants.js';

export function getMonacoLanguage(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return LANGUAGE_MAP[ext] || LANGUAGE_MAP['default'];
}
