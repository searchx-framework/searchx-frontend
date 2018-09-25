import React from 'react';

import SearchActions from '../../../actions/SearchActions';
import SessionActions from '../../../actions/SessionActions';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import SearchHeader from "./components/SearchHeader";
import SearchStore from "../SearchStore";
import AccountStore from "../../../stores/AccountStore"

export default class SearchHeaderContainer extends React.Component {
    constructor() {
        super();
        const searchState = SearchStore.getSearchState();
        this.state = {
            searchState: searchState,
            query: searchState.query,
            lastQueryUsedForSuggestions: ""
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.queryChangeHandler = this.queryChangeHandler.bind(this);
        this.verticalChangeHandler = this.verticalChangeHandler.bind(this);
        this.showSuggestionsHandler = this.showSuggestionsHandler.bind(this);
        this.hideSuggestionsHandler = this.hideSuggestionsHandler.bind(this);
        this.clickSuggestionHandler = this.clickSuggestionHandler.bind(this);
    }

    componentWillMount() {SearchStore.addChangeListener(this.changeHandler);}
    componentWillUnmount() {SearchStore.removeChangeListener(this.changeHandler);}

    render() {
        return <SearchHeader
            query={this.state.query}
            vertical={this.state.searchState.vertical}
            provider={this.state.searchState.provider}
            searchHandler={this.searchHandler}
            queryChangeHandler={this.queryChangeHandler}
            verticalChangeHandler={this.verticalChangeHandler}
            timer={this.props.timer}
            showAccountInfo={this.props.showAccountInfo}
            hideSuggestionsHandler={this.hideSuggestionsHandler}
            showSuggestionsHandler={this.showSuggestionsHandler}
            clickSuggestionHandler={this.clickSuggestionHandler}
            showSuggestions={this.state.showSuggestions}
            // these props do not update to changes
            userId={AccountStore.getUserId()}
            groupId={AccountStore.getGroupId()}
        />
    }

    ////


    changeHandler() {
        const nextSearchState = SearchStore.getSearchState();
        if (nextSearchState.vertical !== this.state.searchState.vertical || nextSearchState.query !== this.state.searchState.query) {
            this.setState({
                searchState: nextSearchState,
                query: nextSearchState.query
            });
        }
    }

    searchHandler() {
        log(LoggerEventTypes.SEARCH_QUERY, {
            query: this.state.query,
            vertical: this.state.searchState.vertical
        });
        this.hideSuggestionsHandler();
        SearchActions.search(this.state.query, this.state.searchState.vertical, 1);
        SessionActions.getBookmarksAndExcludes();
    }

    queryChangeHandler(query) {
        this.setState({
            query: query
        });
        const lastQuery = this.state.lastQueryUsedForSuggestions;
        const lengthDifference = query.length - lastQuery.length;
        const lastQueryContainsQuery = lastQuery.indexOf(query) !== -1;
        if (lengthDifference > 2 || lengthDifference < -2 || (!lastQueryContainsQuery && lengthDifference < 0)) {
            this.setState({lastQueryUsedForSuggestions: query});
            SessionActions.getSuggestions(query);
        }
    }

    verticalChangeHandler(vertical) {
        vertical = vertical.toLowerCase();

        log(LoggerEventTypes.SEARCH_CHANGE_VERTICAL, {
            query: this.state.searchState.query,
            vertical: vertical,
            previous: this.state.searchState.vertical
        });

        SearchActions.changeVertical(vertical);
    }

    hideSuggestionsHandler() {
        this.setState({ showSuggestions: false })
    }

    showSuggestionsHandler() {
        this.setState({ showSuggestions: true });
        if (this.state.query) {
            SessionActions.getSuggestions(this.state.query);
        }
    }

    clickSuggestionHandler(query) {
        this.hideSuggestionsHandler();
        SearchActions.search(query, SearchStore.getSearchState().vertical, 1)
    }
}