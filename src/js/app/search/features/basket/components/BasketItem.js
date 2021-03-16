import React from 'react';
import Rating from 'react-rating';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
import Identicon from "identicon.js";
import md5 from 'md5';
import config from '../../../../../config';
import Helpers from '../../../../../utils/Helpers';

const BasketItem = function({data, removeHandler, clickHandler}) {
    let metaInfo = {
        url: data.url,
        userId: data.userId,
        session: localStorage.getItem("session-num") || 0,
    };

    let hoverEnterSummary = () => log(LoggerEventTypes.BASKET_HOVERENTER, metaInfo);
    let hoverLeaveSummary = () => log(LoggerEventTypes.BASKET_HOVERLEAVE,metaInfo);
    let contextUrl = () => log(LoggerEventTypes.BASKET_CONTEXT_URL,metaInfo);
    let clickUrl = () => {
        clickHandler(data.url);
        log(LoggerEventTypes.BASKET_CLICK_URL, metaInfo);
    };

    ////

    const color = data.userColor;

    let options = {
        size : 20
    }
    let icon = new Identicon(md5(data.userId), options).toString();
    let iconUrl = "data:image/png;base64," + icon 

    // todo: put id vs url in basket model instead of isNaN hack
    return  (
        <div className="item" style={{borderColor: color}} onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary}>


            
            <img src={iconUrl} alt={"User " + md5(data.userId)}/>  
            
            <a title={data.title} href="#/"  style={{cursor: 'pointer'}} onClick={clickUrl} onContextMenu={contextUrl}>
                    {data.title}
                </a>
            

            <div className="buttons">
                <Rating className={(config.interface.star ? "bottomicon " : "topicon ") + "remove"} emptySymbol="fa fa-trash-o" fullSymbol="fa fa-trash"
                        onClick={() => removeHandler(data.url)}
                        stop={1} initialRating={0}
                />
            </div>
            
            <span>
                {isNaN(data.url) && Helpers.validURL(data.url) ? data.url : (config.interface.star && <br/>)}
            </span>

            
        </div>
    )
};

export default BasketItem;
