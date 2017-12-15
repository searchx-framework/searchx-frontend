import './SearchResults.css';
import React from 'react';

import WebSearchResults from './Types/WebSearchResults';
import NewsSearchResults from './Types/NewsSearchResults';
import ImagesSearchResults from './Types/ImagesSearchResults';
import VideosSearchResults from './Types/VideosSearchResults';
import BookmarkResults from './BookmarkResults'

import SearchResultsPagination from './SearchResultsPagination';
import SearchResultsNotFound from './SearchResultsNotFound';

import SearchStore from '../../../stores/SearchStore'
import AccountStore from '../../../stores/AccountStore';
import BookmarkStore from '../../../stores/BookmarkStore';
import SearchActions from '../SearchActions';
import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';

import {updateUrl} from '../Header/SearchBar';

const configuration = require('../../../config');
let Loader = require('react-loader');


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
        userId: AccountStore.getId(),
        activePage: SearchStore.getPageNumber(),
        elapsedTime : ((SearchStore.getElapsedTime())/1000).toFixed(2).toString(),
        resultsNotFound : SearchStore.getResultsNotFound(),
        showPopup: false
    }
};

export default class SearchResults extends React.Component {
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

    componentWillUpdate(nextProps, nextState){
       
    }

    _onChange() {
        this.setState(getSearchState);
    }
    

    handlePageChange(pageNumber) {
        const metaInfo = {
            query: this.state.query,
            page: pageNumber,
            previous_page: this.state.activePage,
            vertical: this.state.vertical,
            serp_id: this.state.serp_id
        };
        log(LoggerEventTypes.SEARCHRESULTS_NEXT_PAGE, metaInfo);

        updateUrl(this.state.query, this.state.vertical, pageNumber);
        SearchActions.nextPage(this.state.query, this.state.vertical, pageNumber);

        this.setState({activePage: pageNumber,
            results: SearchStore.getResults()
        });
           
    }

    showPopup(url) {
        "called";
        this.setState({showPopup:true});
    }
      

    render() {
        //only if more than X search results are returned do we enter approximate numbering
        let prefix = "About ";
        if (this.state.matches < configuration.aboutPrefixAt) {
            prefix = "";
        }

        const timeIndicator = prefix + numberWithCommas(this.state.matches) + " results (" + this.state.elapsedTime + " seconds)";
        return (
            <div >
                {SearchStore.getResultsNotFound() ? <SearchResultsNotFound/> :
                <div>
                    <div className="row SearchResults">
                        <div className="col-xs-12" >
                            {this.state.results.length > 0 ? <p className = "TimeIndicator"> {timeIndicator} </p> : ""}

                            {this.state.vertical === 'web' ? <WebSearchResults  results={this.state.results}
                                query={this.state.query} page={this.state.activePage} serp_id = {this.state.serp_id}/> : ''}
                            {this.state.vertical === 'news' ? <NewsSearchResults results={this.state.results}
                                query={this.state.query} page={this.state.activePage} serp_id={this.state.serp_id}/> : ''}
                            {this.state.vertical === 'images' ? <ImagesSearchResults results={this.state.results}
                                query={this.state.query} page={this.state.activePage} serp_id = {this.state.serp_id}/> : ''}
                            {this.state.vertical === 'videos' ? <VideosSearchResults results={this.state.results}
                                query={this.state.query} page={this.state.activePage} serp_id = {this.state.serp_id}/> : ''}
                            {this.state.vertical === 'forums' ? <ForumSearchResults results={this.state.results}
                                query={this.state.query} page={this.state.activePage} serp_id = {this.state.serp_id}/> : ''}
                        </div>
                        {  SearchStore.getSubmittedQuery() ? <Loader loaded={this.state.results.length > 0 || SearchStore.isFinished()  }/> : "" }
                    </div>

                    <SearchResultsPagination vertical={this.state.vertical}
                        length={this.state.matches} activePage={this.state.activePage}
                        handlePageChange={this.handlePageChange.bind(this)} finished={this.state.results.length > 0 || SearchStore.isFinished()  }
                    />

                    {SearchStore.getSubmittedQuery() && SearchStore.isFinished() &&
                        <div className="col-xs-12 text-center" >
                            <p className="Footer"> About <a href="/about" target="_blank">SearchX</a>.</p>
                        </div>
                    }

                </div>
                }
            </div>
        )
    }
}
