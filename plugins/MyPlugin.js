"use strict";


class MyPlugin {
    constructor(options) {
        this.log = options.log === false ? false : options.log || false;
    }
    apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin("optimize-chunk-assets", (chunks, callback) => {
                const files = [];
                chunks.forEach((chunk) => files.push.apply(files, chunk.files));
                files.push.apply(files, compilation.additionalChunkAssets);
                console.log(files.length);
                callback();
            });
        });
        compiler.plugin('done', () => {
        });
    }
}

module.exports = MyPlugin;