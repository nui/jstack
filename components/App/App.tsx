import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Button, ButtonToolbar} from 'react-bootstrap';

import {ExperimentButton} from "../ExperimentButton/ExperimentButton";

ReactDOM.render(
    <div>
        <div className="container">
            <div className="row">
                <div className="col-xs-12">
                    <h1>Hello, world!</h1>
                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Action <span className="caret"></span>
                    </button>
                    <ExperimentButton />
                    <Button bsStyle="primary">Primary</Button>
                </div>
            </div>
        </div>
    </div>,
    document.getElementById('root')
);
