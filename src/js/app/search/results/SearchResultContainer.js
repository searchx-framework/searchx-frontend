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
    }

    componentWillReceiveProps(nextProps) {
        if('metadata' in nextProps.result) {
            if (nextProps.result.metadata.bookmark !== null) {
                nextProps.result.metadata.bookmark.userColor = AccountStore.getMemberColor(nextProps.result.metadata.bookmark.userId);
            }
        }
    }

    ////

    urlClickHandler(url, doctext) {
        SearchActions.openUrl(url, doctext);
        SearchStore.modifyMetadata(url, {
            views: this.props.result.metadata.views + 1
        });
    }

    bookmarkClickHandler() {
        let action = "";
        let id = this.props.result.id ? this.props.result.id : this.props.result.url;
        if (this.props.result.metadata.bookmark !== null) {
            action = "remove";
            SessionActions.removeBookmark(id);
            if (!SearchStore.getDistributionOfLabour() && !SearchStore.getRelevanceFeedback()) {
                SearchStore.modifyMetadata(id, {
                    bookmark: null
                });
            }
        }
        else {
            action = "add";

            SessionActions.addBookmark(id, this.props.result.name);

            if (!SearchStore.getDistributionOfLabour() && !SearchStore.getRelevanceFeedback()) {
                SearchStore.modifyMetadata(id, {
                    bookmark: {
                        userId: AccountStore.getUserId(),
                        date: new Date()
                    }
                });
            }
        }

        log(LoggerEventTypes.BOOKMARK_ACTION, {
            url: id,
            action: action
        });

        if (SearchStore.getDistributionOfLabour() || SearchStore.getRelevanceFeedback()) {
            SearchActions.updateMetadata()
        }
    };

    ////

    render() {
        return <SearchResult
            searchState={this.props.searchState}
            serpId={this.props.serpId}
            result={this.props.result}
            urlClickHandler={this.urlClickHandler}
            bookmarkClickHandler={this.bookmarkClickHandler}
            provider={this.props.provider}
            showBookmarked={this.props.showBookmarked}
        />
    }
}