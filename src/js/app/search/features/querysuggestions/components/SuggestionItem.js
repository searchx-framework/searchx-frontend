import React from 'react';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
import {ListGroupItem} from "react-bootstrap";

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

    return  (
        <ListGroupItem className="SuggestionItem" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave} onClick={clickUrl} onContextMenu={contextUrl}>
            {data.query}
        </ListGroupItem>
    )
};

export default SuggestionItem;
