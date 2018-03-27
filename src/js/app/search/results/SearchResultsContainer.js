import React from 'react';

import SearchActions from '../../../actions/SearchActions';
import SearchStore from "../SearchStore";

import SearchResults from "./components/SearchResults";
import DocumentViewer from "./components/viewer/Viewer";

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';

const getState = function() {
    return {
        searchState: SearchStore.getSearchState(),
        progress: SearchStore.getSearchProgress(),
        serpId : SearchStore.getSerpId(),
        results: SearchStore.getSearchResults(),
        matches: SearchStore.getMatches(),
        elapsedTime : ((SearchStore.getElapsedTime())/1000).toFixed(2).toString(),
        activeUrl: SearchStore.getActiveUrl(),
        provider: SearchStore.getProvider(),
        variant: SearchStore.getVariant()
    }
};

export default class SearchResultsContainer extends React.Component {
    constructor() {
        super();
        this.state = getState();

        this._onChange = this._onChange.bind(this);
        this.pageChangeHandler = this.pageChangeHandler.bind(this);
    }

    componentWillMount() {SearchStore.addChangeListener(this._onChange);}
    componentWillUnmount() {SearchStore.removeChangeListener(this._onChange);}
    _onChange() {this.setState(getState());}

    ////

    pageChangeHandler(page) {
        log(LoggerEventTypes.SEARCH_CHANGE_PAGE, {
            query: this.state.searchState.query,
            vertical: this.state.searchState.vertical,
            page: page,
            previous_page: this.state.activePage,
            serpId: this.state.serpId
        });

        SearchActions.changePage(page);
        this.setState({
            searchState: {
                query: this.state.searchState.query,
                vertical: this.state.searchState.vertical,
                page: page
            },
            results: SearchStore.getSearchResults()
        });
    }

    documentCloseHandler() {
        SearchActions.closeUrl();
    }

    ////

    render() {
        return <div>
            <SearchResults {...this.state} pageChangeHandler={this.pageChangeHandler} key="results"/>
            <DocumentViewer searchState={this.state.searchState} key="viewer"
                            serpId={this.state.serpId}
                            url={this.state.activeUrl}
                            documentCloseHandler={this.documentCloseHandler}
            />
        </div>
    }
};