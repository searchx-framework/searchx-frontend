import React from 'react';

import SearchActions from '../../../actions/SearchActions';
import SearchStore from "../SearchStore";

import SearchResults from "./components/SearchResults";
import DocumentViewer from "./components/viewer/Viewer";

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import Helpers from "../../../utils/Helpers";

const getState = function () {
    return {
        searchState: SearchStore.getSearchState(),
        progress: SearchStore.getSearchProgress(),
        serpId: SearchStore.getSerpId(),
        results: SearchStore.getSearchResults(),
        matches: SearchStore.getMatches(),
        elapsedTime: ((SearchStore.getElapsedTime()) / 1000).toFixed(2).toString(),
        activeUrl: SearchStore.getActiveUrl(),
        provider: SearchStore.getProvider(),
        distributionOfLabour: SearchStore.getDistributionOfLabour(),
        activeDoctext: SearchStore.getActiveDoctext(),
        tutorial: SearchStore.getTutorial()
    }
};

export default class SearchResultsContainer extends React.Component {
    constructor() {
        super();
        this.state = getState();
        this.state.collapsed = {};
        this.state.autoHide = false;

        this._onChange = this._onChange.bind(this);
        this.pageChangeHandler = this.pageChangeHandler.bind(this);
        this.showAllCollapsedResults = this.showAllCollapsedResults.bind(this);
        this.hideAllCollapsedResults = this.hideAllCollapsedResults.bind(this);
        this.showCollapsedResults = this.showCollapsedResults.bind(this);
        this.hideCollapsedResults = this.hideCollapsedResults.bind(this);
        this.isCollapsible = this.isCollapsible.bind(this);
    }

    componentWillMount() {
        SearchStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SearchStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        const newState = getState();
        const resultIdMap = {};
        this.state.results.forEach(result => resultIdMap[Helpers.getId(result)] = true);
        const newResults = newState.results.filter(result => !(resultIdMap[Helpers.getId(result)]));
        const newCollapsibleResults = newResults.filter(this.isCollapsible);
        const newCollapsibleResultIds = newCollapsibleResults.map(result => result.id);
        if (newCollapsibleResultIds) {
            this.hideCollapsedResults(newCollapsibleResultIds);
        }
        if (newState.searchState.page !== this.state.searchState.page || newState.searchState.query !== this.state.searchState.query) {
            this.showAllCollapsedResults();
            this.hideAllCollapsedResults();
        }
        this.setState(newState);
    }

    getMetaInfo() {
        return {
            bookmarkedIds: this.state.results.filter(result => result.metadata.bookmark).map(result => Helpers.getId(result)),
            excludedIds: this.state.results.filter(result => result.metadata.exclude).map(result => Helpers.getId(result)),
            query: this.state.searchState.query,
            page: this.state.searchState.page,
            serpId: this.state.serpId,
        }
    }

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

    showCollapsedResults(ids) {
        const collapsed = this.state.collapsed;

        ids.forEach((id) => {
            collapsed[id] = false;
        });

        this.setState({
            collapsed: collapsed
        });
    }

    hideCollapsedResults(ids) {
        const collapsed = this.state.collapsed;

        ids.forEach((id) => {
            collapsed[id] = true;
        });

        this.setState({
            collapsed: collapsed
        });
    }

    showAllCollapsedResults() {
        log(LoggerEventTypes.SEARCH_SHOW_ALL_COLLAPSED, this.getMetaInfo());
        this.setState({
            collapsed: {}
        });
    }

    hideAllCollapsedResults() {
        log(LoggerEventTypes.SEARCH_HIDE_ALL_COLLAPSED, this.getMetaInfo());
        const collapsed = {};
        this.state.results.forEach((result) => {
            if (this.isCollapsible(result)) {
                collapsed[Helpers.getId(result)] = true;
            }
        });
        this.setState({
            collapsed: collapsed,
        });
    }

    documentCloseHandler() {
        SearchActions.closeUrl();
    }

    ////

    isCollapsible(result) {
        return this.state.distributionOfLabour
            && !this.state.tutorial
            && (result.metadata.bookmark || result.metadata.exclude);
    }

    render() {

        
        return <div>
            <SearchResults {...this.state} pageChangeHandler={this.pageChangeHandler} key="results"
                           isCollapsible={this.isCollapsible} showCollapsedResults={this.showCollapsedResults}
                           hideCollapsedResults={this.hideCollapsedResults}
                           showAllCollapsedResults={this.showAllCollapsedResults}
                           hideAllCollapsedResults={this.hideAllCollapsedResults}/>
            <DocumentViewer searchState={this.state.searchState} key="viewer"
                            serpId={this.state.serpId}
                            url={this.state.activeUrl}
                            documentCloseHandler={this.documentCloseHandler}
                            doctext={this.state.activeDoctext} 
            />
        </div>
    }
};