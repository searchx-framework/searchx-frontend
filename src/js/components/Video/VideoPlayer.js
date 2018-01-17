import './Video.css';
import React from 'react';
import ReactPlayer from 'react-player';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';

class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let metaInfo = {
            src: this.props.src
        };

        let playVideoLog = (e) => {
            const metaInfoVideo = {metaInfo, action:'play'};
            log(LoggerEventTypes.SURVEY_LEARNING_VIDEO,metaInfoVideo)
        };

        let pauseVideoLog = (e) => {
            const metaInfoVideo = {metaInfo, action:'pause'};
            log(LoggerEventTypes.SURVEY_LEARNING_VIDEO,metaInfoVideo)
        };

        let stopVideoLog = (e) => {
            const metaInfoVideo = {metaInfo, action:'stop'};
            log(LoggerEventTypes.SURVEY_LEARNING_VIDEO,metaInfoVideo)
        };

        let viewVideoLog = (isVisible) => {
            const metaInfoVideo = {metaInfo, isVisible: isVisible};
            log(LoggerEventTypes.SURVEY_LEARNING_VIDEO, metaInfoVideo)
        };

        let hoverEnter = (e) => {
            const metaInfoVideo = {metaInfo, hover: 'enter'};
            log(LoggerEventTypes.SURVEY_LEARNING_VIDEO, metaInfoVideo)
        };

        let hoverLeave = (e) => {
            const metaInfoVideo = {metaInfo, hover: 'leave'};
            log(LoggerEventTypes.SURVEY_LEARNING_VIDEO, metaInfoVideo)
        };

        ////

        return (
            <div className="Video-player">
                <VisibilitySensor onChange={viewVideoLog}
                                  scrollCheck
                                  delayedCall={true}
                                  scrollThrottle={50}
                                  intervalDelay={2000}
                />

                <div onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                    <ReactPlayer
                        url={this.props.src}
                        playing={false}
                        width={854}
                        height={480}
                        onPlay={playVideoLog}
                        onEnded={stopVideoLog}
                        onPause={pauseVideoLog}
                        controls={true}
                    />
                </div>
            </div>
        );
    }
}

export default VideoPlayer;