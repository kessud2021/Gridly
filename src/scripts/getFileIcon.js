import { FILE_ICONS } from './constants.js';

export function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    return FILE_ICONS[ext] || FILE_ICONS['default'];
}
