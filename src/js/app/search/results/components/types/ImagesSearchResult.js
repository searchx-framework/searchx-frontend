import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

////

const ImagesSearchResult = function({searchState, serpId, result, bookmarkButton, bookmarkInfo}) {
    let metaInfo = {
        url: result.url,
        query: searchState.query,
        page: searchState.page,
        vertical: 'images',
        serpId: serpId,
    };

    let clickUrlLog = () => {
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo);
    };

    let viewUrlLog = (isVisible) => {
        const metaInfoView = {metaInfo, isVisible: isVisible};
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfoView)
    };

    let contextUrlLog = () => {
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
        <div className="SearchResults-image">
            <VisibilitySensor onChange={viewUrlLog}
                scrollCheck
                delayedCall={true}
                scrollThrottle={50}
                intervalDelay={2000}
            />

            <a  href={result.url}
                title={result.name}
                target="_blank"
                onClick={clickUrlLog}
                onContextMenu={contextUrlLog}
                onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                <div className="image" style={{backgroundImage: `url(${result.thumbnailUrl})`}}/>
            </a>

            {bookmarkButton}
            {bookmarkInfo}
        </div>
    )
};

export default ImagesSearchResult;