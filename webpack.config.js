let AssetsPlugin = require('assets-webpack-plugin');
let CommonsChunkPlugin = require('webpack').optimize.CommonsChunkPlugin;
let DefinePlugin = require('webpack').DefinePlugin;
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
let path = require('path');
let ProvidePlugin = require('webpack').ProvidePlugin;
let SourceMapDevToolPlugin = require('webpack').SourceMapDevToolPlugin;
let UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;
let webpack = require('webpack');

let MyPlugin = require('./plugins/MyPlugin');
let ExperimentPlugin = require('./plugins/ExperimentPlugin');


module.exports = function (env) {
    // if webpack not invoke with --env.production
    // default to development environment
    env = env || {production: false};
    let production = env.production === true;

    let stem = production ? '[name].[chunkhash].min' : '[name]';
    return {
        devtool: production ? undefined : 'cheap-module-eval-source-map',
        entry: {
            app: './components/App/App.jsx',
            app2: './components/App2/App2.jsx',
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                    }
                },
                {
                    test: /\.css$/i,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: {loader: "css-loader", options: {modules: true}}
                    })
                },
                {
                    test: /\.less$/i,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {loader: 'css-loader', options: {importLoaders: 1}},
                            'less-loader'
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
            path: path.resolve(__dirname, "assets"),
            filename: stem + '.js',
            publicPath: "/assets/"
        },
        stats: {
            children: false,
            chunks: false,
            colors: true,
        },
        devServer: {
            proxy: {
                '/backend': {
                    target: 'http://localhost:8000',
                    pathRewrite: {"^/backend": ""}
                }
            },
            publicPath: '/assets/',
        }
    };
};

function getPlugins(production, stem) {
    let plugins = [
        new AssetsPlugin({
            fullPath: false,
            path: path.join(__dirname, 'assets'),
            prettyPrint: true
        }),
        new ExtractTextPlugin({filename: stem + ".css"}),
        // DON'T SWAP THESE 2 BELOW LINES, The order of CommonsChunkPlugin is important
        new CommonsChunkPlugin({name: "commons", minChunks: 2}), // minChunks set to 2 to see effect of plugin in this setup only
        new CommonsChunkPlugin({name: "manifest", minChunks: Infinity}),
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
        Array.prototype.push.apply(plugins, [
            // See https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
            new DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}),
            new OptimizeCssAssetsPlugin({canPrint: false, cssProcessorOptions: {discardComments: {removeAll: true}}}),
            new UglifyJsPlugin({extractComments: true, sourceMap: true}),
            new SourceMapDevToolPlugin({
                filename: '[file].map[query]',
                exclude: /\.css$/i,
                // uncomment following line
                // then we can serve sourcemap from private location
                // append: '\n//# sourceMappingURL=http://localhost:8888/[url]'
            }),
        ]);
    }
    return plugins;
}