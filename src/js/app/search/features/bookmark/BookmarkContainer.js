import React from 'react';
import Bookmark from "./components/Bookmark";

import SessionActions from "../../../../actions/SessionActions";
import SearchStore from "../../SearchStore";
import SessionStore from "../../../../stores/SessionStore";
import BookmarkStore from "./BookmarkStore";
import SearchActions from "../../../../actions/SearchActions";

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
    SearchActions.openUrl(url);
}

export default class BookmarkContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            bookmarks: [],
            popup: false
        };

        SessionActions.getBookmarks();
        this.changeHandler = this.changeHandler.bind(this);
        this.popupHandler = this.popupHandler.bind(this);
    }

    componentWillMount() {BookmarkStore.addChangeListener(this.changeHandler);}
    componentWillUnmount() {BookmarkStore.removeChangeListener(this.changeHandler);}

    render() {
        return <Bookmark
            bookmarks={this.state.bookmarks}
            popup={this.state.popup}
            removeHandler={removeHandler}
            starHandler={starHandler}
            clickHandler={clickHandler}
            popupHandler={this.popupHandler}
        />
    }

    ////

    changeHandler() {
        this.setState({
            bookmarks: BookmarkStore.getBookmarks().map((data) => {
                data.userColor = SessionStore.getMemberColor(data.userId);
                return data;
            })
        });
    }

    popupHandler() {
        this.setState({
            popup: !this.state.popup
        });
    }
}