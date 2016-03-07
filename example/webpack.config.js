'use strict';

var webpack = require('webpack');
var root = __dirname;

var config = {
    debug: true,
    devtools: 'inline-source-map',
    entry: [
        'babel-polyfill',
        root+'/app.js'
    ],
    output: {
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
            test: /\.(?:js).?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader?cacheDirectory'
        }, {
            test: /\.scss$/,
            loaders: ["style", "css?root=.", "sass"],
            include: root
        }, {
            test: /\.css$/,
            loader: 'style!css?sourceMap'
        }, {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url?limit=10000&mimetype=application/font-woff"
        }, {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url?limit=10000&mimetype=application/font-woff"
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url?limit=10000&mimetype=application/octet-stream"
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: "file"
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url?limit=10000&mimetype=image/svg+xml"
        }]
    },
    resolve: {
        extensions: ['', '.js']
    }
};

module.exports = config;