module.exports = Object.assign({}, require('./webpack.base'), {
    devtool: 'cheap-module-eval-source-map',
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
