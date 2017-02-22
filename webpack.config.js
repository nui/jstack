var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
var webpack = require('webpack');

var baseConfig = require('./webpack.base');

module.exports = Object.assign({}, baseConfig, {
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new AssetsPlugin({
            fullPath: false,
            path: path.join(__dirname, 'assets'),
            prettyPrint: true
        }),
        new ExtractTextPlugin({filename: "[name]/[name].css"}),
        new webpack.optimize.CommonsChunkPlugin({name: "vendor"}),
    ],
    output: Object.assign({}, baseConfig.output, {
        filename: '[name]/[name].js',
        publicPath: '/assets/',
    }),
    devServer: {
        proxy: {
            '/backend': {
                target: 'http://localhost:8000',
                pathRewrite: {"^/backend": ""}
            }
        },
        publicPath: '/assets/',
    }
});
