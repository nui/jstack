var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

gulp.task('default', ['webpack-dev-server']);
gulp.task('start', ['webpack-dev-server']);

gulp.task('webpack-dev-server', function (callback) {
    var config = require('./webpack.config');
    var compiler = webpack(config);

    new WebpackDevServer(compiler, {
        stats: config.stats
        // server and middleware options
    }).listen(8080, "localhost", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
        callback();
    });
});

gulp.task('watch', function (callback) {
    var config = require('./webpack.config');
    webpack(config).watch({}, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString(config.stats));
    });
});

gulp.task('bundle', function (callback) {
    var config = require('./webpack.prod');
    webpack(config, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString(config.stats));
        callback();
    });
});

gulp.task('clean', function () {
    return del([
        'assets/**/*'
    ]);
});
