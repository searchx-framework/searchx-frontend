import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

////

const WebSearchResult = function({searchState, serpId, result, bookmarkButton, bookmarkInfo}) {
    let metaInfo = {
        url: result.url,
        query: searchState.query,
        page: searchState.page,
        vertical: 'web',
        serpId: serpId,
    };

    let clickUrlLog = () => {
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo)
    };

    let viewUrlLog = (isVisible) => {
        metaInfo.isVisible = isVisible;
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfo)
    };

    let contextUrlLog = () => {
        log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL,metaInfo)
    };

    let hoverEnterSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo)
    };

    let hoverLeaveSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE,metaInfo)
    };

    ////

    return  (
        <div className="SearchResults-web">
            <VisibilitySensor
                onChange={viewUrlLog}
                scrollCheck
                delayedCall={true}
                scrollThrottle={50}
                intervalDelay={2000}
            />

            {bookmarkButton}

            <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary} >
                <h2>
                    <a href={result.url} title={result.name} target="_blank" onClick={clickUrlLog} onContextMenu={contextUrlLog}>
                        {result.name}
                    </a>
                </h2>

                <span className="source">
                    {result.displayUrl}
                </span>

                <p>
                    {result.snippet}
                </p>

                {bookmarkInfo}
            </div>
        </div>
    )
};

export default WebSearchResult;
