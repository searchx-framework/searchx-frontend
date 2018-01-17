import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../../utils/LoggerEventTypes';

////

export default class ImagesSearchResult extends React.Component {
    render(){
        let metaInfo = {
            url: this.props.result.contentUrl,
            query: this.props.query,
            page: this.props.page,
            vertical: 'images',
            serp_id: this.props.serp_id,
        };

        let clickUrlLog = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo);
        };

        let viewUrlLog = (isVisible) => {
            const metaInfoView = {metaInfo, isVisible: isVisible};
            log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfoView)
        };

        let contextUrlLog = (isVisible) => {
            log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo);
        };

        let hoverEnter = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo);
        };

        let hoverLeave = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo);
        };

        ////
        
        return (
            <div className="SearchResults-image">
                <VisibilitySensor onChange={viewUrlLog}
                        scrollCheck
                        delayedCall={true}
                        scrollThrottle={50}
                        intervalDelay={2000}
                />

                <a  href={this.props.result.contentUrl}
                    title={this.props.result.name}
                    target="_blank"
                    onClick={clickUrlLog}
                    onContextMenu={contextUrlLog}
                    onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                    <div className="image" style={{backgroundImage: `url(${this.props.result.thumbnailUrl})`}}/>
                </a>

                {this.props.bookmarkButton}
                {this.props.bookmarkInfo}
            </div>
        )
    }
}