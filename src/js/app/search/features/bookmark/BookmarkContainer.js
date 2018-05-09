import React from 'react';
import Bookmark from "./components/Bookmark";

import SessionActions from "../../../../actions/SessionActions";
import SearchStore from "../../SearchStore";
import SessionStore from "../../../../stores/SessionStore";
import BookmarkStore from "./BookmarkStore";
import SearchActions from "../../../../actions/SearchActions";
import AccountStore from "../../../../stores/AccountStore";

function removeHandler(url) {
    SessionActions.removeBookmark(url);
    SearchStore.modifyMetadata(url, {
        bookmark: null
    });
}

function starHandler(url) {
    SessionActions.starBookmark(url);
}

function clickHandler(url) {
    if (isNaN(url)){
        SearchActions.openUrl(url);
    } {
        SearchActions.getDocumentById(url);
    }
}

export default class BookmarkContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarks: []
        };

        SessionActions.getBookmarksAndExcludes();
        this._onChange = this._onChange.bind(this);
    }

    componentWillMount() {BookmarkStore.addChangeListener(this._onChange);}
    componentWillUnmount() {BookmarkStore.removeChangeListener(this._onChange);}
    _onChange() {
        let bookmarks = BookmarkStore.getBookmarks();
        if (!this.props.collaborative) {
            bookmarks = bookmarks.filter((data) => {
                return data.userId === AccountStore.getUserId();
            })
        }
        bookmarks = bookmarks.map((data) => {
                data.userColor = SessionStore.getMemberColor(data.userId);
                return data;
            });
        this.setState({
            bookmarks: bookmarks
        });
    }

    render() {
        
        return <Bookmark
            bookmarks={this.state.bookmarks}
            removeHandler={removeHandler}
            starHandler={starHandler}
            clickHandler={clickHandler}
        />
    }
}