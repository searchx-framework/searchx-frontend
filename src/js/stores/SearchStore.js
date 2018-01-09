import {register} from '../utils/Dispatcher';
import EventEmitter from 'events';
import request from 'superagent';

import {log} from '../utils/Logger';
import {LoggerEventTypes} from '../constants/LoggerEventTypes';
import AccountStore from '../stores/AccountStore';
import AppConstants from '../constants/AppConstants';

import TaskStore from "./TaskStore";
import SyncStore from "./SyncStore";
import AppActions from "../AppActions";

const env = require('env');
const CHANGE_EVENT = 'change_search';
const SUBMIT_EVENT = 'submit_search';

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

if (!TaskStore.isIntroDone()) {
    state.results = [{name: "You can view the search first result here", displayUrl: "https://www.result1.com" , snippet: "This is the first result result..."},
    {name: "You can view the search second result here", displayUrl: "https://www.result2.com" , snippet: "This is the second result result..."},
    {name: "You can view a search third result here", displayUrl: "https://www.result3.com" , snippet: "This is the third result result..."},
    {name: "You can view a search fourth result here", displayUrl: "https://www.result4.com" , snippet: "This is the fourth result result..."},
    {name: "You can view a search fifth result here", displayUrl: "https://www.result5.com" , snippet: "This is the fifth result result..."}]
}

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

    emitSubmit() {
        this.emit(SUBMIT_EVENT)
    },
    addSubmitListener(callback) {
        this.on(SUBMIT_EVENT, callback)
    },
    removeSubmitListener(callback) {
        this.removeListener(SUBMIT_EVENT, callback);
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
        switch(action.actionType) {
            case AppConstants.SEARCH:
                _search(action.query, action.pageNumber);
                break;
            case AppConstants.NEXT_PAGE:
                _search(action.query, action.pageNumber);
                break;
            case AppConstants.CHANGE_VERTICAL:
                _changeVertical(action.vertical);
                break;
            case AppConstants.CHANGE_QUERY:
                _changeQuery(action.query);
                break;
            case AppConstants.REFRESH_SEARCH:
                _refresh(action.query, action.vertical, action.pageNumber);
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

            const metaInfo = {
                query: state.query,
                page: pageNumber,
                vertical: state.vertical,
                serp_id: state.serp_id,
                elapsedTime: state.elapsedTime
            };
            log(LoggerEventTypes.SEARCHRESULT_ELAPSEDTIME, metaInfo);

            state.refreshing = false;
            state.finished = true;
            SearchStore.emitChange();
            SearchStore.emitSubmit();
            AppActions.getQueryHistory();
        });
};

const _changeVertical = (vertical) => {
    state.vertical = vertical;
    state.results = [];
    state.pageNumber = 1;

    SearchStore.emitSubmit();
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

export default SearchStore;
