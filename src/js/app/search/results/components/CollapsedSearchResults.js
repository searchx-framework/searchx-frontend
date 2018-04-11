import React from 'react';
import {Collapse} from "react-bootstrap";

class CollapsedSearchResults extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Collapse in={!this.props.showBookmarked}>
                <div className="collapsedResultsButton">
                    <span onClick={this.props.showBookmarkedResultsHandler} title={this.props.resultsLength + " results hidden (click to show)"}><i className="fa fa-circle"/></span>
                </div>
            </Collapse>
        );

    }
}

export default CollapsedSearchResults;