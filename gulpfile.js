var gulp = require('gulp'),
    path = require('path'),
    header = require('gulp-header'),
    webpack = require('webpack'),
    gulpWebpack = require('gulp-webpack'),
    extend = require('util')._extend,
    pkg = require('./package.json'),
    clone = require('clone'),
    distPath = path.join(__dirname, 'dist'),
    webpackBuildConfig = require("./webpack.config.build");

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @author <%= pkg.author %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');

gulp.task('default', ['build']);
gulp.task('build', ['build:dev', 'build:prod']);

gulp.task("build:dev", function (callback) {
    var webpackConfig = clone(webpackBuildConfig);
    webpackConfig.output.filename = pkg.name + '.js';
    return gulp.src(webpackConfig.entry)
        .pipe(gulpWebpack(webpackConfig))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest(distPath));
});

gulp.task("build:prod", function (callback) {
    var webpackConfig = clone(webpackBuildConfig);
    webpackConfig.output.filename = pkg.name + '.min.js';
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
    return gulp.src(webpackConfig.entry)
        .pipe(gulpWebpack(webpackConfig))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest(distPath));
});