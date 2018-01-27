import './ResultsPage.css';
import React from 'react';

import SearchResults from './Search/SearchResults';
import BookmarkResults from './Sidebar/BookmarkResults';

import SearchResultsPagination from './SearchResultsPagination';
import SearchResultsNotFound from './SearchResultsNotFound';

import SearchStore from '../../../stores/SearchStore'
import AccountStore from '../../../stores/AccountStore';
import SearchActions from '../../../actions/SearchActions';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import PreviousQueries from "./Sidebar/PreviousQueries";

const config = require('../../../config');
const Loader = require('react-loader');

////

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let getSearchState = () => {
    return {
        query: SearchStore.getQuery(),
        vertical: SearchStore.getVertical(),
        results: SearchStore.getResults(),
        serp_id : SearchStore.getSerpId(),
        matches: SearchStore.getMatches(),
        userId: AccountStore.getSessionId(),
        activePage: SearchStore.getPageNumber(),
        elapsedTime : ((SearchStore.getElapsedTime())/1000).toFixed(2).toString(),
        resultsNotFound : SearchStore.isResultsNotFound(),
        showPopup: false
    }
};

////

export default class ResultsPage extends React.Component {
    constructor() {
        super();
        this.state = getSearchState();
        this._onChange = this._onChange.bind(this);
    }

    componentWillMount() {
        SearchStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SearchStore.removeChangeListener(this._onChange);
    }

    ////

    _onChange() {
        this.setState(getSearchState);
    }

    handlePageChange(pageNumber) {
        log(LoggerEventTypes.SEARCH_CHANGE_PAGE, {
            query: this.state.query,
            page: pageNumber,
            previous_page: this.state.activePage,
            vertical: this.state.vertical,
            serp_id: this.state.serp_id
        });

        SearchActions.changePage(this.state.query, this.state.vertical, pageNumber);

        this.setState({
            activePage: pageNumber,
            results: SearchStore.getResults()
        });
    }

    ////

    render() {
        let prefix = "About ";
        if (this.state.matches < config.aboutPrefixAt) {
            prefix = "";
        }

        const timeIndicator = prefix + numberWithCommas(this.state.matches) + " results (" + this.state.elapsedTime + " seconds)";

        ////

        let mainPage = <SearchResultsNotFound/>;
        if (!SearchStore.isResultsNotFound()) {
            mainPage = (
                <div>
                    <div className="SearchResults">
                        {this.state.results.length > 0 ? <p className="TimeIndicator"> {timeIndicator} </p> : ""}

                        <SearchResults
                            results={this.state.results}
                            query={this.state.query}
                            vertical={this.state.vertical}
                            page={this.state.activePage}
                            serp_id={this.state.serp_id}
                        />

                        {SearchStore.isQuerySubmitted() &&
                            <Loader loaded={SearchStore.isRefreshing() || this.state.results.length > 0 || SearchStore.isFinished()}/>
                        }
                    </div>

                    <SearchResultsPagination
                        vertical={this.state.vertical}
                        length={this.state.matches}
                        activePage={this.state.activePage}
                        handlePageChange={this.handlePageChange.bind(this)}
                        finished={this.state.results.length > 0 || SearchStore.isFinished()}
                    />
                </div>
            );
        }

        ////

        return (
            <div className="row ResultsPage" id="intro-collab-color">
                <div className="MainPage col-md-8 col-sm-12 col-xs-12">
                    {mainPage}
                </div>

                <div className="Sidebar col-md-4 col-sm-12 col-xs-12">
                    <PreviousQueries/>
                    <BookmarkResults/>
                </div>

                <div className="w-100"/>
                <div className="col-xs-12 text-center" >
                    <hr/>
                    <p className="Footer"> About <a href="/about" target="_blank">SearchX</a>.</p>
                </div>
            </div>
        );
    }
}
