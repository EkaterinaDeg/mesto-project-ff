const path = require("path");


module.exports = {
    entry: './src/scripts/index.js',
    output: {
        path: path.resolve(dirname, 'dist'),
        filename: 'main.js'
    },
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        },
    }
};
