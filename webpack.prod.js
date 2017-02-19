var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var common = require('./webpack.common');

module.exports = Object.assign({}, common, {
    entry: Object.assign({}, common.entry, {
        // Split common chunk for production config
        vendor: ['react', 'react-dom', 'react-bootstrap']
    }),
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
        new ExtractTextPlugin({filename: "[name].css"}),
        new OptimizeCssAssetsPlugin(),

        // See https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),

        new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.js",
            minChunks: Infinity
        })
        // https://webpack.js.org/plugins/provide-plugin/
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery'
        // })
    ]
});
