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
            <div className="collapsedSearchResults">
                <span className="collapsedResultsButton" onClick={this.props.showBookmarkedResultsHandler}><i className="fa fa-circle"/></span>
            </div>
        );

    }
}

export default CollapsedSearchResults;