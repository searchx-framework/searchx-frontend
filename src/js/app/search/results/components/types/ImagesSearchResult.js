import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

////

const ImagesSearchResult = function ({searchState, serpId, index, result, metadata, bookmarkButton, excludeButton, urlClickHandler}) {
    let metaInfo = {
        url: result.url,
        query: searchState.query,
        page: searchState.page,
        index: index,
        serpId: serpId,
        session: localStorage.getItem("session-num") || 0,
    };

    let clickUrl = () => {
        urlClickHandler(result.url);
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

    return (
        <div className="result-image">
            <VisibilitySensor onChange={viewUrl}
                              scrollCheck
                              delayedCall={true}
                              scrollThrottle={50}
                              intervalDelay={2000}
            />

            {bookmarkButton}
            {excludeButton}

            <a href="#/" title={result.name} onClick={clickUrl} onContextMenu={contextUrl}
               onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                <div className="image" style={{backgroundImage: `url(${result.thumbnailUrl})`}}/>
            </a>

            {metadata}
        </div>
    )
};

export default ImagesSearchResult;