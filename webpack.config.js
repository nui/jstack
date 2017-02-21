var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
var webpack = require('webpack');


module.exports = Object.assign({}, require('./webpack.base'), {
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new AssetsPlugin({
            fullPath: false,
            path: path.join(__dirname, 'dist'),
            prettyPrint: true
        }),
        new ExtractTextPlugin({filename: "[name].[chunkhash].css"}),
        new webpack.optimize.CommonsChunkPlugin({
            filename: "vendor.[chunkhash].js",
            minChunks: Infinity,
            name: "vendor"
        })
    ]
});
