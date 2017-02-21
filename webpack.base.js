var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: './components/App/App.tsx',
    },
    module: {
        rules: [{test: /\.tsx?$/, loader: 'ts-loader'}, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: {loader: "css-loader", options: {modules: true}}
            })
        }
        ]
    },
    resolve: {
        extensions: ['.css', '.js', '.ts', '.tsx']
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/assets/"
    },
    stats: {
        colors: true,
        chunks: false
    }
};
