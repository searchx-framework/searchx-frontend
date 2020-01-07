import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

////

const WebSearchResult = function ({searchState, serpId, result, metadata, bookmarkButton, excludeButton, urlClickHandler}) {
    let metaInfo = {
        url: result.url,
        query: searchState.query,
        page: searchState.page,
        serpId: serpId,
        session: localStorage.getItem("session-num") || 0, 
    };

    let clickUrl = () => {
        urlClickHandler(result.url);
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo);
    };

    let viewUrl = (isVisible) => {
        metaInfo.isVisible = isVisible;
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfo);
    };

    let contextUrl = () => {
        log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo);
    };

    let hoverEnterSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
    };

    let hoverLeaveSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo);
    };

    ////

    return (
        <div className="result-web">
            <VisibilitySensor
                onChange={viewUrl}
                scrollCheck
                delayedCall={true}
                scrollThrottle={50}
                intervalDelay={2000}
            />

            {bookmarkButton}
            {excludeButton}

            <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary}>
                <h2>
                    <a title={result.name} href={result.name} onClick={clickUrl} onContextMenu={contextUrl}>
                        {result.name}
                    </a>
                </h2>

                <span className="source">
                    {result.displayUrl}
                </span>

                <p>
                    {result.snippet}
                </p>

                {metadata}
            </div>
        </div>
    )
};

export default WebSearchResult;
