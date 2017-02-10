var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function (env) {
    var css_rules;
    var plugins;
    if (env == 'dev') {
        css_rules = [{ loader: "style-loader"}, { loader: "css-loader"}];
    }
    else {
        css_rules = ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader' })
        plugins = [
            new ExtractTextPlugin("styles.css"),
            new OptimizeCssAssetsPlugin(),
            new webpack.optimize.UglifyJsPlugin()
        ];
    }
    return {
        entry: './components/App/App.tsx',
        module: {
            rules: [
                { test: /\.tsx?$/, loader: 'ts-loader'},
                {
                    test: /\.css$/,
                    use: css_rules
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.css']
        },
        plugins: plugins,
        output: {
            path: path.resolve(__dirname, "dist"),
            publicPath: "/assets/",
            filename: 'bundle.js'
        }
    };
};
