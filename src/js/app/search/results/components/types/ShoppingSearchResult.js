import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import ProductViewer from '../viewer/ProductViewer';
import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
import ReactStars from 'react-stars'
////

const ShoppingSearchResult = function ({searchState, serpId, index, result, metadata, bookmarkButton, excludeButton, basketButton, urlClickHandler}) {
    let metaInfo = {
        url: result.url || result.id,
        query: searchState.query,
        page: searchState.page,
        index: index,
        serpId: serpId,
        session: localStorage.getItem("session-num") || 0,
    };

    let clickUrl = () => {

        var doctext = ProductViewer(result);

        urlClickHandler(result.id, doctext);
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo);
    };

    let viewUrl = (isVisible) => {
        const metaInfoView = {metaInfo, isVisible: isVisible};
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfoView);
    };

    let contextUrl = () => {
        log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo);
    };

    let hoverEnter = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
    };

    let hoverLeave = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo);
    };

    ////

    
    let brand = result.brand ? <p>{result.brand}</p> : <br/>
    return (
        <div className="card result-shopping">
            <VisibilitySensor onChange={viewUrl}
                              scrollCheck
                              delayedCall={true}
                              scrollThrottle={50}
                              intervalDelay={2000}
            />
            <img className="image card-img-top" src={result.image} alt={result.name} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave} ></img>
            <div className="info card-body container">
                <div className=" row productTitle">
                        <a title={result.name} href="#/" onClick={clickUrl} onContextMenu={contextUrl}>
                            {result.name}
                        </a>
                    </div>
                    <div className="row" >
                        {brand}
                    </div>
                <div className="row" >
                <ReactStars
                     count={5} value={result.rating} edit={false} half={true}

                size={18}
                color2={'#ffd700'} />  ({result.count})
                </div>
                <div className="row">
                <span className="price">${result.price}</span>
                </div>
                <div className="row" >
                    <div className="col- bookmark"> 
                    {bookmarkButton} 
                    </div>
                    <div className="col- bookmark"> 
                    {basketButton} 
                    </div>
                </div>
                
            </div>
           
            
    
        </div>
    )
};

export default ShoppingSearchResult;