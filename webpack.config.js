const path = require('path');

const AssetsPlugin = require('assets-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let ExperimentPlugin = require('./plugins/ExperimentPlugin');
let MyPlugin = require('./plugins/MyPlugin');


module.exports = function (env = {env: 'development'}) {
    // if webpack not invoke with --env.env=production
    // default to development environment
    let production = env.env === 'production';

    let stem = production ? '[name].[chunkhash].min' : '[name]';
    return {
        devtool: production ? undefined : 'cheap-module-eval-source-map',
        entry: {
            app: './components/App/App.jsx',
            _hax: './components/commonsChunkHax.js',
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
            // hashSalt: "101", // change value to invalidate CDN cache
            path: path.resolve(__dirname, "assets"),
            filename: `${stem}.js`,
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
        new CommonsChunkPlugin({name: "commons", minChunks: 2}),
        new CommonsChunkPlugin({name: "bootstrap", minChunks: Infinity}),
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
            new OptimizeCssAssetsPlugin({canPrint: false, cssProcessorOptions: {map: {inline: false}}}),
            new SourceMapDevToolPlugin({filename: '[file].map[query]'}),
            new UglifyJsPlugin({extractComments: true, sourceMap: true}),
        ]);
    }
    return plugins;
}