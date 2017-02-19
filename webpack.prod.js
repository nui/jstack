var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = Object.assign({}, require('./webpack.common'), {
    module: {
        rules: [
            {test: /\.tsx?$/, loader: 'ts-loader'},
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: {loader: "css-loader", options: {modules: true}}
                })
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new OptimizeCssAssetsPlugin(),
        new webpack.optimize.UglifyJsPlugin({sourceMap: true})
    ]
});
