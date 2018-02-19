import React from 'react';

import SessionActions from '../../../actions/SessionActions';
import SearchActions from "../../../actions/SearchActions";
import SearchStore from "../SearchStore";
import SearchResult from "./components/SearchResult";

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';

export default class SearchResultContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmark: props.result.bookmark,
            bookmarkUserId: props.result.bookmarkUserId,
            bookmarkTime: props.result.bookmarkTime
        };

        this.bookmarkClickHandler = this.bookmarkClickHandler.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            bookmark: nextProps.result.bookmark,
            bookmarkUserId: nextProps.result.bookmarkUserId,
            bookmarkTime: nextProps.result.bookmarkTime
        });
    }

    ////

    urlClickHandler(url) {
        SearchActions.openUrl(url);
    }

    bookmarkClickHandler() {
        let action = "";

        if (this.state.bookmark) {
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