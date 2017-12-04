import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../logger/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';


class NewsSearchResult extends React.Component {
    render(){

        let metaInfo = {
                url: this.props.result.displayUrl,
                query: this.props.query,
                page: this.props.page,
                vertical: 'news',
                serp_id: this.props.serp_id,
        };

        let clickUrlLog = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_CLICK_URL,metaInfo);
        };

        let viewUrlLog = (isVisible) => {
            const metaInfoView = {metaInfo, isVisible: isVisible};
            log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfoView);
        };

        let contextUrlLog = () => {
            log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo);
        };

        let hoverEnterSummary = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
        };

        let hoverLeaveSummary = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo);
        };
        
        let cName = 'row NewsSearchResults-result';
        const cts = this.props.result.datePublished;
        const cdate = (new Date(cts));
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return (
            <div className={cName}>
                <VisibilitySensor onChange={viewUrlLog} 
                    scrollCheck
                    delayedCall={true}
                    scrollThrottle={50}
                    intervalDelay={2000}
                />
                <div className="newsContainer" onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary}>
                   
                        { (this.props.result.image) ?  <div> <img src={this.props.result.image.thumbnail.contentUrl} /> </div>: "" }
                    
                    <h2>
                        <a href={this.props.result.url} title={this.props.result.name} target="_blank" onClick={clickUrlLog} onContextMenu={contextUrlLog}>
                            {this.props.result.name}
                        </a>
                    </h2>
                    <span>
                        { this.props.result.provider[0].name + " - " + cdate.getDate().toString() + " "  + monthNames[cdate.getMonth()] + " " + cdate.getFullYear().toString() }
                    </span>
                </div>
                <p>
                    {this.props.result.description}
                </p>
            </div>
        )
    }
}

export default (NewsSearchResult);
