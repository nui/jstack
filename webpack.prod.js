var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

var baseConfig = require('./webpack.base');

module.exports = Object.assign({}, baseConfig, {
    plugins: [
        new AssetsPlugin({
            fullPath: false,
            path: path.join(__dirname, 'assets'),
            prettyPrint: true
        }),
        new ExtractTextPlugin({filename: "[name]/[name].[chunkhash].min.css"}),
        new webpack.optimize.CommonsChunkPlugin({name: "commons"}),

        new OptimizeCssAssetsPlugin({canPrint: false}),
        new webpack.optimize.UglifyJsPlugin({sourceMap: true}),

        // See https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),

        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map[query]',
            exclude: /\.css$/,
            // uncomment following line
            // then we can serve sourcemap from private location
            // append: '\n//# sourceMappingURL=http://localhost:8888/[url]'
        }),

        // https://webpack.js.org/plugins/provide-plugin/
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery'
        // })
    ],
    output: Object.assign({}, baseConfig.output, {
        filename: '[name]/[name].[chunkhash].min.js',
    })
});
