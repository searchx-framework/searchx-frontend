import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

////

const TextSearchResult = function({searchState, serpId, result, metadata, bookmarkButton, urlClickHandler}) {
    let metaInfo = {
        url: result.docid,
        query: searchState.query,
        page: searchState.page,
        serpId: serpId,
    };

    let click = () => {
        urlClickHandler(result.docid, result.document);
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo);
    };

    let view = (isVisible) => {
        metaInfo.isVisible = isVisible;
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfo);
    };

    let context = () => {
        log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL,metaInfo);
    };

    let hoverEnterSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
    };

    let hoverLeaveSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE,metaInfo);
    };

    ////

    return  (
        <div className="result-text">
            <VisibilitySensor
                onChange={view}
                scrollCheck
                delayedCall={true}
                scrollThrottle={50}
                intervalDelay={2000}
            />

            {bookmarkButton}

            <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary} >
                <h2>
                    <a title={result.fields.title} target="_blank" onClick={click} onContextMenu={context}>
                        {result.fields.title}
                    </a>
                </h2>

                <p>
                    {result.snippet}
                </p>

                {metadata}
            </div>
        </div>
    )
};

export default TextSearchResult;
