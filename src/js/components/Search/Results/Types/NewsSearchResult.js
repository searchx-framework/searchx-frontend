import './NewsSearchResults.css';
import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../constants/LoggerEventTypes';
import Rating from 'react-rating';
import BookmarkActions from '../../BookmarkActions';
import SearchStore from '../../../../stores/SearchStore';


class NewsSearchResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {bookmark: props.result.bookmark};
        this.handleOnClick = this.handleOnClick.bind(this);
    }


    handleOnClick () {
        
        if (this.props.result.bookmark == false) {
            BookmarkActions.addBookmark(this.props.result.url, this.props.result.name); 
                  
            this.setState({
                bookmark: true
            });
            
            SearchStore.addBookmark(this.props.result.position);
           
        } else if (this.props.result.bookmark == true) {
            BookmarkActions.removeBookmark(this.props.result.url);
            this.setState({
                bookmark: false
            });
            SearchStore.removeBookmark(this.props.result.position);
            
        }
    };



    render(){

        let metaInfo = {
                url: this.props.result.url,
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
        var initialRate = this.props.result.bookmark ? 1 : 0;
        
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
                    
                        <Rating stop={1} className="rating-news"  empty="fa fa-star-o medium" full="fa fa-star medium" onClick={this.handleOnClick} initialRate={initialRate}/>
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
