"use strict";


class MyPlugin {
    constructor(options) {
        this.log = options.log === false ? false : options.log || false;
    }
    apply(compiler) {
        compiler.plugin('done', () => {
            if (this.log) {
                console.log('Hello World!');
            }
        });
    }
}

module.exports = MyPlugin;