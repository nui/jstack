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
            console.log(this.state);
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
                <div className={styleA.outer}>
                    <button
                        className={`btn btn-default ${styleA.button}`}
                        onClick={() => this.toggleVariant()}>
                        Experiment A Button
                    </button>
                </div>
                <button
                    className={`btn btn-default ${styleA.button}`}>
                Experiment B Button
                </button>
            </div>
        );
    }
}

export default ExperimentButton;
