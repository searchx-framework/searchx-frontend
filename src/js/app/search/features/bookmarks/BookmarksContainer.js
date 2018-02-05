import React from 'react';
import Bookmarks from "./components/Bookmarks";

import SessionActions from "../../../../actions/SessionActions";
import SearchStore from "../../SearchStore";
import BookmarkStore from "./BookmarksStore";
import AccountStore from "../../../../stores/AccountStore";

function removeHandler(url) {
    SessionActions.removeBookmark(url);
    SearchStore.searchAndRemoveBookmark(url);
}

function starHandler(url) {
    SessionActions.starBookmark(url);
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
                data.userColor = AccountStore.getMemberColor(data.userId);
                return data;
            })
        });
    }

    render() {
        return <Bookmarks
            bookmarks={this.state.bookmarks}
            removeHandler={removeHandler}
            starHandler={starHandler}
        />
    }
}