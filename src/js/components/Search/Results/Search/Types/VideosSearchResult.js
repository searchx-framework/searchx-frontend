import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import ReactPlayer from 'react-player'

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

////

export default class VideosSearchResult extends React.Component {

    getTitle(str){
        if (str.length < 32) {
            return str;
        }
        return str.slice(0,30) + " ...";
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");  
    }

    getInfo(publisher, views, date, creator){
        let info = "";
        if (publisher) {
                info  += publisher;
        }

        if (views) {
                if (publisher) {
                    info += " · "
                } 
                info += this.numberWithCommas(views) +" views"
        }

        if (creator) {
                info += " · " +  creator;
        }
        return info + " "  + date;
    }

    ////

    render(){
        let metaInfo = {
            url: this.props.result.url,
            query: this.props.query,
            page: this.props.page,
            vertical: 'videos',
            serp_id: this.props.serp_id,
        };

        let clickUrlLog = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo)
        };

        let playVideoLog = (e) => {
            const metaInfoVideo = {metaInfo, action:'play'};
            log(LoggerEventTypes.SEARCHRESULT_VIDEO,metaInfoVideo)
        };
        
        let pauseVideoLog = (e) => {
            const metaInfoVideo = {metaInfo, action:'pause'};
            log(LoggerEventTypes.SEARCHRESULT_VIDEO,metaInfoVideo)
        };

        let stopVideoLog = (e) => {
            const metaInfoVideo = {metaInfo, action:'stop'};
            log(LoggerEventTypes.SEARCHRESULT_VIDEO,metaInfoVideo)
        };

        let viewUrlLog = (isVisible) => {
            const metaInfoView = {metaInfo, isVisible: isVisible};
            log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfoView)
        };

        let contextUrlLog = () => {
            log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo)
        };

        let hoverEnter = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo)
        };

        let hoverLeave = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo)
        };
     
        ////

        const creator = this.props.creator ? this.props.creator : {name:" "};
        const cts = this.props.result.datePublished;
        const cdate = (new Date(cts));
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        let dateString = cdate.getDate().toString() + " " + monthNames[cdate.getMonth()] + " " + cdate.getFullYear().toString();

        ////

        return (
            <div className="SearchResults-video">
                <VisibilitySensor onChange={viewUrlLog} 
                    scrollCheck
                    delayedCall={true}
                    scrollThrottle={50}
                    intervalDelay={2000}
                />

                <div onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                    <div className="player">
                        <ReactPlayer url={this.props.result.url}
                                     playing={false}
                                     width={275}
                                     height={150}
                                     onPlay={playVideoLog}
                                     onEnded={stopVideoLog}
                                     onPause={pauseVideoLog}
                                     controls={true}
                        />
                    </div>

                    <div className="info">
                        {this.props.bookmarkButton}

                        <h2>
                            <a href = {this.props.result.contentUrl} target="_blank" onClick={clickUrlLog} onContextMenu={contextUrlLog}>
                                 {this.getTitle(this.props.result.name)}
                            </a>
                        </h2>

                        <h6>{
                            this.getInfo(
                                this.props.result.publisher[0].name,
                                this.props.result.viewCount,
                                dateString,
                                creator.name
                            )
                        }</h6>

                        {this.props.bookmarkInfo}
                    </div>
                </div>
            </div>
        )
    }
}