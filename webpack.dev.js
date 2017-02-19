const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    resolve: {
        root: [
            path.resolve('./external'),
            path.resolve('./src')
        ]
    },
    devtool: 'source-map',
    noParse: /node_modules\/leaflet/
};
