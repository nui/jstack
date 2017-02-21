var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

gulp.task('default', function () {
    console.log('Hello');
});

const webpackStats = {
    colors: true,
    chunks: false
};

gulp.task('start', function (callback) {
    var compiler = webpack(require('./webpack.config'));

    new WebpackDevServer(compiler, {
        stats: webpackStats
        // server and middleware options
    }).listen(8080, "localhost", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
        callback();
    });
});

gulp.task('bundle', function (callback) {
    // run webpack
    webpack(require('./webpack.prod'), function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString(webpackStats));
        callback();
    });
});

gulp.task('clean', function () {
    return del([
        'dist/**/*'
    ]);
});
