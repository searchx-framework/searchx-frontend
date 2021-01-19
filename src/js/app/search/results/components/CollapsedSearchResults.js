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
            session: localStorage.getItem("session-num") || 0,
        }
    }

    clickHandler() {
        if (this.props.resultsAreCollapsed) {
            this.show();
        } else {
            this.hide();
        }
    }

    getResultIds() {
        return this.props.results.map(result => result.id ? result.id : result.url);
    }

    show() {
        log(LoggerEventTypes.SEARCHRESULT_SHOW_COLLAPSED, this.getMetaInfo());
        this.props.showCollapsedResultsHandler(this.getResultIds());
    }

    hide() {
        log(LoggerEventTypes.SEARCHRESULT_HIDE_COLLAPSED, this.getMetaInfo());
        this.props.hideCollapsedResultsHandler(this.getResultIds());
    }

    render() {
        const resultIcons = this.props.results.map((result) => {
            if (result.metadata.bookmark) {
                return <span><i className="fa fa-bookmark resultIcon"/></span>
            } else if (result.metadata.exclude) {
                return <span><i className="fa fa-ban resultIcon"/></span>
            } else {
                return <span><i className="fa fa-refresh resultIcon"/></span>
            }
        });


        return (
            <div>
                <Collapse in={this.props.resultsAreCollapsed}>
                    <div>
                        <div className="result-collapsed">
                            <Button variant="light" bssize="xsmall" onClick={this.clickHandler} className="collapsedResultsButton"
                                    title={this.props.results.length + " results hidden"}>
                                {resultIcons}
                            </Button>
                        </div>
                    </div>
                </Collapse>
            </div>
        );

    }
}

export default CollapsedSearchResults;