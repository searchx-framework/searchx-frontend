import React from 'react';
import Bookmark from "./components/Bookmark";

import SessionActions from "../../../../actions/SessionActions";
import SearchStore from "../../SearchStore";
import BookmarkStore from "./BookmarkStore";
import AccountStore from "../../../../stores/AccountStore";
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

export default class BookmarkContainer extends React.Component {
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
                data.userColor = AccountStore.getMemberColor(data.userId);
                return data;
            })
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