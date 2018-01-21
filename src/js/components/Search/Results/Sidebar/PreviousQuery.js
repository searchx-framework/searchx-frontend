import React from "react";
import {LoggerEventTypes} from "../../../../utils/LoggerEventTypes";
import {log} from "../../../../utils/Logger";
import AccountStore from "../../../../stores/AccountStore";
import SearchActions from "../../../../actions/SearchActions";

export default class PreviousQuery extends React.Component {
    constructor() {
        super();
    }

    handleClick() {
        SearchActions.search(this.props.data.query);
    }

    render() {
        let metaInfo = {
            url: this.props.data.query
        };

        let clickUrlLog = (e) => log(LoggerEventTypes.QUERYHISTORY_CLICK_URL, metaInfo);
        let contextUrlLog = (e) => log(LoggerEventTypes.QUERYHISTORY_CONTEXT_URL, metaInfo);
        let hoverEnter = (e) => log(LoggerEventTypes.QUERYHISTORY_HOVERENTER, metaInfo);
        let hoverLeave = (e) => log(LoggerEventTypes.QUERYHISTORY_HOVERLEAVE, metaInfo);

        ////

        let color = "";
        if (AccountStore.isCollaborative()) {
            color = AccountStore.getMemberColor(this.props.data.userId);
        }

        return (
            <div className="PreviousQueries-result" style={{borderColor: color}} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                <span className="text">
                    <span style={{color: 'gray'}}>{new Date(this.props.data.created).toLocaleTimeString()}</span>
                    <a style={{color: color, cursor: 'pointer'}} onContextMenu={contextUrlLog} onClick={() => {this.handleClick(); clickUrlLog();}}>
                        {this.props.data.query}
                    </a>
                </span>
            </div>
        );
    }
}