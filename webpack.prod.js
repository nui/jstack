var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: './components/App/App.tsx',
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
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css']
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new OptimizeCssAssetsPlugin(),
        new webpack.optimize.UglifyJsPlugin({sourceMap: true})
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/assets/",
        filename: 'bundle.js'
    }
};
