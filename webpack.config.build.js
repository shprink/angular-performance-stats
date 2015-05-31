var path = require('path'),
    webpack = require("webpack"),
    libPath = path.join(__dirname, 'lib'),
    distPath = path.join(__dirname, 'dist'),
    ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
    entry: path.join(libPath, 'angular-performance-stats.coffee'),
    output: {
        path: distPath
    },
    module: {
        loaders: [{
            test: /[\/]angular\.js$/,
            loader: 'expose?angular!exports?window.angular'
        }, {
            test: /\.coffee$/,
            loader: "coffee"
        }, {
            test: /\.html$/,
            loader: "html"
        }, {
            test: /\.scss$/,
            loader: "style!css!autoprefixer!sass"
        }]
    },
    plugins: [
        new ngAnnotatePlugin({
            add: true
        }),
        new webpack.optimize.DedupePlugin()
    ]
};
