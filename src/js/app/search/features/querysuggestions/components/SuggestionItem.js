import React from 'react';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
import {Button} from "react-bootstrap";

const SuggestionItem = function({data, clickHandler}) {
    let metaInfo = {
        suggestion: data,
    };

    let hoverEnter = () => log(LoggerEventTypes.QUERYSUGGESTION_HOVERENTER, metaInfo);
    let hoverLeave = () => log(LoggerEventTypes.QUERYSUGGESTION_HOVERLEAVE, metaInfo);
    let contextUrl = () => log(LoggerEventTypes.QUERYSUGGESTION_CONTEXT_URL, metaInfo);
    let clickUrl = () => {
        clickHandler(data);
        log(LoggerEventTypes.QUERYSUGGESTION_CLICK_URL, metaInfo);
    };

    return  (
        <Button bsSize="small" className="SuggestionItem" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave} onClick={clickUrl} onContextMenu={contextUrl}>
            <div className="TextArea pull-left">
                {data}
            </div>
        </Button>
    )
};

export default SuggestionItem;
