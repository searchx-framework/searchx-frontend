import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

////

function isCollapsible(result) {
    return (result.metadata.bookmark || result.metadata.exclude);
}

const TextSearchResult = function({searchState, serpId, result, metadata, bookmarkButton, excludeButton, urlClickHandler, hideCollapsedResultsHandler}) {
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

    const hideCollapsedResults = function () {
        const id = result.id ? result.id : result.url;
        hideCollapsedResultsHandler([id]);
    };

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
            {excludeButton}

            <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary} >
                <div className="lineContainer">
                    <h2>
                        <a title={result.name} target="_blank" onClick={clickUrl} onContextMenu={contextUrl}>
                            {result.name}
                        </a>
                    </h2>
                    {isCollapsible(result) && (
                        <div className="clickArea" role="button" onClick={hideCollapsedResults} />
                    )}
                </div>

                {isCollapsible(result) ? (
                    <div className="textArea" role="button" onClick={hideCollapsedResults}>
                        <p dangerouslySetInnerHTML={ createSnippet() }>
                        </p>

                        {metadata}
                    </div>
                ) : (
                    <div className="textArea">
                        <p dangerouslySetInnerHTML={ createSnippet() }>
                        </p>

                        {metadata}
                    </div>
                )}

            </div>
        </div>
    )
};

export default TextSearchResult;
