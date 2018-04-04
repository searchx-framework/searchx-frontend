import React from 'react';

import SearchActions from '../../../actions/SearchActions';
import SessionActions from '../../../actions/SessionActions';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import SearchHeader from "./components/SearchHeader";
import SearchStore from "../SearchStore";

export default class SearchHeaderContainer extends React.Component {
    constructor() {
        super();
        this.state = SearchStore.getSearchState();
        this.state.storedQuery = this.state.query;

        this.changeHandler = this.changeHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.queryChangeHandler = this.queryChangeHandler.bind(this);
        this.verticalChangeHandler = this.verticalChangeHandler.bind(this);
    }

    componentWillMount() {SearchStore.addChangeListener(this.changeHandler);}
    componentWillUnmount() {SearchStore.removeChangeListener(this.changeHandler);}

    render() {
        return <SearchHeader
            query={this.state.query}
            vertical={this.state.vertical}
            provider={this.state.provider}
            searchHandler={this.searchHandler}
            queryChangeHandler={this.queryChangeHandler}
            verticalChangeHandler={this.verticalChangeHandler}
        />
    }

    ////

    changeHandler() {
        const nextState = SearchStore.getSearchState();
        if (nextState.query !== this.state.storedQuery) {
            this.state.storedQuery = nextState.query;
            this.setState(nextState);
        }
    }

    searchHandler() {
        log(LoggerEventTypes.SEARCH_QUERY, {
            query: this.state.query,
            vertical: this.state.vertical
        });

        SearchActions.search(this.state.query, this.state.vertical, 1);
        SessionActions.getBookmarks();
    }

    queryChangeHandler(query) {
        this.setState({
            query: query
        });
    }

    verticalChangeHandler(vertical) {
        vertical = vertical.toLowerCase();

        log(LoggerEventTypes.SEARCH_CHANGE_VERTICAL, {
            query: this.state.query,
            vertical: vertical,
            previous: this.state.vertical
        });

        SearchActions.changeVertical(vertical);
    }
}