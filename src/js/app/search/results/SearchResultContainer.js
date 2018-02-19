import React from 'react';

import AccountStore from "../../../stores/AccountStore";

import SessionActions from '../../../actions/SessionActions';
import SearchActions from "../../../actions/SearchActions";
import SearchStore from "../SearchStore";
import SearchResult from "./components/SearchResult";

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';

export default class SearchResultContainer extends React.Component {
    constructor(props) {
        super(props);
        this.bookmarkClickHandler = this.bookmarkClickHandler.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.result.metadata.bookmark !== null) {
            nextProps.result.metadata.bookmark.userColor = AccountStore.getMemberColor(nextProps.result.metadata.bookmark.userId);
        }
    }

    ////

    urlClickHandler(url) {
        SearchActions.openUrl(url);
    }

    bookmarkClickHandler() {
        let action = "";

        if (this.props.result.metadata.bookmark !== null) {
            action = "remove";
            SearchStore.removeBookmark(this.props.result.position);
            SessionActions.removeBookmark(this.props.result.url);
        }
        else {
            action = "add";
            SearchStore.addBookmark(this.props.result.position);
            SessionActions.addBookmark(this.props.result.url, this.props.result.name);
        }

        log(LoggerEventTypes.BOOKMARK_ACTION, {
            url: this.props.result.url,
            action: action
        });
    };

    ////

    render() {
        return <SearchResult
            searchState={this.props.searchState}
            serpId={this.props.serpId}
            result={this.props.result}
            urlClickHandler={this.urlClickHandler}
            bookmarkClickHandler={this.bookmarkClickHandler}
        />
    }
}