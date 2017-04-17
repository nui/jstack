import * as React from "react";

const styleA = require('./styleA.css');
const styleB = require('./styleB.css');


export class ExperimentButton extends React.Component {
    constructor(props) {
        super();
        this.state = {
            variant: 'A'
        };
    }

    toggleVariant() {
        this.setState((prevState) => {
            return {
                variant: prevState.variant === 'A' ? 'B' : 'A'
            }
        });
    }

    get style() {
        return this.state.variant === 'A' ? styleA : styleB;
    }

    render() {
        const style = this.style;
        return (
            <div>
                <div className={style.outer}>
                    <button
                        className={`btn btn-default ${style.button}`}
                        onClick={() => this.toggleVariant()}>
                        Variant {this.state.variant} Button 1
                    </button>
                </div>
                <button
                    className={`btn btn-default ${style.button}`}>
                    Variant {this.state.variant} Button 2
                </button>
                <div className="some-global-class">
                    <button
                        className={`btn btn-default ${style.button}`}>
                        Variant {this.state.variant} Button 3
                    </button>
                </div>
            </div>
        );
    }
}
