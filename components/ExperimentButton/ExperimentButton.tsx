import * as React from 'react';
const s = require('./style');

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
    render() {
        return (
            <div className={s[this.state.variant]}>
                <button onClick={() => this.toggleVariant()}>
                    Experiment Button
                </button>
            </div>
        );
    }
}

export default ExperimentButton;
