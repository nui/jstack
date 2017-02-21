var path = require('path');

module.exports = {
    entry: {
        app: './components/App/App.tsx'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css']
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/assets/",
        filename: '[name].js'
    },
    stats: {
        colors: true,
        chunks: false
    }
};
