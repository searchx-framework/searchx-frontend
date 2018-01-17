import React from 'react';
import Rating from 'react-rating';

import AccountStore from "../../../../stores/AccountStore";
import SearchStore from '../../../../stores/SearchStore';
import SessionActions from '../../../../actions/SessionActions';

import WebSearchResult from './Types/WebSearchResult';
import NewsSearchResult from './Types/NewsSearchResult';
import ImagesSearchResult from './Types/ImagesSearchResult';
import VideosSearchResult from './Types/VideosSearchResult';

////

export default class SearchResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bookmark: props.result.bookmark,
            bookmarkUserId: props.result.bookmarkUserId,
            bookmarkTime: props.result.bookmarkTime
        };

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    ////

    handleOnClick () {
        if (this.state.bookmark) {
            SessionActions.removeBookmark(this.props.result.url);
            SearchStore.removeBookmark(this.props.result.position);
            this.setState({
                bookmark: false
            });
        } else {
            SessionActions.addBookmark(this.props.result.url, this.props.result.name, AccountStore.getId());
            SearchStore.addBookmark(this.props.result.position);
            this.setState({
                bookmark: true,
                bookmarkUserId: AccountStore.getId(),
                bookmarkTime: new Date()
            });
        }
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            bookmark: nextProps.result.bookmark,
            bookmarkUserId: nextProps.result.bookmarkUserId,
            bookmarkTime: nextProps.result.bookmarkTime
        });
    }

    ////

    render(){
        let bookmarkButton = <Rating
            className="rating"
            empty="fa fa-bookmark-o"
            full="fa fa-bookmark"
            onClick={this.handleOnClick}
            stop={1}
            initialRate={this.state.bookmark ? 1 : 0}
        />;

        let bookmarkInfo = "";
        if (this.state.bookmark) {
            const date = new Date(this.state.bookmarkTime);
            const now = new Date().toLocaleDateString();

            let formattedTime = date.toLocaleDateString();
            if (formattedTime === now) {
                formattedTime = date.toLocaleTimeString()
            }

            bookmarkInfo =
                <span style={{color: AccountStore.getMemberColor(this.state.bookmarkUserId), marginBottom: 10, marginTop: -5}}>
                    <i className="fa fa-clock-o"/>
                    {" Bookmarked at " + formattedTime}
                </span>;
        }

        ////

        return (
            <div>
                {this.props.vertical === 'web' && <WebSearchResult {...this.props} bookmarkButton={bookmarkButton} bookmarkInfo={bookmarkInfo}/>}
                {this.props.vertical === 'news' && <NewsSearchResult {...this.props} bookmarkButton={bookmarkButton} bookmarkInfo={bookmarkInfo}/>}
                {this.props.vertical === 'images' && <ImagesSearchResult {...this.props} bookmarkButton={bookmarkButton} bookmarkInfo={bookmarkInfo}/>}
                {this.props.vertical === 'videos' && <VideosSearchResult {...this.props} bookmarkButton={bookmarkButton} bookmarkInfo={bookmarkInfo}/>}
            </div>
        );
    }
}
