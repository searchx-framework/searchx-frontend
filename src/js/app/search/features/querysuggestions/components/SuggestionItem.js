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
        clickHandler(data[0]);
        log(LoggerEventTypes.QUERYSUGGESTION_CLICK_URL, metaInfo);
    };

    const totalWidth = 648;
    const individualScent = data[1];
    const widthTotal = individualScent[0] * totalWidth;
    const widthSingleUnexplored = individualScent[1] * totalWidth;

    const collaborativeScent = data.length > 2;
    const widthGroupUnexplored = collaborativeScent ? data[2][1] * totalWidth : 0;
    const singleBarColor = collaborativeScent ? "ColorBarSingleExplored" : "ColorBarUnexplored";

    return  (
        <Button bsSize="small" className="SuggestionItem" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave} onClick={clickUrl} onContextMenu={contextUrl}>
            <div className={"ColorBar " + singleBarColor} style={{width: widthSingleUnexplored}}/>
            <div className="ColorBar ColorBarUnexplored" style={{width: widthGroupUnexplored}}/>
            <div className="ColorBar ColorBarTotal" style={{width: widthTotal}}/>
            <div className="TextArea pull-left">
                {data[0]}
            </div>
        </Button>
    )
};

export default SuggestionItem;
