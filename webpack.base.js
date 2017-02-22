var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
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
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'less-loader'
                ]
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
                loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['.css', '.js', '.less', '.ts', '.tsx']
    },
    output: {
        path: path.resolve(__dirname, "assets"),
        publicPath: "/assets/"
    },
    stats: {
        colors: true,
        chunks: false
    }
};
