const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const SRC_DIR = path.join(__dirname, 'src');
const LIB_DIR = path.join(__dirname, 'lib');

const server = http.createServer((req, res) => {
    // Normalize path
    let filePath = req.url === '/' ? '/index.html' : req.url;

    // Route resolution
    let fullPath;
    if (filePath.startsWith('/lib/')) {
        fullPath = path.join(LIB_DIR, filePath.substring(5));
    } else {
        fullPath = path.join(SRC_DIR, filePath);
    }

    // Security: prevent directory traversal
    const resolvedPath = path.resolve(fullPath);
    const allowedDirs = [SRC_DIR, LIB_DIR];
    if (!allowedDirs.some(dir => resolvedPath.startsWith(path.resolve(dir)))) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    // Read and serve file
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found: ' + filePath);
            return;
        }

        // Set content type
        let contentType = 'text/plain';
        const ext = path.extname(fullPath).toLowerCase();
        const typeMap = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.wasm': 'application/wasm',
        };
        contentType = typeMap[ext] || 'text/plain';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📂 Serving from: ${SRC_DIR}`);
    console.log(`📚 Libs from: ${LIB_DIR}`);
});
