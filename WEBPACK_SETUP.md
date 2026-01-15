# Webpack Build Configuration

## Overview

Webpack configuration that compiles TypeScript source files and bundles the entire Browser IDE application for production and development.

## 📁 File Structure

```
my-ide/
├── webpack.config.js       ← Main build configuration
├── tsconfig.json           ← TypeScript configuration
├── package.json            ← Build scripts & dependencies
│
├── src/
│   ├── non-compiled/       ← TypeScript source (INPUT)
│   │   └── scripts/
│   │       ├── index.ts
│   │       ├── terminal.ts
│   │       └── ... (19 modules)
│   ├── index.html          ← Entry HTML
│   └── style/
│       └── index.css       ← Styles
│
└── dist/                   ← Build output (AUTO-GENERATED)
    ├── index.html
    ├── main.[hash].js
    ├── vendors.[hash].js
    └── runtime.[hash].js
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs webpack, loaders, plugins, and TypeScript.

### 2. Development Server

```bash
npm run dev
```

- ✅ Starts dev server on http://localhost:8080
- ✅ Auto-reloads on file changes
- ✅ Source maps for debugging
- ✅ Browser opens automatically

### 3. Production Build

```bash
npm run build
```

- ✅ Compiles TypeScript
- ✅ Minifies CSS and JavaScript
- ✅ Optimizes assets
- ✅ Outputs to `dist/` folder
- ✅ Content hashing for caching

## 📦 NPM Scripts

| Script | Purpose | Output |
|--------|---------|--------|
| `npm run dev` | Development server with hot reload | http://localhost:8080 |
| `npm run build` | Production build (minified) | `dist/` folder |
| `npm run build:dev` | Development build (unminified) | `dist/` folder |
| `npm run build:analyze` | Build + bundle analysis report | `dist/bundle-report.html` |
| `npm run type-check` | Type checking only (no build) | Terminal output |
| `npm run tsc:build` | TypeScript compiler only | `src/scripts/` |
| `npm run tsc:watch` | TypeScript watch mode | `src/scripts/` |

## 🔧 Webpack Configuration Details

### Entry Point

```javascript
entry: {
    main: './src/non-compiled/scripts/index.ts'
}
```

Main entry point is the TypeScript source file.

### Output

**Development:**
```
dist/
├── main.js              (unminified)
├── vendors.js           (vendor code)
├── runtime.js           (webpack runtime)
└── index.html
```

**Production:**
```
dist/
├── main.[hash].js       (minified, content hash)
├── vendors.[hash].js    (vendor code, hashed)
├── runtime.[hash].js    (webpack runtime, hashed)
└── index.html           (minified)
```

Content hashing ensures browser caches are busted when files change.

### TypeScript Loader

```javascript
{
    test: /\.tsx?$/,
    use: {
        loader: 'ts-loader',
        options: {
            transpileOnly: !isProduction  // Faster builds in dev
        }
    }
}
```

- Compiles TypeScript to JavaScript
- `transpileOnly` mode in development for speed

### CSS Loader

```javascript
{
    test: /\.css$/i,
    use: [
        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
        'css-loader',
        'postcss-loader'
    ]
}
```

- **Development**: Inline CSS via style-loader
- **Production**: Extract CSS to separate files
- Autoprefixer for vendor prefixes

### Asset Handling

```javascript
{
    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/i,
    type: 'asset',
    parser: {
        dataUrlCondition: {
            maxSize: 8 * 1024
        }
    }
}
```

- Files < 8KB → Inline as data URLs
- Files > 8KB → Separate asset files
- Optimized with content hashing

### HTML Plugin

```javascript
new HtmlWebpackPlugin({
    template: './src/index.html',
    minify: isProduction ? { ... } : false
})
```

- Uses `src/index.html` as template
- Automatically injects bundled scripts
- Minifies HTML in production

### Code Splitting

```javascript
optimization: {
    splitChunks: {
        cacheGroups: {
            vendor: { ... },  // node_modules code
            common: { ... }   // shared code
        }
    },
    runtimeChunk: 'single'
}
```

Splits bundle into:
- **vendors.js** - npm dependencies
- **runtime.js** - webpack runtime
- **main.js** - application code

Improves caching: vendors and runtime rarely change.

### Source Maps

**Development:**
```javascript
devtool: 'cheap-module-source-map'
```
Fast source maps for debugging.

**Production:**
```javascript
devtool: 'source-map'
```
Full source maps (separate .map files).

## 🎯 Build Modes

### Development Mode

```bash
npm run dev
```

Features:
- ✅ Hot module replacement (HMR)
- ✅ Source maps for debugging
- ✅ Unminified code for readability
- ✅ Fast rebuild time
- ✅ Browser auto-open
- ✅ Inline styles

### Production Mode

```bash
npm run build
```

Features:
- ✅ Minified JavaScript
- ✅ Minified CSS
- ✅ Content hashing
- ✅ Chunk splitting
- ✅ Tree shaking
- ✅ Asset optimization

### Analysis Mode

```bash
npm run build:analyze
```

Generates `dist/bundle-report.html` showing:
- Bundle size breakdown
- Which packages contribute most
- Optimization opportunities

## 📊 Build Output Example

```
Hash: a1b2c3d4e5f6g7h8
Version: webpack 5.89.0
Time: 2531ms

Asset                              Size    Chunks             Chunk Names
main.e5f6.js                     145 KiB    0  [emitted]      main
vendors.f7h8.js                   89 KiB    1  [emitted]      vendors
runtime.g8i9.js                    8 KiB    2  [emitted]      runtime
index.html                         3 KiB          [emitted]

Entrypoint main = runtime.g8i9.js vendors.f7h8.js main.e5f6.js

Build completed successfully!
```

## 🔐 Source Maps

### Development
- Generated automatically with `-cheap-module-source-map`
- Maps minified code back to original source
- Included in browser DevTools

### Production
- Generated as separate `.map` files
- Can be uploaded to error tracking service
- Users don't download maps (unless configured)

Enable in browser DevTools:
1. DevTools → Sources tab
2. See original TypeScript files
3. Set breakpoints and debug

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Upload to Server

```bash
scp -r dist/* user@server:/var/www/browser-ide/
```

### Serve Static Files

```bash
# Simple HTTP server
npx http-server dist/

# Using Node/Express
app.use(express.static('dist'));
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});
```

### CDN Setup

- Upload `dist/` to CDN
- Files with hashes (`.js`, `.css`) can have long cache
- `index.html` should NOT be cached
- Use Cache-Control headers:

```
Cache-Control: max-age=31536000  # 1 year for hashed files
Cache-Control: max-age=0          # No cache for index.html
```

## 🐛 Troubleshooting

### "Module not found" Error

```
ERROR in ./src/non-compiled/scripts/file.ts
Module not found: Error: Can't resolve './other'
```

**Solution**: Check file path (case-sensitive on Linux/Mac)

### TypeScript Compilation Error

```
ERROR in ./src/non-compiled/scripts/file.ts
TS2322: Type 'string' is not assignable to type 'number'
```

**Solution**: Run `npm run type-check` for detailed errors

### Build Takes Too Long

```bash
# Dev mode uses transpileOnly for speed
npm run dev

# Production uses full type checking
npm run build
```

### "Cannot find module" in Browser

1. Check imports use `.js` extension: `import { foo } from './bar.js'`
2. Verify file exists in `src/non-compiled/scripts/`
3. Check `tsconfig.json` paths

### Memory Issues on Large Builds

```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

## 📈 Performance Tips

### Reduce Bundle Size

```bash
# Analyze what's in the bundle
npm run build:analyze
```

### Faster Development Builds

- Dev server uses `transpileOnly` mode (type checking skipped)
- Run `npm run type-check` separately if needed
- Use HMR for faster refreshes

### Optimize Images

- WebP format for modern browsers
- SVG for icons (inline as data URLs)
- Compress with ImageOptim/PNGCrush

### Tree Shaking

Webpack automatically removes unused code. Ensure:
- Using ES6 imports (not CommonJS)
- Dependencies have `side-effects: false` in package.json

## 🔗 Related Files

- `tsconfig.json` - TypeScript settings
- `webpack.config.js` - This file
- `package.json` - Build scripts & dependencies
- `src/non-compiled/scripts/` - TypeScript source
- `src/index.html` - HTML template

## 🎓 Further Reading

- [Webpack Documentation](https://webpack.js.org/)
- [ts-loader](https://github.com/TypeStrong/ts-loader)
- [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin)
- [Webpack Dev Server](https://webpack.js.org/configuration/dev-server/)

## ✅ Checklist

- [ ] Run `npm install` - Install all dependencies
- [ ] Run `npm run dev` - Start development server
- [ ] Visit http://localhost:8080 - Test in browser
- [ ] Make TypeScript changes in `src/non-compiled/scripts/`
- [ ] Page hot-reloads automatically
- [ ] Run `npm run type-check` - Verify no type errors
- [ ] Run `npm run build` - Create production build
- [ ] Check `dist/` folder - Verify output

---

**Status**: ✅ Ready to Use  
**Version**: Webpack 5.89.0  
**TypeScript**: 5.3.3
