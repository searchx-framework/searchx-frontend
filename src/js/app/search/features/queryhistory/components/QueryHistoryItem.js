import React from "react";

import {LoggerEventTypes} from "../../../../../utils/LoggerEventTypes";
import {log} from "../../../../../utils/Logger";
import Identicon from "identicon.js";
import md5 from 'md5';

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
    
    let options = {
        size : 20
    }
    let icon = new Identicon(md5(data.userId), options).toString();
    let iconUrl = "data:image/png;base64," + icon 

    return (
        <div className="item" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
            {/* <div className="sc-message--avatar" style={{
            backgroundImage: `url(${iconUrl})`
          }}></div> */}
            <span className="text">
            <img src={iconUrl} alt={"User " + md5(data.userId)}/> <a href="#/"   style={{ cursor: 'pointer'}} onContextMenu={contextUrlLog} onClick={() => {clickHandler(data.query);clickUrlLog();}}>
                    {data.query}
                </a>
            </span>
        </div>
    );
};

export default QueryHistoryItem;