///*eslint-disable no-console, no-var */
var express = require('express')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var WebpackConfig = require('./webpack.config')

var root = __dirname;
var app = express()

app.use(webpackDevMiddleware(webpack(WebpackConfig), {
    publicPath: WebpackConfig.output.pathName,
    stats: {
        colors: true
    }
}))

var fs = require('fs')
var path = require('path')


app.get('*', function(req, res) {
    res.sendFile(root+'/example/index.html');
});

app.listen(8080, function () {
    console.log('Server listening on http://localhost:8080, Ctrl+C to stop')
})

//var webpack = require('webpack');
//var WebpackDevServer = require('webpack-dev-server');
//var config = require('./webpack.config');
//
//var options = {
//    publicPath: config.output.publicPath,
//    inline: false,
//    noInfo: false,
//    stats: { colors: true }
//};
//
//new WebpackDevServer(webpack(config), options)
//    .listen(8080, 'localhost', function (err, result) {
//        if (err) {
//            console.log(err);
//        }
//        console.log('Server listening on http://localhost:8080')
//    }
//);
