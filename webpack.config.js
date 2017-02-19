module.exports = Object.assign({}, require('./webpack.common'), {
    module: {
        rules: [
            {test: /\.tsx?$/, loader: 'ts-loader'},
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader", options: {modules: true}}]
            }
        ]
    }
});
