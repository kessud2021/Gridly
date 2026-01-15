/**
 * Webpack Configuration for Browser IDE
 * Compiles TypeScript, bundles assets, and optimizes for production
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

module.exports = {
    mode: isProduction ? 'production' : 'development',
    
    entry: {
        main: './src/scripts/index.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
        chunkFilename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
        clean: true,
        publicPath: '/'
    },

    // Source maps for debugging
    devtool: isDevelopment ? 'cheap-module-source-map' : 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src/non-compiled/scripts')
        }
    },

    module: {
        rules: [
            // TypeScript Loader
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.json',
                        transpileOnly: !isProduction
                    }
                },
                exclude: /node_modules/
            },

            // CSS/SCSS Loader
            {
                test: /\.css$/i,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ['autoprefixer']
                                ]
                            }
                        }
                    }
                ]
            },

            // Assets (fonts, images, etc.)
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 // 8kb
                    }
                },
                generator: {
                    filename: isProduction ? 'assets/[name].[hash][ext]' : 'assets/[name][ext]'
                }
            }
        ]
    },

    plugins: [
        // HTML Plugin
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: isProduction ? {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            } : false,
            inject: 'body'
        }),

        // CSS Extraction (production only)
        ...(isProduction ? [
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
                chunkFilename: '[name].[contenthash].css'
            })
        ] : []),

        // Bundle Analyzer (optional, set ANALYZE=true to enable)
        ...(process.env.ANALYZE ? [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false,
                reportFilename: 'bundle-report.html'
            })
        ] : [])
    ],

    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: false
                    },
                    output: {
                        comments: false
                    }
                },
                extractComments: false
            }),
            new CssMinimizerPlugin()
        ],
        
        // Split chunks for better caching
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                    reuseExistingChunk: true
                },
                common: {
                    minChunks: 2,
                    priority: 5,
                    reuseExistingChunk: true
                }
            }
        },

        // Keep runtime chunk separate
        runtimeChunk: 'single',

        // Module IDs for consistent hashing
        moduleIds: 'deterministic'
    },

    devServer: {
        port: 8080,
        host: 'localhost',
        open: true,
        hot: true,
        historyApiFallback: true,
        compress: true,
        static: {
            directory: path.join(__dirname, 'dist')
        },
        client: {
            overlay: {
                errors: true,
                warnings: false
            }
        }
    },

    performance: {
        hints: isProduction ? 'warning' : false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};
