const config = require('./webpack.dev.js');
const webpack = require('webpack');

delete config.devtool;

config.plugins = [
    new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: true,
        mangle: true,
        sourceMap: false,
        output: {
            comments: false
        }
    })
];

module.exports = config;
