import React from 'react';
import {Button, Collapse} from "react-bootstrap";
import {LoggerEventTypes} from "../../../../utils/LoggerEventTypes";
import {log} from "../../../../utils/Logger";

class CollapsedSearchResults extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.clickHandler = this.clickHandler.bind(this);
    }

    getMetaInfo() {
        return {
            urls: this.props.results.map(result => result.id),
            query: this.props.searchState.query,
            page: this.props.searchState.page,
            serpId: this.props.serpId,
        }
    }

    clickHandler() {
        if (this.props.collapsed) {
            this.show();
        } else {
            this.hide();
        }
    }

    show() {
        log(LoggerEventTypes.SEARCHRESULT_SHOW_COLLAPSED, this.getMetaInfo());
        this.props.showCollapsedResultHandler(this.props.index);
    }

    hide() {
        log(LoggerEventTypes.SEARCHRESULT_HIDE_COLLAPSED, this.getMetaInfo());
        this.props.hideCollapsedResultHandler(this.props.index);
    }

    render() {
        return (
            <div>
                <Collapse in={this.props.collapsed}>
                    <div className="result-collapsed">
                        <Button bsSize="xsmall" onClick={this.clickHandler} className="collapsedResultsButton">
                            {this.props.results.length} results hidden (click to show)
                        </Button>
                    </div>
                </Collapse>
                <Collapse in={!this.props.collapsed}>
                    <div>
                        {this.props.results}
                    </div>
                </Collapse>
            </div>
        );

    }
}

export default CollapsedSearchResults;