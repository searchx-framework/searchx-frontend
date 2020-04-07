import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import ReactPlayer from 'react-player'

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';
////

function getTitle(str) {
    if (str.length < 32) {
        return str;
    }
    return str.slice(0, 30) + " ...";
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatInfo(publisher, views, creator) {
    let info = "";
    if (publisher) {
        info += publisher;
    }

    if (views) {
        if (publisher) {
            info += " · "
        }

        views = views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        info += numberWithCommas(views) + " views"
    }

    if (creator) {
        info += " · " + creator;
    }

    return info;
}

////

const VideosSearchResult = function ({searchState, serpId, index, result, metadata, bookmarkButton, excludeButton, urlClickHandler}) {
    const metaInfo = {
        url: result.url,
        query: searchState.query,
        page: searchState.page,
        index: index,
        serpId: serpId,
        session: localStorage.getItem("session-num") || 0,
    };

    const clickUrl = () => {
        urlClickHandler(result.url);
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo);
    };

    const playVideo = () => {
        const metaInfoVideo = {metaInfo, action: 'play'};
        log(LoggerEventTypes.SEARCHRESULT_VIDEO, metaInfoVideo);
    };

    const pauseVideo = () => {
        const metaInfoVideo = {metaInfo, action: 'pause'};
        log(LoggerEventTypes.SEARCHRESULT_VIDEO, metaInfoVideo);
    };

    const stopVideo = () => {
        const metaInfoVideo = {metaInfo, action: 'stop'};
        log(LoggerEventTypes.SEARCHRESULT_VIDEO, metaInfoVideo);
    };

    const viewUrl = (isVisible) => {
        const metaInfoView = {metaInfo, isVisible: isVisible};
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfoView);
    };

    const contextUrl = () => {
        log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo);
    };

    const hoverEnter = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
    };

    const hoverLeave = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo);
    };

    ////

    const creator = result.creator ? result.creator : {name: false};
    
    return (
        <div className="result-video">
            <VisibilitySensor onChange={viewUrl}
                              scrollCheck
                              delayedCall={true}
                              scrollThrottle={50}
                              intervalDelay={2000}
            />

            <div onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                <div className="player">
                    <ReactPlayer url={result.url}
                                 playing={false}
                                 width={275}
                                 height={150}
                                 onPlay={playVideo}
                                 onEnded={stopVideo}
                                 onPause={pauseVideo}
                                 controls={true}
                                 config={{
                                    youtube: {
                                      playerVars: { fs: 0 }
                                    },
                                    dailymotion:{
                                        params : {controls: false }
                                    }, 
                                    twitch: {
                                        options : {allowfullscreen: false}
                                    }
                                }
                            }
                            vimeoConfig={{ iframeParams: { fullscreen: 0 } }}
                    />
                </div>

                <div className="info">
                    {bookmarkButton}
                    {excludeButton}

                    <h2>
                        <a  href="#/" onClick={clickUrl} onContextMenu={contextUrl}>
                            {getTitle(result.name)}
                        </a>
                    </h2>

                    <h6>{
                        formatInfo(
                            result.publisher[0].name,
                            result.viewCount,
                            creator.name
                        )
                    }</h6>

                    {metadata}
                </div>
            </div>
        </div>
    )
};

export default VideosSearchResult;