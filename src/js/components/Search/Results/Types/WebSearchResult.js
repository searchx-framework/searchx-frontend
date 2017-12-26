

import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../constants/LoggerEventTypes';
import SearchStore from '../../../../stores/SearchStore';
import Rating from 'react-rating';
import BookmarkActions from '../../BookmarkActions';

class WebSearchResult extends React.Component {


    constructor(props) {
        super(props);
        this.state = {bookmark: props.result.bookmark};
        this.handleOnClick = this.handleOnClick.bind(this);
    }

 
    handleOnClick () {
        
        if (this.props.result.bookmark == false) {
            BookmarkActions.addBookmark(this.props.result.displayUrl, this.props.result.name);         
            this.setState({
                bookmark: true
            });
            SearchStore.addBookmark(this.props.result.position);
        } else if (this.props.result.bookmark == true) {
            BookmarkActions.removeBookmark(this.props.result.displayUrl);
            this.setState({
                bookmark: false
            });
            SearchStore.removeBookmark(this.props.result.position);
            
        }
    };


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

        var initialRate = this.props.result.bookmark ? 1 : 0;

        
        return  (
            
            <div className={cName}>
               
                <VisibilitySensor
                    onChange={viewUrlLog}
                    scrollCheck
                    delayedCall={true}
                    scrollThrottle={50}
                    intervalDelay={2000}
                />
                
                <Rating stop={1} className="rating"  empty="fa fa-star-o medium" full="fa fa-star medium" onClick={this.handleOnClick} initialRate={initialRate}/>
                <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary} >
                    <h2>
                        <a href={this.props.result.displayUrl} title={this.props.result.name} target="_blank" onClick={clickUrlLog} onContextMenu={contextUrlLog}>
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
