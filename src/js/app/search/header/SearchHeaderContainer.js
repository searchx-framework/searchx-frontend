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
            query: searchState.query
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.queryChangeHandler = this.queryChangeHandler.bind(this);
        this.verticalChangeHandler = this.verticalChangeHandler.bind(this);
        this.showSuggestionsHandler = this.showSuggestionsHandler.bind(this);
        this.hideSuggestionsHandler = this.hideSuggestionsHandler.bind(this);
        this.clickSuggestionHandler = this.clickSuggestionHandler.bind(this);
    }

    componentDidMount() {SearchStore.addChangeListener(this.changeHandler);}
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
            statusbar={this.props.statusbar}
            taskbar={this.props.taskbar}
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
        if (this.state.query.replace(/[^a-zA-Z]/g, "") === "") {
            return;
        }
        log(LoggerEventTypes.SEARCH_QUERY, {
            query: this.state.query,
            vertical: this.state.searchState.vertical,
            session: localStorage.getItem("session-num") || 0,
        });
        this.hideSuggestionsHandler();
        SearchActions.search(this.state.query, this.state.searchState.vertical, 1);
        SessionActions.getBookmarksAndExcludes();
        SessionActions.clearSuggestions()
    }

    queryChangeHandler(query) {
        this.setState({
            query: query
        });
        if (query.length >= 3) {
            SessionActions.getSuggestions(query);
        } else {
            SessionActions.getSuggestions("");
        }
    }

    verticalChangeHandler(vertical) {

        log(LoggerEventTypes.SEARCH_CHANGE_VERTICAL, {
            query: this.state.searchState.query,
            vertical: vertical,
            previous: this.state.searchState.vertical,
            session: localStorage.getItem("session-num") || 0,
        });

        SearchActions.changeVertical(vertical);
    }

    hideSuggestionsHandler() {
        this.setState({ showSuggestions: false })
    }

    showSuggestionsHandler() {
        if (this.state.query) {
            SessionActions.getSuggestions(this.state.query);
        }
        this.setState({ showSuggestions: true });
    }

    clickSuggestionHandler(query) {
        this.hideSuggestionsHandler();
        SearchActions.search(query, SearchStore.getSearchState().vertical, 1)
    }
}