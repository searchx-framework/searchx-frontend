import React from 'react';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
import {ListGroupItem} from "react-bootstrap";

const SuggestionItem = function({data, clickHandler}) {
    let metaInfo = {
        query: data[0],
    };

    let hoverEnter = () => log(LoggerEventTypes.QUERYSUGGESTION_HOVERENTER, metaInfo);
    let hoverLeave = () => log(LoggerEventTypes.QUERYSUGGESTION_HOVERLEAVE, metaInfo);
    let contextUrl = () => log(LoggerEventTypes.QUERYSUGGESTION_CONTEXT_URL, metaInfo);
    let clickUrl = () => {
        clickHandler(data[0]);
        log(LoggerEventTypes.QUERYSUGGESTION_CLICK_URL, metaInfo);
    };

    const totalWidth = 648;
    const scentValues = data[1];
    const collaborativeScent = scentValues.length > 2;
    const unexploredValue = collaborativeScent ? scentValues[2] : scentValues[1];
    const widthSingleExplored = scentValues[0] * totalWidth;
    const widthGroupExplored = collaborativeScent ? scentValues[1] * totalWidth : 0;
    const widthTotal = unexploredValue * totalWidth;

    return  (
        <ListGroupItem className="SuggestionItem" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave} onClick={clickUrl} onContextMenu={contextUrl}>
            <div className="ColorBar ColorBar1" style={{width: widthSingleExplored}}/>
            <div className="ColorBar ColorBar2" style={{width: widthGroupExplored}}/>
            <div className="ColorBar ColorBar3" style={{width: widthTotal}}/>
            <div className="TextArea">
                {data[0]}
            </div>
        </ListGroupItem>
    )
};

export default SuggestionItem;