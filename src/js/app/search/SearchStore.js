import request from 'superagent';
import EventEmitter from 'events';

import {register} from '../../utils/Dispatcher';
import ActionTypes from '../../actions/ActionTypes';
import SessionActions from '../../actions/SessionActions';

import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';

import SyncStore from '../../stores/SyncStore';
import AccountStore from '../../stores/AccountStore';
import history from "../History";

const env = require('env');
const CHANGE_EVENT = 'change_search';

////

let _getURLParameter = function(name) {
    // http://stackoverflow.com/a/11582513/3300831
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
};

let state = {
    query: _getURLParameter('q') || '',
    vertical: _getURLParameter('v') || 'web',
    page: parseInt(_getURLParameter('p')) || 1,

    submittedQuery: false,
    finished: false,
    refresing: false,
    resultsNotFound: false,

    results: [],
    matches: 0,
    elapsedTime: 0,
    serpId: '',

    tutorial: false,
    activeUrl: ""
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

    setSearchTutorialData() {
        state.tutorial = true;
        this.emitChange();
    },
    removeSearchTutorialData() {
        state.tutorial = false;
        this.emitChange();
    },

    ////

    getQuery() {
        return state.query;
    },
    getVertical() {
        return state.vertical;
    },
    getPage() {
        return state.page || 1;
    },


    getMatches(){
        return state.matches || 0;
    },
    getElapsedTime(){
        return state.elapsedTime;
    },
    getSerpId() {
        return state.serpId;
    },

    getSearchResults() {
        if (state.tutorial) {
            return [
                {name: "You can view the first result here", displayUrl: "https://www.result1.com" , snippet: "This is the first result..."},
                {name: "You can view the second result here", displayUrl: "https://www.result2.com" , snippet: "This is the second result...", bookmark: true, bookmarkUserId: AccountStore.getUserId(), bookmarkTime: new Date()},
                {name: "You can view the third result here", displayUrl: "https://www.result3.com" , snippet: "This is the third result...", bookmark: true, bookmarkUserId: 'test', bookmarkTime: new Date() - 2000},
                {name: "You can view the fourth result here", displayUrl: "https://www.result4.com" , snippet: "This is the fourth result..."},
                {name: "You can view the fifth result here", displayUrl: "https://www.result5.com" , snippet: "This is the fifth result..."}
            ];
        }

        return state.results;
    },
    getSearchState() {
        return {
            query: this.getQuery(),
            vertical: this.getVertical(),
            page: this.getPage()
        };
    },
    getSearchProgress() {
        return {
            submittedQuery: state.submittedQuery,
            finished: state.finished,
            refreshing: state.refreshing,
            resultsNotFound: state.resultsNotFound
        }
    },
    getActiveUrl() {
        return state.activeUrl
    },

    ////

    modifyMetadata(url, newData) {
        state.results.forEach((item) => {
            if (item.url === url ) {
                item.metadata = Object.assign(item.metadata, newData);
            }
        });

        SearchStore.emitChange();
    },

    ////

    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.SEARCH:
                _search(action.payload.query, action.payload.page);
                _updateUrl(state.query, state.vertical, state.page);
                break;
            case ActionTypes.CHANGE_PAGE:
                _search(action.payload.query, action.payload.page);
                _updateUrl(state.query, state.vertical, state.page);
                break;
            case ActionTypes.CHANGE_VERTICAL:
                _changeVertical(action.payload.vertical);
                break;
            case ActionTypes.CHANGE_QUERY:
                _changeQuery(action.payload.query);
                break;
            case ActionTypes.REFRESH_SEARCH:
                _refresh(action.payload.query, action.payload.vertical, action.payload.page);
                break;
            case ActionTypes.OPEN_URL:
                state.activeUrl = action.payload.url;
                SyncStore.emitViewState(action.payload.url);
                break;
            case ActionTypes.CLOSE_URL:
                state.activeUrl = "";
                SyncStore.emitViewState(null);
                break;
        }

        SearchStore.emitChange();
    })
});

////

const _search = (query, page) => {
    const startTime = new Date().getTime();

    state.submittedQuery = true;
    state.finished = false;
    state.resultsNotFound = false;
    if (!state.refreshing) {
        state.results = [];
    }

    page = page || state.page || 1;
    state.page = page;
    state.query = query || state.query;

    SyncStore.emitSearchState(SearchStore.getSearchState());
    SearchStore.emitChange();

    ////

    request
        .get(env.serverUrl + '/v1/search/'+state.vertical
            + '/?query='+ state.query
            + '&page='+ page
            + '&userId='+ AccountStore.getUserId()
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
                state.page = page;
                state.serpId = res.body.id;

            } else {
                state.results = [];
                state.page = page;
            }

            if (state.results.length === 0) {
                state.resultsNotFound = true;
            }

            state.elapsedTime = (new Date().getTime()) - startTime;
            state.refreshing = false;
            state.finished = true;

            log(LoggerEventTypes.SEARCHRESULT_ELAPSEDTIME, {
                query: state.query,
                page: page,
                vertical: state.vertical,
                serpId: state.serpId,
                elapsedTime: state.elapsedTime
            });

            SearchStore.emitChange();
            SessionActions.getQueryHistory();
        });
};

const _changeVertical = (vertical) => {
    state.vertical = vertical;
    state.results = [];
    state.page = 1;
};

const _changeQuery = (query) => {
    state.query = query;
};

////

const _updateUrl = function(query, vertical, page) {
    const url = window.location.href;
    const route = url.split("/").pop().split("?")[0];
    const params = 'q='+ query +'&v='+ vertical.toLowerCase() +'&p='+ page;

    history.push({
        pathname: route,
        search: params
    });
};

const _refresh = (query, vertical, page) => {
    if (query === state.query && vertical === state.vertical && page === state.page) {
        state.refreshing = true;
        _search();
    }
};

////

if (_getURLParameter('q')) {
    _search();
}

export default SearchStore;
