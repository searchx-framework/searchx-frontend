import request from 'superagent';
import EventEmitter from 'events';
import config from "../../config"

import {register} from '../../utils/Dispatcher';
import ActionTypes from '../../actions/ActionTypes';
import SessionActions from '../../actions/SessionActions';

import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';
import Helpers from '../../utils/Helpers';

import SyncStore from '../../stores/SyncStore';
import AccountStore from '../../stores/AccountStore';
import history from "../History";

const env = require('env');
const CHANGE_EVENT = 'change_search';

////

const provider = Helpers.getURLParameter('provider') || config.defaultProvider;
const variant = Helpers.getURLParameter('variant') || 'SS1';

let state = {
    query: Helpers.getURLParameter('q') || '',
    variant: variant,
    vertical: Helpers.getURLParameter('v') || config.providerVerticals[provider].keys().next().value,
    relevanceFeedback: variant === 'SS2' ? 'individual' : variant === 'SS3' ? 'shared' : 'false',
    distributionOfLabour: variant === 'SS0' ? 'false' : variant === 'SS1-Hard' ? 'unbookmarkedOnly' : 'unbookmarkedSoft',
    page: parseInt(Helpers.getURLParameter('p')) || 1,
    provider: provider,

    submittedQuery: false,
    finished: false,
    resultsNotFound: false,

    results: [],
    matches: 0,
    elapsedTime: 0,
    serpId: '',

    tutorial: false,
    activeUrl: "",
    activeDoctext: "",
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

    getActiveUrl() {
        return state.activeUrl
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
    getProvider() {
        return state.provider;
    },
    getVariant() {
        return state.variant;
    },
    getDistributionOfLabour() {
        return state.distributionOfLabour;
    },
    getActiveDoctext() {
        return state.activeDoctext;
    },

    getSearchResults() {
        if (state.tutorial) {
            return [
                {name: "You can view the first result here", displayUrl: "https://www.result1.com" , snippet: "This is the first result..."},
                {name: "You can view the second result here", displayUrl: "https://www.result2.com" , snippet: "This is the second result...", metadata: {bookmark: {userId: AccountStore.getUserId(), date: new Date()}, views: 10, rating: -5, annotations: 10}},
                {name: "You can view the third result here", displayUrl: "https://www.result3.com" , snippet: "This is the third result...", metadata: {bookmark: {userId: 'test', date: new Date() - 2000}}},
                {name: "You can view the fourth result here", displayUrl: "https://www.result4.com" , snippet: "This is the fourth result..."},
                {name: "You can view the fifth result here", displayUrl: "https://www.result5.com" , snippet: "This is the fifth result..."}
            ];
        }

        return state.results;
    },
    getSearchState() {
        return {
            query: state.query,
            vertical: state.vertical,
            page: state.page || 1,
            provider: state.provider
        };
    },
    getSearchProgress() {
        return {
            submittedQuery: state.submittedQuery,
            finished: state.finished,
            resultsNotFound: state.resultsNotFound
        }
    },

    ////

    modifyMetadata(id, newData) {
        state.results.forEach((item) => {
            if (item.docid) {
                if (item.docid === id) {
                    item.metadata = Object.assign(item.metadata, newData);
                }
            } else if (item.url === id ) {
                item.metadata = Object.assign(item.metadata, newData);
            }
        });

        SearchStore.emitChange();
    },

    ////

    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.SEARCH:
                _search(action.payload.query, action.payload.vertical, action.payload.page);
                break;
            case ActionTypes.CHANGE_VERTICAL:
                _search(state.query, action.payload.vertical, 1);
                break;
            case ActionTypes.CHANGE_PAGE:
                _search(state.query, state.vertical, action.payload.page);
                break;
            case ActionTypes.UPDATE_METADATA:
                _updateMetadata(state.query, state.vertical, action.payload.page);
                break;
            case ActionTypes.OPEN_URL:
                state.activeUrl = action.payload.url;
                state.activeDoctext = action.payload.doctext;
                SyncStore.emitViewState(action.payload.url);
                break;
            case ActionTypes.CLOSE_URL:
                state.activeUrl = "";
                state.activeDoctext = "";
                SyncStore.emitViewState(null);
                break;
        }

        SearchStore.emitChange();
    })
});

////

const _search = (query, vertical, page) => {
    const startTime = new Date().getTime();

    if (!(query === state.query && vertical === state.vertical && page === state.page)) {
        state.results = [];
    }

    state.query = query || state.query;
    state.vertical = vertical || state.vertical;
    state.page = page || state.page || 1;
    state.submittedQuery = true;
    state.finished = false;
    state.resultsNotFound = false;

    _updateUrl(state.query, state.vertical, state.page, state.provider);
    SyncStore.emitSearchState(SearchStore.getSearchState());
    SearchStore.emitChange();

    ////

    if (query === '') {
        return;
    }

    request
        .get(env.serverUrl + '/v1/search/'+state.vertical
            + '/?query='+ state.query
            + '&page='+ state.page
            + '&userId='+ AccountStore.getUserId()
            + '&sessionId='+ AccountStore.getSessionId()
            + '&providerName=' + state.provider
            + '&relevanceFeedback=' + state.relevanceFeedback
            + '&distributionOfLabour=' + state.distributionOfLabour
        )
        .end((err, res) => {
            if (!res.body.error) {
                const results = res.body.results;
                for (let i = 0; i < results.length; i++) {
                    results[i].position = i;
                }

                state.results = results;
                state.matches = res.body.matches;
                state.serpId = res.body.id;
            } else {
                state.results = [];
            }

            if (state.results.length === 0) {
                state.resultsNotFound = true;
            }

            state.elapsedTime = (new Date().getTime()) - startTime;
            state.finished = true;

            log(LoggerEventTypes.SEARCHRESULT_ELAPSEDTIME, {
                query: state.query,
                page: state.page,
                provider: state.provider,
                vertical: state.vertical,
                serpId: state.serpId,
                elapsedTime: state.elapsedTime
            });

            SearchStore.emitChange();
            SessionActions.getQueryHistory();
        });
};

const _updateMetadata = function(query, vertical, page) {
    if (query === state.query && vertical === state.vertical && page === state.page) {
        _search(query, vertical, page);
    }
};

const _updateUrl = function(query, vertical, page, provider) {
    const url = window.location.href;
    const route = url.split("/").pop().split("?")[0];
    const params = 'q='+ query +'&v='+ vertical.toLowerCase() +'&p='+ page + '&provider=' + state.provider + '&variant=' + state.variant;

    history.push({
        pathname: route,
        search: params
    });
};

////

if (Helpers.getURLParameter('q')) {
    _search();
}

export default SearchStore;
