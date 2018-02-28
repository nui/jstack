import AssetsPlugin from "assets-webpack-plugin";
import DefinePlugin from "webpack/lib/DefinePlugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import path from "path";
import ProvidePlugin from "webpack/lib/ProvidePlugin";
import RuntimeChunkPlugin from "webpack/lib/optimize/RuntimeChunkPlugin";
import SourceMapDevToolPlugin from "webpack/lib/SourceMapDevToolPlugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";

import ExperimentPlugin from "./plugins/ExperimentPlugin";
import MyPlugin from "./plugins/MyPlugin";

function defaultEnv(env) {
    // if webpack is not invoke with --env.target=production
    // default to development environment
    return Object.assign({
        target: 'development'
    }, env);
}

export default function (env) {
    env = defaultEnv(env);
    const production = env.target === 'production';

    const stem = production ? '[name].[chunkhash].min' : '[name]';
    return {
        mode: production ? 'production' : 'development',
        entry: {
            app: './components/App/App.jsx',
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: [
                                ["env", {"modules": false}],
                                "react"
                            ],
                            plugins: ["transform-runtime"],
                        },
                    }
                },
                {
                    test: /\.css$/i,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: {loader: "css-loader", options: {modules: true, sourceMap: true}}
                    })
                },
                {
                    test: /\.less$/i,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {loader: 'css-loader', options: {importLoaders: 1, sourceMap: true}},
                            {loader: 'less-loader', options: {sourceMap: true}}
                        ]
                    })
                },
                {
                    test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 32 * 1024,
                            name: (production ? '[hash:base64]' : '[name]') + '.[ext]'
                        }
                    }
                }
            ]
        },
        plugins: getPlugins(production, stem),
        resolve: {
            extensions: ['.css', '.js', '.jsx', '.less']
        },
        output: {
            filename: `${stem}.js`,
            // hashSalt: "101", // change value to invalidate CDN cache
            path: path.resolve(__dirname, "assets"),
            publicPath: "/assets/"
        },
        stats: {
            assetsSort: "chunks",
            children: false,
            chunks: false,
            colors: true,
            modules: false,
        },
        devServer: {
            proxy: {
                '/backend': {
                    target: 'http://localhost:8000',
                    pathRewrite: {"^/backend": ""}
                }
            },
            publicPath: '/assets/',
        },
        optimization: {
            // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
            // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    vendors: {
                        name: 'vendors',
                        test: /node_modules/,
                        priority: -10
                    }
                }
            },
            // minimize: false,
            minimizer: [new UglifyJsPlugin({extractComments: true, sourceMap: true})]
        }
    };
};

function getPlugins(production, stem) {
    let plugins = [
        new AssetsPlugin({
            fullPath: false,
            path: path.resolve(__dirname, 'assets'),
            prettyPrint: true
        }),
        new ExtractTextPlugin({filename: `${stem}.css`}),
        new RuntimeChunkPlugin({name: "runtime"}),
        // https://webpack.js.org/plugins/provide-plugin/
        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        // This is test plugin, don't include it
        // new MyPlugin({log: false}),
        // new ExperimentPlugin(),
    ];
    if (production) {
        plugins.push(...[
            // See https://webpack.js.org/plugins/define-plugin/#feature-flags
            new DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
            new OptimizeCssAssetsPlugin({canPrint: false, cssProcessorOptions: {map: {inline: false}}}),
            new SourceMapDevToolPlugin({filename: '[file].map[query]'}),
        ]);
    }
    return plugins;
}