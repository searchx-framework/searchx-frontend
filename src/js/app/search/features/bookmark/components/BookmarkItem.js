import React from 'react';
import Rating from 'react-rating';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

const BookmarkItem = function({data, removeHandler, starHandler, clickHandler}) {
    let metaInfo = {
        url: data.url,
        userId: data.userId
    };

    let hoverEnterSummary = () => log(LoggerEventTypes.BOOKMARK_HOVERENTER, metaInfo);
    let hoverLeaveSummary = () => log(LoggerEventTypes.BOOKMARK_HOVERLEAVE,metaInfo);
    let contextUrl = () => log(LoggerEventTypes.BOOKMARK_CONTEXT_URL,metaInfo);
    let clickUrl = () => {
        clickHandler(data.url);
        log(LoggerEventTypes.BOOKMARK_CLICK_URL, metaInfo);
    };

    ////

    let rowStyle = {
        borderColor: data.userColor
    };

    return  (
        <div className="item" style={rowStyle} onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary}>
            <div className="buttons">
                <Rating stop={1} className="star" empty="fa fa-star-o" full="fa fa-star"
                        onClick={() => starHandler(data.url)}
                        initialRate={data.starred ? 1 : 0}
                />
                <Rating stop={1} className="remove" empty="fa fa-trash-o" full="fa fa-trash"
                        onClick={() => removeHandler(data.url)}
                        initialRate={0}
                />
            </div>

            <h2>
                <a title={data.title} target="_blank" onClick={clickUrl} onContextMenu={contextUrl} style={{cursor: "pointer"}}>
                    {data.title}
                </a>
            </h2>

            <span>
                {data.url}
            </span>
        </div>
    )
};

export default BookmarkItem;
