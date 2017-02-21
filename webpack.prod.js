var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

module.exports = Object.assign({}, require('./webpack.base'), {
    devtool: 'source-map',
    plugins: [
        new AssetsPlugin({
            fullPath: false,
            path: path.join(__dirname, 'dist'),
            prettyPrint: true
        }),
        new ExtractTextPlugin({filename: "[name]-[chunkhash].css"}),
        new webpack.optimize.CommonsChunkPlugin({
            filename: "vendor-[chunkhash].js",
            minChunks: Infinity,
            name: "vendor"
        }),

        new OptimizeCssAssetsPlugin(),
        new webpack.optimize.UglifyJsPlugin({sourceMap: true}),

        // See https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),

        // https://webpack.js.org/plugins/provide-plugin/
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery'
        // })
    ]
});
