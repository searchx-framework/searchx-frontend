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

    const width1 = data.score1 * 648;
    const width2 = (data.score2 - data.score1) * 648;

    const colorbar1 = [];
    const colorbar2 = [];
    const letters = ['6', '8', 'A', 'C'];

    for (let i = 0; i < 4; i++) {
        const l = letters[i];
        const color = `#${l}${l}FF${l}${l}`;
        colorbar1.push(<div className="ColorBar ColorBar1" style={{width: width1 / i, 'background-color': color}}/>);
    }

    for (let i = 0; i < 4; i++) {
        const l = letters[i];
        const color = `#FF${l}${l}${l}${l}`;
        colorbar2.push(<div className="ColorBar ColorBar2" style={{'margin-left': width1, width: width2 / i, 'background-color': color}}/>);
    }

    return  (
        <ListGroupItem className="SuggestionItem" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave} onClick={clickUrl} onContextMenu={contextUrl}>
            {colorbar1}
            {colorbar2}
            <div className="TextArea">
                {data.query}
            </div>
        </ListGroupItem>
    )
};

export default SuggestionItem;
