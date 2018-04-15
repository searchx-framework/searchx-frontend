import React from 'react';
import {Button, Collapse} from "react-bootstrap";

class CollapsedSearchResults extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Collapse in={!this.props.showBookmarked}>
                <div className="result-collapsed">
                    <Button bsSize="xsmall" onClick={this.props.showBookmarkedResultsHandler} className="collapsedResultsButton">
                        {this.props.resultsLength} results hidden (click to show)
                    </Button>
                </div>
            </Collapse>
        );

    }
}

export default CollapsedSearchResults;