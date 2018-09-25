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
    const collaborativeScent = data.length > 3;
    const unexploredValue = collaborativeScent ? data[3] : data[2];
    const widthSingleExplored = data[1] * totalWidth;
    const widthGroupExplored = collaborativeScent ? data[2] * totalWidth : 0;
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
