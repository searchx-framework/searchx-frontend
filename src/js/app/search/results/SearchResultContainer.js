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
        this.urlClickHandler = this.urlClickHandler.bind(this);
        this.bookmarkClickHandler = this.bookmarkClickHandler.bind(this);
        this.excludeClickHandler = this.excludeClickHandler.bind(this);
    }
    ////

    urlClickHandler(url, doctext) {
        SearchActions.openUrl(url, doctext);
        SearchStore.modifyMetadata(url, {
            views: this.props.result.metadata.views + 1
        });

        let visitedUrls = JSON.parse(localStorage.getItem('visited-urls'));
        if (visitedUrls) {
            visitedUrls[url] = true;
        } else {
            visitedUrls = {};
            visitedUrls[url] = true;
        }

        localStorage.setItem('visited-urls', JSON.stringify(visitedUrls));
    }

    bookmarkClickHandler() {
        let action = "";
        const id = this.props.result.url ? this.props.result.url : this.props.result.id;
        const index = this.props.index;
        if (this.props.result.metadata.bookmark) {
            action = "remove";
            SessionActions.removeBookmark(id);
            SearchStore.modifyMetadata(id, {
                bookmark: null
            });
        } else {
            action = "add";

            SessionActions.addBookmark(id, this.props.result.name);
            if (this.props.result.metadata.exclude) {
                SessionActions.removeExclude(id);
            }

            SearchStore.modifyMetadata(id, {
                bookmark: {
                    userId: AccountStore.getUserId(),
                    date: new Date()
                },
                exclude: null
            });
            if (this.props.autoHide) {
                this.props.hideCollapsedResultsHandler([id]);
            }
        }

        log(LoggerEventTypes.BOOKMARK_ACTION, {
            url: id,
            action: action,
            index: index,
            session: localStorage.getItem("session-num") || 0,
        });
    };

    excludeClickHandler() {
        let action = "";
        const id = this.props.result.url ? this.props.result.url : this.props.result.id;
        const index = this.props.index;
        if (this.props.result.metadata.exclude) {
            action = "remove";
            SessionActions.removeExclude(id);
            SearchStore.modifyMetadata(id, {
                exclude: null
            });
        }
        else {
            action = "add";

            SessionActions.addExclude(id, this.props.result.name);
            if (this.props.result.metadata.bookmark) {
                SessionActions.removeBookmark(id);
            }

            SearchStore.modifyMetadata(id, {
                exclude: {
                    userId: AccountStore.getUserId(),
                    date: new Date()
                },
                bookmark: null
            });
            if (this.props.autoHide) {
                this.props.hideCollapsedResultsHandler([id]);
            }
        }

        log(LoggerEventTypes.EXCLUDE_ACTION, {
            url: id,
            action: action,
            index: index,
            session: localStorage.getItem("session-num") || 0,
        });
    }

    ////

    render() {
        return <SearchResult
            searchState={this.props.searchState}
            serpId={this.props.serpId}
            index={this.props.index}
            result={this.props.result}
            urlClickHandler={this.urlClickHandler}
            bookmarkClickHandler={this.bookmarkClickHandler}
            provider={this.props.provider}
            collapsed={this.props.collapsed}
            excludeClickHandler={this.excludeClickHandler}
            hideCollapsedResultsHandler={this.props.hideCollapsedResultsHandler}
            isCollapsible={this.props.isCollapsible}
            visited={this.props.visited}
        />
    }
}