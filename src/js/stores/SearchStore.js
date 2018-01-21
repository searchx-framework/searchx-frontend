import request from 'superagent';
import EventEmitter from 'events';

import {register} from '../AppDispatcher';
import AppConstants from '../AppConstants';
import SessionActions from '../actions/SessionActions';

import {log} from '../utils/Logger';
import {LoggerEventTypes} from '../utils/LoggerEventTypes';

import SyncStore from './SyncStore';
import AccountStore from './AccountStore';
import IntroStore from "./IntroStore";

const env = require('env');
const CHANGE_EVENT = 'change_search';

////

let _getURLParameter = (name) => {
    // http://stackoverflow.com/a/11582513/3300831
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
};

let state = {
    query: _getURLParameter('q') || '',
    vertical: _getURLParameter('v') || 'web',
    pageNumber: parseInt(_getURLParameter('p')) || 1,

    results: [],
    forum_results: [],
    matches: 0,
    elapsedTime: 0,

    submittedQuery: false,
    finish: false,
    refresing: false,
    resultsNotFound: false,

    serp_id: ''
};

////

const SearchStore = Object.assign(EventEmitter.prototype, {

    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    ////

    getQuery() {
        return state.query;
    },
    getSerpId() {
        return state.serp_id;
    },
    getVertical() {
        return state.vertical;
    },
    getPageNumber() {
        return state.pageNumber || 1;
    },
    getSearchState() {
        return {
            query: this.getQuery(),
            vertical: this.getVertical(),
            pageNumber: this.getPageNumber()
        };
    },

    getResults() {
        return state.results;
    },
    getElapsedTime(){
        return state.elapsedTime;
    },
    getMatches(){
        return state.matches || 0;
    },

    isQuerySubmitted(){
        return state.submittedQuery;
    },
    isFinished(){
        return state.finished;
    },
    isRefreshing(){
        return state.refreshing;
    },
    isResultsNotFound(){
        return state.resultsNotFound;
    },

    ////

    addBookmark(position) {
        state.results[position].bookmark = true;
        state.results[position].bookmarkUserId = AccountStore.getId();
        state.results[position].bookmarkTime = new Date();
        SearchStore.emitChange();
    },

    removeBookmark(position){
        state.results[position].bookmark = false;
        SearchStore.emitChange();
    },

    searchAndRemoveBookmark(url){
        state.results = state.results.filter(function(item) {
            if (item["url"] === url ) {
                item.bookmark = false;
            }
            return true;
        });
    },

    ////

    dispatcherIndex: register(action => {
        switch(action.type) {
            case AppConstants.SEARCH:
                _search(action.payload.query, action.payload.pageNumber);
                break;
            case AppConstants.NEXT_PAGE:
                _search(action.payload.query, action.payload.pageNumber);
                break;
            case AppConstants.CHANGE_VERTICAL:
                _changeVertical(action.payload.vertical);
                break;
            case AppConstants.CHANGE_QUERY:
                _changeQuery(action.payload.query);
                break;
            case AppConstants.REFRESH_SEARCH:
                _refresh(action.payload.query, action.payload.vertical, action.payload.pageNumber);
                break;
        }

        SearchStore.emitChange();
    })
});

////

const _search = (query, pageNumber) => {
    const elapsedTime = new Date().getTime();

    state.submittedQuery = true;
    state.finished = false;
    state.resultsNotFound = false;

    pageNumber = pageNumber || state.pageNumber || 1;
    state.pageNumber = pageNumber;
    state.query = query || state.query;

    if (!state.refreshing) {
        state.results = [];
    }

    SyncStore.emitSearchState(SearchStore.getSearchState());
    SearchStore.emitChange();

    request
        .get(env.serverUrl + '/v1/search/'+state.vertical
            + '/?query='+ state.query
            + '&page='+ pageNumber
            + '&userId='+ AccountStore.getId()
            + '&sessionId='+ AccountStore.getSessionId()
        )
        .end((err, res) => {
            if (!res.body.error) {

                const results = res.body.results;
                for (let i = 0; i < results.length; i++) {
                    results[i].position = i;
                }

                state.results = results;
                state.matches = res.body.matches;
                state.pageNumber = pageNumber;
                state.serp_id = res.body.id;


            } else {
                state.results = [];
                state.pageNumber = pageNumber;
            }

            if (state.results.length === 0) {
                state.resultsNotFound = true;
            }

            state.elapsedTime = (new Date().getTime()) - elapsedTime;

            ////

            log(LoggerEventTypes.SEARCHRESULT_ELAPSEDTIME, {
                query: state.query,
                page: pageNumber,
                vertical: state.vertical,
                serp_id: state.serp_id,
                elapsedTime: state.elapsedTime
            });

            state.refreshing = false;
            state.finished = true;
            SearchStore.emitChange();
            SessionActions.getQueryHistory();
        });
};

const _changeVertical = (vertical) => {
    state.vertical = vertical;
    state.results = [];
    state.pageNumber = 1;
};

const _changeQuery = (query) => {
    state.query = query;
};

const _refresh = (query, vertical, pageNumber) => {
    if (query === state.query && vertical === state.vertical && pageNumber === state.pageNumber) {
        state.refreshing = true;
        _search();
    }
};

////

if (_getURLParameter('q')) {
    _search();
}

if (!IntroStore.isIntroSearchDone()) {
    state.results = [
        {name: "You can view the first result here", displayUrl: "https://www.result1.com" , snippet: "This is the first result..."},
        {name: "You can view the second result here", displayUrl: "https://www.result2.com" , snippet: "This is the second result...", bookmark: true, bookmarkUserId: AccountStore.getId(), bookmarkTime: new Date()},
        {name: "You can view the third result here", displayUrl: "https://www.result3.com" , snippet: "This is the third result...", bookmark: true, bookmarkUserId: 'test', bookmarkTime: new Date() - 2000},
        {name: "You can view the fourth result here", displayUrl: "https://www.result4.com" , snippet: "This is the fourth result..."},
        {name: "You can view the fifth result here", displayUrl: "https://www.result5.com" , snippet: "This is the fifth result..."}
    ]
}

export default SearchStore;
