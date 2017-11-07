import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../logger/Logger';
import {LoggerEventTypes} from '../../constants/LoggerEventTypes';


class ImagesSearchResult extends React.Component {
    render(){
        
        var metaInfo = {
                url: this.props.result.displayUrl,
                query: this.props.query,
                page: this.props.page,
                vertical: 'images',
                serp_id: this.props.serp_id,
        }

        let clickUrlLog = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, metaInfo)
        };

        let viewUrlLog = (isVisible) => {
            var metaInfoView = {metaInfo, isVisible: isVisible};
            log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, metaInfoView)
        };

        let contextUrlLog = (isVisible) => {
            log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, metaInfo)
        };

        let hoverEnter = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, metaInfo)
        };

        let hoverLeave = (e) => {
            log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, metaInfo)
        };
       
        let cName = 'ImagesSearchResults-result';
        
        return (
            <div className={cName}>
                    <VisibilitySensor onChange={viewUrlLog} 
                            scrollCheck
                            delayedCall={true}
                            scrollThrottle={50}
                            intervalDelay={2000}
                    />
                    <a href={this.props.result.contentUrl} title={this.props.result.name} target="_blank"
                            onClick={clickUrlLog}
                            onContextMenu={contextUrlLog}
                            onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}
                        >
                        <img src={this.props.result.thumbnailUrl} alt= {this.props.result.name}/>
                    </a>
                    
                
                
            </div>
        )
    }
}

ImagesSearchResult.propTypes = {
};

export default ImagesSearchResult;