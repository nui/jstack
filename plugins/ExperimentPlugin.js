"use strict";

class ExperimentPlugin {
    constructor() {
    }

    apply(compiler) {
        compiler.plugin('compilation', (compilation, data) => {
            data.normalModuleFactory.plugin('parser', (parser, options) => {
                parser.plugin("call experiment.isBVariant", (expr) => {
                    // you now have a reference to the call expression
                    console.log(expr.arguments[0].value);
                });
            });
        });
    }
}

module.exports = ExperimentPlugin;
