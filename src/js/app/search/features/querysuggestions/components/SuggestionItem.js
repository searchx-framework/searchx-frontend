import React from 'react';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

const SuggestionItem = function({data, clickHandler}) {
    let metaInfo = {
        query: data.query,
    };

    let hoverEnter = () => log(LoggerEventTypes.QUERYSUGGESTION_HOVERENTER, metaInfo);
    let hoverLeave = () => log(LoggerEventTypes.QUERYSUGGESTION_HOVERLEAVE, metaInfo);
    let contextUrl = () => log(LoggerEventTypes.QUERYSUGGESTION_CONTEXT_URL, metaInfo);
    let clickUrl = () => {
        clickHandler(data.query);
        log(LoggerEventTypes.QUERYSUGGESTION_CLICK_URL, metaInfo);
    };

    const color = '#888888';

    return  (
        <div className="item" style={{borderColor: color}} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
            <h2>
                <a title={data.query} style={{color: color, cursor: 'pointer'}} target="_blank" onClick={clickUrl} onContextMenu={contextUrl}>
                    {data.query}
                </a>
            </h2>
        </div>
    )
};

export default SuggestionItem;
