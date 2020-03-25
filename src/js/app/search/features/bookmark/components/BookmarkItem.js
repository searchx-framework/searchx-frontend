import React from 'react';
import Rating from 'react-rating';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

import config from '../../../../../config';

const BookmarkItem = function({data, removeHandler, starHandler, clickHandler}) {
    let metaInfo = {
        url: data.url,
        userId: data.userId,
        session: localStorage.getItem("session-num") || 0,
    };

    let hoverEnterSummary = () => log(LoggerEventTypes.BOOKMARK_HOVERENTER, metaInfo);
    let hoverLeaveSummary = () => log(LoggerEventTypes.BOOKMARK_HOVERLEAVE,metaInfo);
    let contextUrl = () => log(LoggerEventTypes.BOOKMARK_CONTEXT_URL,metaInfo);
    let clickUrl = () => {
        clickHandler(data.url);
        log(LoggerEventTypes.BOOKMARK_CLICK_URL, metaInfo);
    };

    ////

    const color = data.userColor;

    // todo: put id vs url in bookmark model instead of isNaN hack
    return  (
        <div className="item" style={{borderColor: color}} onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary}>
            <div className="buttons">
                {config.interface.star && (
                    <Rating className="topicon" emptySymbol="fa fa-star-o" fullSymbol="fa fa-star"
                            onClick={() => starHandler(data.url)}
                            stop={1} initialRating={data.starred ? 1 : 0}
                    />
                )}
                <Rating className={(config.interface.star ? "bottomicon " : "topicon ") + "remove"} emptySymbol="fa fa-trash-o" fullSymbol="fa fa-trash"
                        onClick={() => removeHandler(data.url)}
                        stop={1} initialRating={0}
                />
            </div>

            <h2>
                <a title={data.title} href="#/"  style={{color: color, cursor: 'pointer'}} onClick={clickUrl} onContextMenu={contextUrl}>
                    {data.title}
                </a>
            </h2>

            <span>
                {isNaN(data.url) ? data.url : (config.interface.star && <br/>)}
            </span>
        </div>
    )
};

export default BookmarkItem;
