const exec = require('child_process').exec;

const del = require('del');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const gutil = require('gulp-util');
const MemoryFs = require('memory-fs');
const runSequence = require('run-sequence');
const vinylPaths = require('vinyl-paths');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const development = require('./webpack.config')({production: false});
const production = require('./webpack.config')({production: true});

gulp.task('default', ['webpack-dev-server']);
gulp.task('start', ['webpack-dev-server']);

gulp.task('webpack-dev-server', function (callback) {
    const compiler = webpack(development);

    // server and middleware options
    const config = Object.assign({}, {
        stats: development.stats,
        proxy: development.devServer.proxy,
        publicPath: development.output.publicPath,
    });

    new WebpackDevServer(compiler, config)
        .listen(8080, "localhost", function (err) {
            if (err) throw new gutil.PluginError("webpack-dev-server", err);
            // Server listening
            gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/backend");
            callback();
        });
});

function logStats(config, callback) {
    return function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString(config.stats));
        if (callback) callback();
    }
}

gulp.task('watch', ['clean'], function () {
    webpack(development).watch({}, logStats(development));
});

gulp.task('bundle', function (callback) {
    webpack(production).run(logStats(production, callback));
});

gulp.task('bundle-watch', ['clean'], function () {
    webpack(production).watch({}, logStats(production));
});

gulp.task('bundle-ci', function (callback) {
    runSequence('clean',
        'bundle',
        'move-sourcemap',
        callback);
});

gulp.task('move-sourcemap', function () {
    return gulp.src('./assets/**/*.map')
        .pipe(vinylPaths(del))
        .pipe(flatten())
        .pipe(gulp.dest('./sourcemaps'));
});

gulp.task('clean', function () {
    return del([
        'assets/**/*',
        'sourcemaps/*',
    ]);
});

gulp.task('bundle-in-memory', function (callback) {
    const compiler = webpack(production);
    compiler.outputFileSystem = new MemoryFs();
    compiler.run(logStats(production, callback));
});

gulp.task('webpack-benchmark', function (callback) {
    const timesSeries = require('async/timesSeries');
    const argv = require('yargs').argv;
    const n = typeof argv.n === 'number' ? argv.n : 10;
    timesSeries(n, function (n, next) {
        const startTime = new Date().getTime();
        exec('gulp bundle-in-memory', (error, stdout, stderr) => {
            if (error) return callback(error);
            const total = new Date().getTime() - startTime;
            gutil.log(total);
            next(null, total);
        });
    }, function (err, times) {
        if (err) throw new gutil.PluginError("webpack", err);
        let sum = times.reduce(function (acc, val) {
            return acc + val;
        }, 0);
        gutil.log(times);
        gutil.log('Average time:', sum / 1000 / times.length, 's.');
        callback();
    });
});
