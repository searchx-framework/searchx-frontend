import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import SearchStore from '../../../../stores/SearchStore';
import Rating from 'react-rating';
import BookmarkActions from '../../BookmarkActions';
import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../constants/LoggerEventTypes';


class ImagesSearchResult extends React.Component {

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

        var initialRate = this.props.result.bookmark ? 1 : 0;
        
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
                    <Rating stop={1} className="rating"  empty="fa fa-star-o medium" full="fa fa-star medium" onClick={this.handleOnClick} initialRate={initialRate}/>
            </div>
        )
    }
}

ImagesSearchResult.propTypes = {
};

export default ImagesSearchResult;