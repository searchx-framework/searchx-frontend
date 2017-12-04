import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../logger/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import SearchStore from '../../../stores/SearchStore';

class WebSearchResult extends React.Component {

    render(){
        
        let metaInfo = {
            url: this.props.result.displayUrl,
            query: this.props.query,
            page: this.props.page,
            vertical: 'web',
            serp_id: this.props.serp_id,
        };

        let clickUrlLog = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo)
        };

        let viewUrlLog = (isVisible) => {
            metaInfo.isVisible = isVisible;
            log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfo)
        };

        let contextUrlLog = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL,metaInfo)
        };

        let hoverEnterSummary = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo)
        };

        let hoverLeaveSummary = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE,metaInfo)
        };

        ////

        let cName = 'row WebSearchResults-result';

        let handleUpRating = () => {
            if (this.props.result.downPressed) {
                 SearchStore.setRating(this.props.serp_id, this.props.result.position, 2, "up");
            } else if (this.props.result.upPressed) {
                 SearchStore.setRating(this.props.serp_id, this.props.result.position, -1, "neutral");
            } else {
                 SearchStore.setRating(this.props.serp_id, this.props.result.position, 1, "up" );
            }
           
        };

        let handleDownRating = () => {
            if (this.props.result.upPressed) {
                 SearchStore.setRating(this.props.serp_id, this.props.result.position, -2, "down");
            } else if (this.props.result.downPressed) {
                 SearchStore.setRating(this.props.serp_id, this.props.result.position, 1,"neutral");
            } else {
                 SearchStore.setRating(this.props.serp_id, this.props.result.position, -1,"down");
            }
        };
        
        return  (
            <div className={cName}>
                <VisibilitySensor
                    onChange={viewUrlLog}
                    scrollCheck
                    delayedCall={true}
                    scrollThrottle={50}
                    intervalDelay={2000}
                />
                  
                <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary} >
                    <h2>
                        <a href={this.props.result.url} title={this.props.result.name} target="_blank" onClick={clickUrlLog} onContextMenu={contextUrlLog}>
                            {this.props.result.name}
                        </a>
                    </h2>

                    <span>
                        {this.props.result.displayUrl}
                    </span>

                    <p>
                        {this.props.result.snippet}
                    </p>
                </div>
            </div>
        )

    }
}

export default (WebSearchResult);
