import React from "react";

import {LoggerEventTypes} from "../../../../../utils/LoggerEventTypes";
import {log} from "../../../../../utils/Logger";

const QueryHistoryItem = function({data, clickHandler}) {
    const metaInfo = {
        url: data.query,
        userId: data.userId,
        session: localStorage.getItem("session-num") || 0,
    };

    const clickUrlLog = () => log(LoggerEventTypes.QUERYHISTORY_CLICK_URL, metaInfo);
    const contextUrlLog = () => log(LoggerEventTypes.QUERYHISTORY_CONTEXT_URL, metaInfo);
    const hoverEnter = () => log(LoggerEventTypes.QUERYHISTORY_HOVERENTER, metaInfo);
    const hoverLeave = () => log(LoggerEventTypes.QUERYHISTORY_HOVERLEAVE, metaInfo);

    ////

    const color = data.userColor;

    return (
        <div className="item" style={{borderColor: color}} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
            <span className="text">
                <a style={{color: color, cursor: 'pointer'}} onContextMenu={contextUrlLog} onClick={() => {clickHandler(data.query);clickUrlLog();}}>
                    {data.query}
                </a>
            </span>
        </div>
    );
};

export default QueryHistoryItem;