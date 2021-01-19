import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

////

const NewsSearchResult = function ({searchState, serpId, index, result, metadata, bookmarkButton, excludeButton, urlClickHandler}) {
    let metaInfo = {
        url: result.url,
        query: searchState.query,
        index: index,
        page: searchState.page,
        vertical: 'news',
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

    let hoverEnterSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
    };

    let hoverLeaveSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo);
    };

    ////

    const cts = result.datePublished;
    const cdate = (new Date(cts));
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    ////

    return (
        <div className="result-news">
            <VisibilitySensor onChange={viewUrl}
                              scrollCheck
                              delayedCall={true}
                              scrollThrottle={50}
                              intervalDelay={2000}
            />

            <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary}>
                <div className="image">
                    {result.image ?
                        <div><img src={result.image.thumbnail.contentUrl} alt={result.image.thumbnail.contentUrl}/></div> :
                        <div><img src='/img/image_placeholder.png'alt={'/img/image_placeholder.png'}/></div>
                    }
                </div>

                <div className="info">
                    {bookmarkButton}
                    {excludeButton}

                    <h2>
                        <a title={result.name} href="#/" onClick={clickUrl} onContextMenu={contextUrl}>
                            {result.name}
                        </a>
                    </h2>

                    <span className="source">
                        {result.provider[0].name + " - " + cdate.getDate().toString() + " " + monthNames[cdate.getMonth()] + " " + cdate.getFullYear().toString()}
                    </span>

                    <p>
                        {result.description}
                    </p>

                    {metadata}
                </div>
            </div>
        </div>
    )
};

export default NewsSearchResult;
