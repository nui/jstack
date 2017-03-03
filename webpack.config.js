var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var path = require('path');
var webpack = require('webpack');


module.exports = function (env) {
    var stem = env.production ? '[name]/[name].[chunkhash].min' : '[name]/[name]';
    var plugins = [
        new AssetsPlugin({
            fullPath: false,
            path: path.join(__dirname, 'assets'),
            prettyPrint: true
        }),
        new ExtractTextPlugin({filename: stem + ".css"}),
        new webpack.optimize.CommonsChunkPlugin({name: "commons"}),
        new webpack.SourceMapDevToolPlugin({
            filename: env.production ? '[file].map[query]' : undefined,
            exclude: /\.css$/,
            // uncomment following line
            // then we can serve sourcemap from private location
            // append: '\n//# sourceMappingURL=http://localhost:8888/[url]'
        }),
        // https://webpack.js.org/plugins/provide-plugin/
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery'
        // }),
    ];
    if (env.production) {
        Array.prototype.push.apply(plugins, [
            // See https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
            new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}),
            new OptimizeCssAssetsPlugin({canPrint: false}),
            new webpack.optimize.UglifyJsPlugin({comments: false, sourceMap: true}),
        ]);
    }

    return {
        entry: {
            app: './components/App/App.tsx',
            app2: './components/App2/App2.tsx',
        },
        module: {
            rules: [
                {test: /\.tsx?$/, loader: 'ts-loader'},
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: {loader: "css-loader", options: {modules: true}}
                    })
                },
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {loader: 'css-loader', options: {importLoaders: 1}},
                            'less-loader'
                        ]
                    })
                },
                {
                    test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 32 * 1024,
                            name: 'files/' + (env.production ? '[hash:base64]' : '[name]') + '.[ext]'
                        }
                    }
                }
            ]
        },
        plugins: plugins,
        resolve: {
            extensions: ['.css', '.js', '.less', '.ts', '.tsx']
        },
        output: {
            path: path.resolve(__dirname, "assets"),
            filename: stem + '.js',
            publicPath: "/assets/"
        },
        stats: {
            colors: true,
            chunks: false,
            children: false
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