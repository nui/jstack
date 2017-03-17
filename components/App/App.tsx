import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, ButtonToolbar, DropdownButton, MenuItem} from "react-bootstrap";
import {ExperimentButton} from "../ExperimentButton/ExperimentButton";

// import "bootstrap/less/bootstrap";

ReactDOM.render(
    <div>
        <div className="container">
            <div className="row">
                <div className="col-xs-12">
                    <h1>Hello, world!</h1>
                    <DropdownButton id="dropdown" title="Dropdown">
                        <MenuItem eventKey="1">Dropdown link</MenuItem>
                        <MenuItem eventKey="2">Dropdown link</MenuItem>
                    </DropdownButton>
                    <ExperimentButton />
                    <Button bsStyle="primary">Primary</Button>
                </div>
            </div>
        </div>
    </div>,
    document.getElementById('root')
);
