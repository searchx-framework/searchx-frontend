import React from 'react';
import {Panel} from "react-bootstrap";

class CollapsedSearchResults extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false
        };
    }

    render() {
        return (
            <Panel className="CollapsedSearchResults">
                <Panel.Heading>
                    <Panel.Title toggle>
                        {this.props.results.length} previously bookmarked results hidden
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Collapse>
                    <Panel.Body>
                        {this.props.results}
                    </Panel.Body>
                </Panel.Collapse>
            </Panel>
        );

    }
}

export default CollapsedSearchResults;