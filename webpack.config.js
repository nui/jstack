var AssetsPlugin = require('assets-webpack-plugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var path = require('path');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var webpack = require('webpack');

var MyPlugin = require('./plugins/MyPlugin');


module.exports = function (env) {
    var production = env.production;
    var stem = production ? '[name].[chunkhash].min' : '[name]';
    return {
        devtool: production ? undefined : 'cheap-module-eval-source-map',
        entry: {
            app: './components/App/App.tsx',
            app2: './components/App2/App2.tsx',
        },
        module: {
            rules: [
                {test: /\.tsx?$/i, loader: 'ts-loader'},
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
            extensions: ['.css', '.js', '.less', '.ts', '.tsx']
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
    var plugins = [
        new AssetsPlugin({
            fullPath: false,
            path: path.join(__dirname, 'assets'),
            prettyPrint: true
        }),
        new ExtractTextPlugin({filename: stem + ".css"}),
        new CommonsChunkPlugin({name: "commons"}),
        // https://webpack.js.org/plugins/provide-plugin/
        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        // This is test plugin, don't include it
        // new MyPlugin({log: false}),
    ];
    if (production) {
        Array.prototype.push.apply(plugins, [
            // See https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
            new DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}),
            new OptimizeCssAssetsPlugin({canPrint: false, cssProcessorOptions: {discardComments: {removeAll: true}}}),
            new UglifyJsPlugin({comments: false, sourceMap: true}),
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