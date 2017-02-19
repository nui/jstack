var path = require('path');

module.exports = {
    entry: {
        vendor: ['react', 'react-dom', 'react-bootstrap'],
        app: './components/App/App.tsx'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css']
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/assets/",
        filename: '[name].js'
    }
};
