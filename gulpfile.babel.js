import del from "del";
import flatten from "gulp-flatten";
import gulp from "gulp";
import MemoryFs from "memory-fs";
import replace from "gulp-replace";
import vinylPaths from "vinyl-paths";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import {exec} from "child_process";
import log from 'fancy-log';
import PluginError from 'plugin-error';

import makeConfig from './webpack.config';

const development = makeConfig({target: 'development'});
const production = makeConfig({target: 'production'});

gulp.task('default', webpackDevServer);
gulp.task('start', webpackDevServer);

function webpackDevServer(callback) {
    const compiler = webpack(development);
    // server and middleware options
    const config = {
        stats: development.stats,
        proxy: development.devServer.proxy,
        publicPath: development.output.publicPath,
    };
    new WebpackDevServer(compiler, config)
        .listen(8080, "localhost", function (err) {
            if (err) throw new PluginError("webpack-dev-server", err);
            // Server listening
            log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/backend");
            callback();
        });
}

gulp.task('server', webpackDevServer);

function logStats(config, callback) {
    return function (err, stats) {
        if (err) throw new PluginError("webpack", err);
        log("[webpack]", stats.toString(config.stats));
        callback && callback();
    }
}

export function watch() {
    webpack(development).watch({}, logStats(development));
}

export function bundle(callback) {
    webpack(production).run(logStats(production, callback));
}

gulp.task('clean-bundle', gulp.series(clean, bundle));

function bundleWatch() {
    webpack(production).watch({}, logStats(production));
}

gulp.task('clean-watch', gulp.series(clean, watch));
gulp.task('bundle-watch', gulp.series(clean, bundleWatch));
gulp.task('bundle-ci', gulp.series(clean, bundle, rewriteSourcemap, moveSourcemap));

function rewriteSourcemap() {
    const prefix = 'http://localhost:5678/';
    return gulp.src(['assets/**/*.js', 'assets/**/*.css'], {base: './'})
        .pipe(replace(/^(\/.# sourceMappingURL=)/gm, `$1${prefix}`))
        .pipe(gulp.dest('.'))
}

function moveSourcemap() {
    return gulp.src('assets/**/*.map')
        .pipe(vinylPaths(del))
        .pipe(flatten())
        .pipe(gulp.dest('sourcemaps'));
}

export function clean() {
    return del([
        'assets/**/*',
        'sourcemaps/*',
    ]);
}

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
            log(total);
            next(null, total);
        });
    }, function (err, times) {
        if (err) throw new PluginError("webpack", err);
        let sum = times.reduce(function (acc, val) {
            return acc + val;
        }, 0);
        log(times);
        log('Average time:', sum / 1000 / times.length, 's.');
        callback();
    });
});
