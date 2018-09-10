import React from 'react';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
import {Button} from "react-bootstrap";

const AspectItem = function({data, clickHandler}) {
    let metaInfo = {
        key: data.key,
        text: data.text
    };

    let hoverEnter = () => log(LoggerEventTypes.ASPECT_HOVERENTER, metaInfo);
    let hoverLeave = () => log(LoggerEventTypes.ASPECT_HOVERLEAVE, metaInfo);
    let contextUrl = () => log(LoggerEventTypes.ASPECT_CONTEXT_BUTTON, metaInfo);
    let clickUrl = () => {
        clickHandler(data.key);
        log(LoggerEventTypes.QUERYSUGGESTION_CLICK_URL, metaInfo);
    };

    return  (
        <div className="AspectItem">
            <Button style={{'background-color': data.color}} bsSize="xsmall" onClick={clickUrl} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                {data.text}
            </Button>
        </div>
    )
};

export default AspectItem;
