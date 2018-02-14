import React from 'react';
import Bookmarks from "./components/Bookmarks";

import SessionActions from "../../../../actions/SessionActions";
import SearchStore from "../../SearchStore";
import BookmarkStore from "./BookmarksStore";
import SessionStore from "../../../../stores/SessionStore";
import SearchActions from "../../../../actions/SearchActions";

function removeHandler(url) {
    SessionActions.removeBookmark(url);
    SearchStore.searchAndRemoveBookmark(url);
}

function starHandler(url) {
    SessionActions.starBookmark(url);
}

function clickHandler(url) {
    SearchActions.openUrl(url);
}

export default class BookmarksContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            bookmarks: []
        };

        SessionActions.getBookmarks();
        this._onChange = this._onChange.bind(this);
    }

    componentWillMount() {BookmarkStore.addChangeListener(this._onChange);}
    componentWillUnmount() {BookmarkStore.removeChangeListener(this._onChange);}
    _onChange() {
        this.setState({
            bookmarks: BookmarkStore.getBookmarks().map((data) => {
                data.userColor = SessionStore.getMemberColor(data.userId);
                return data;
            })
        });
    }

    render() {
        return <Bookmarks
            bookmarks={this.state.bookmarks}
            removeHandler={removeHandler}
            starHandler={starHandler}
            clickHandler={clickHandler}
        />
    }
}