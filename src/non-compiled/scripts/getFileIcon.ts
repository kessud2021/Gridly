/**
 * Get File Icon - Returns icon for file extension
 */

import { FILE_ICONS } from './constants.js';

export function getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return FILE_ICONS[ext] || FILE_ICONS['default'];
}
