"use strict";

class ExperimentPlugin {
    apply(compiler) {
        compiler.plugin('compilation', (compilation, data) => {
            data.normalModuleFactory.plugin('parser', (parser, options) => {
                parser.plugin("evaluate CallExpression .isBVariant", (expr) => {
                    // you now have a reference to the call expression
                    if(expr.arguments && expr.arguments[0].type === 'Literal') {
                        console.log(`Found experiment : ${expr.arguments[0].value}`);
                    }
                });
            });
        });
    }
}

module.exports = ExperimentPlugin;
