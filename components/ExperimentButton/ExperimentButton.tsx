import * as React from 'react';

const styleA = require('./styleA');
const styleB = require('./styleB');

interface States {
    variant: string;
}

export class ExperimentButton extends React.Component<any, States> {
    constructor(props: any)
    {
        super();
        this.state = {
            variant: 'A'
        };
    }
    toggleVariant() {
        this.setState((prevState: States) => {
            return {
                variant: prevState.variant == 'A' ? 'B' : 'A'
            }
        });
    }
    get style() {
        return this.state.variant == 'A' ? styleA : styleB;
    }
    render() {
        return (
            <div>
                <div className={this.style.outer}>
                    <button
                        className={`btn btn-default ${this.style.button}`}
                        onClick={() => this.toggleVariant()}>
                        Variant {this.state.variant} Button 1
                    </button>
                </div>
                <button
                    className={`btn btn-default ${this.style.button}`}>
                    Variant {this.state.variant} Button 2
                </button>
            </div>
        );
    }
}

export default ExperimentButton;
