import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

////

const TextSearchResult = function({searchState, serpId, result, metadata, bookmarkButton, urlClickHandler}) {
    let metaInfo = {
        url: result.id,
        query: searchState.query,
        page: searchState.page,
        serpId: serpId,
    };

    let clickUrl = () => {

        var doctext = result.text.split('\n').map((item, key) => {
            return <span key={key}>{item}<br/></span>
        })
     
        doctext.unshift(<h4> {result.source} <br/></h4>);
        doctext.unshift(<h3> {result.name} <br/></h3>);
        

        urlClickHandler(result.id, doctext);
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo);
    };

    let viewUrl = (isVisible) => {
        metaInfo.isVisible = isVisible;
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfo);
    };

    let contextUrl = () => {
        log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL,metaInfo);
    };

    let hoverEnterSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
    };

    let hoverLeaveSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE,metaInfo);
    };

    function createSnippet() {
        return {__html: result.snippet};
    }

    ////

    return  (
        <div className="result-text">
            <VisibilitySensor
                onChange={viewUrl}
                scrollCheck
                delayedCall={true}
                scrollThrottle={50}
                intervalDelay={2000}
            />

            {bookmarkButton}

            <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary} >
                <h2>
                    <a title={result.name} target="_blank" onClick={clickUrl} onContextMenu={contextUrl}>
                        {result.name}
                    </a>
                </h2>

                <p dangerouslySetInnerHTML={ createSnippet() }>
                </p>

                {metadata}
            </div>
        </div>
    )
};

export default TextSearchResult;
