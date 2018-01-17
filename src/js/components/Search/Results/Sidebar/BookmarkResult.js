import React from 'react';
import Rating from 'react-rating';

import SessionActions from '../../../../actions/SessionActions';
import SearchStore from '../../../../stores/SearchStore';
import AccountStore from "../../../../stores/AccountStore";
import TaskStore from "../../../../stores/TaskStore";

import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../utils/LoggerEventTypes';

export default class BookmarkResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {bookmark: props.result};

        this.handleOnRemove = this.handleOnRemove.bind(this);
        this.handleOnStar = this.handleOnStar.bind(this);
    }

    handleOnRemove() {
       SessionActions.removeBookmark(this.props.result.url);
       SearchStore.searchAndRemoveBookmark(this.props.result.url);
    };

    handleOnStar() {
        SessionActions.starBookmark(this.props.result.url);
    };

    ////

    componentWillReceiveProps(nextProps) {
        this.setState({
            bookmark: nextProps.result,
        });
    }

    render(){
        let metaInfo = {
            url: this.props.result.url
        };

        let clickUrlLog = (e) => {
            log(LoggerEventTypes.BOOKMARK_CLICK_URL, metaInfo)
        };

        let contextUrlLog = (e) => {
            log(LoggerEventTypes.BOOKMARK_CONTEXT_URL,metaInfo)
        };

        let hoverEnterSummary = (e) => {
            log(LoggerEventTypes.BOOKMARK_HOVERENTER, metaInfo)
        };

        let hoverLeaveSummary = (e) => {
            log(LoggerEventTypes.BOOKMARK_HOVERLEAVE,metaInfo)
        };

        ////

        let rowStyle = {};
        if (AccountStore.isCollaborative() && TaskStore.isIntroSearchDone()) {
            rowStyle.borderColor = AccountStore.getMemberColor(this.state.bookmark.userId);
        }

        return  (
            <div className="row BookmarkResults-result" style={rowStyle}>
                <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary} >
                    <div className="buttons">
                        <Rating stop={1} className="star" empty="fa fa-star-o" full="fa fa-star"
                                onClick={this.handleOnStar}
                                initialRate={this.state.bookmark.starred ? 1 : 0}
                        />
                        <Rating stop={1} className="remove" empty="fa fa-trash-o" full="fa fa-trash"
                                onClick={this.handleOnRemove}
                                initialRate={0}
                        />
                    </div>

                    <h2>
                        <a href={this.props.result.url} title={this.props.result.title} target="_blank" onClick={clickUrlLog} onContextMenu={contextUrlLog}>
                            {this.props.result.title}
                        </a>
                    </h2>
                    
                    <span>
                        {this.props.result.url}
                    </span>
                </div>
            </div>
        )
    }
}
