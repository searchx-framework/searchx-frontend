import React from 'react';

import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../constants/LoggerEventTypes';
import SearchStore from '../../../../stores/SearchStore';
import AppActions from '../../../../AppActions';
import Rating from 'react-rating';
import AccountStore from "../../../../stores/AccountStore";
import TaskStore from "../../../../stores/TaskStore";

export default class BookmarkResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {bookmark: props.result};
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick () {
       AppActions.removeBookmark(this.props.result.url);
       SearchStore.searchAndRemoveBookmark(this.props.result.url);
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

        let rowStyle = {
            backgroundColor: '#F5F5F5',
            borderColor: 'DarkSlateGray'
        };

        if (AccountStore.isCollaborative() && TaskStore.isIntroDone()) {
            rowStyle.borderColor = AccountStore.getMemberColor(this.state.bookmark.userId);
        }

        return  (
            <div className="row BookmarkResults-result" style={rowStyle}>
                <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary} >
                    <Rating stop={1} className="trash" empty="fa fa-trash-o" full="fa fa-trash-o" onClick={this.handleOnClick} initialRate={1}/>

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
