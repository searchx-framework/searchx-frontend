

import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import SearchStore from '../../../stores/SearchStore';
import BookmarkActions from '../BookmarkActions';
import Rating from 'react-rating';

class BookmarkResult extends React.Component {


    constructor(props) {
        super(props);
        this.state = {bookmark: props.bookmark};
        this.handleOnClick = this.handleOnClick.bind(this);
    }

 
    handleOnClick () {
        
       BookmarkActions.removeBookmark(this.props.result.url);
       SearchStore.searchAndRemoveBookmark(this.props.result.url);
    };


    render(){
        
        let metaInfo = {
            url: this.props.result.url
        };

        let clickUrlLog = (e) => {
            log(LoggerEventTypes.BOOKMARK_CLICK_URL, metaInfo)
        };

        let contextUrlLog = (e) => {
            log(LoggerEventTypes.BOOKMARK_CONTEXT_URL,metaInfo)
        };

        let hoverEnterSummary = (e) => {
            log(LoggerEventTypes.BOOKMARK_HOVERENTER, metaInfo)
        };

        let hoverLeaveSummary = (e) => {
            log(LoggerEventTypes.BOOKMARK_HOVERLEAVE,metaInfo)
        };

        ////

        let cName = 'row BookmarkResults-result';
        
        if (this.props.index % 2 == 0) {
            cName += "-1"
        } else {
            cName += "-2"
        }

        var initialRate = this.state.bookmark ? 1 : 0;


        return  (
            <div className={cName}>
  
                
                <div onMouseEnter={hoverEnterSummary} onMouseLeave={hoverLeaveSummary} >
                <Rating stop={1} className="trash"  empty="fa fa-trash-o" full="fa fa-trash" onClick={this.handleOnClick} initialRate={initialRate}/>
                    <h2>
                        <a href={this.props.result.url} title={this.props.result.title} target="_blank" onClick={clickUrlLog} onContextMenu={contextUrlLog}>
                            {this.props.result.title}
                        </a>
                    </h2>
                    
                    <span>
                        {this.props.result.url}
                    </span>
                    
                </div>
                
            </div>
        )

    }
}

export default (BookmarkResult);
