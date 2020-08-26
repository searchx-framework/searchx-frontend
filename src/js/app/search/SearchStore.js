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
import BookmarkStore from "./features/bookmark/BookmarkStore";
import AnnotationStore from "./features/annotation/AnnotationStore";
import RatingStore from "./features/rating/RatingStore";
import SearchActions from '../../actions/SearchActions';

const CHANGE_EVENT = 'change_search';

////


const provider = Helpers.getURLParameter('provider') || config.defaultProvider;


let state;

const _setVariant = function () {
    let variant;
    if (config.fallbackToS0ForGroupSize1 && AccountStore.getTaskData().size === 1) {
        variant = 'S0';
    } else if (config.variantQueryParameter) {
        variant = Helpers.getURLParameter('variant') || config.defaultVariant;
    } else {
        variant = config.defaultVariant;
    }
    state.variant = variant;
    state.relevanceFeedback = variant === 'S2' ? 'individual' : variant === 'S3' ? 'shared' : false;
    state.distributionOfLabour = variant === 'S0' ? false : variant === 'S1-Hard' ? 'unbookmarkedOnly' : 'unbookmarkedSoft';
};

/*
 * Reset all SearchStore state except variant
 */
const _setState = function () {
    state = {
        query: Helpers.getURLParameter('q') || '',
        vertical: Helpers.getURLParameter('v') || config.providerVerticals[provider].keys().next().value,
        page: parseInt(Helpers.getURLParameter('p')) || 1,
        provider: provider,

        finished: false,
        resultsNotFound: false,

        results: [],
        matches: 0,
        elapsedTime: 0,
        serpId: '',
        filters: {},
        tutorial: false,
        activeUrl: "",
        activeDoctext: "",
    };
    _setVariant();
};

_setState();

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
    updateMetadata() {
        _update_metadata()
    },

    ////

    getActiveUrl() {
        return state.activeUrl
    },
    getMatches() {
        return state.matches || 0;
    },
    getElapsedTime() {
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
    getRelevanceFeedback() {
        return state.relevanceFeedback;
    },
    getActiveDoctext() {
        return state.activeDoctext;
    },
    getTutorial() {
        return state.tutorial;
    },

    getFacets() {
        if (state.facets) {
            return state.facets;
        }
    },

    getFilters() {
        return state.filters;
    },
    
    setFilters(filters) {
        state.filters = filters;
    },


    clearFilters() {
        state.filters = {};
    },

    getSearchResults() {
        if (state.tutorial) {
            return [
                {
                    name: "You can view the first result here",
                    id: "1",
                    snippet: "This is the first result...",
                    metadata: {}
                },
                {
                    name: "You can view the second result here",
                    id: "2",
                    snippet: "This is the second result...",
                    metadata: {
                        bookmark: {userId: AccountStore.getUserId(), date: new Date()},
                        views: 10,
                        rating: {total: -5, rating: 0},
                        annotations: [1]
                    }
                },
                {
                    name: "You can view the third result here",
                    id: "3",
                    snippet: "This is the third result...",
                    metadata: {bookmark: {userId: 'test', date: new Date() - 2000}}
                },
                {
                    name: "You can view the fourth result here",
                    id: "4",
                    snippet: "This is the fourth result...",
                    metadata: {}
                },
                {
                    name: "You can view the fifth result here",
                    id: "5",
                    snippet: "This is the fifth result...",
                    metadata: {}
                }
            ];
        }

        return state.results;
    },
    getSearchResultsMap() {
        return state.results.reduce(function (map, result) {
            if (result.url) {
                map[result.url] = result;
            } else {
                map[result.id] = result;
            }
            return map;
        }, {});
    },
    getSearchState() {
        return {
            query: state.query,
            vertical: state.vertical,
            page: state.page || 1,
            provider: state.provider,
            facets: state.facets,
            filters: state.filters
        };
    },
    getSearchProgress() {
        return {
            finished: state.finished,
            resultsNotFound: state.resultsNotFound
        }
    },

    ////

    modifyMetadata(id, newData) {
        state.results.forEach((result) => {
            if (result.id) {
                if (result.id === id) {
                    result.metadata = Object.assign(result.metadata, newData);
                }
            } else if (result.url === id) {
                result.metadata = Object.assign(result.metadata, newData);
            }
        });

        SearchStore.emitChange();
    },

    ////

    dispatcherIndex: register(action => {
        switch (action.type) {
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
                _update_metadata();
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
            case ActionTypes.GET_DOCUMENT_BY_ID:
                _getById(action.payload.id);
                break;
            case ActionTypes.RESET:
                _setState();
                break;
            case ActionTypes.CHANGE_VARIANT:
                _setVariant()
                break;
            default:
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
    if (query && (state.query !== query)) {
        state.filters = {}
    }

    state.query = query || state.query;
    state.vertical = vertical || state.vertical;
    state.page = page || state.page || 1;
    state.finished = false;
    state.resultsNotFound = false;
    _updateUrl(state.query, state.vertical, state.page, state.provider, state.variant);
    SyncStore.emitSearchState(SearchStore.getSearchState());

    ////

    if (query === '') {
        return;
    }

    request
        .post(process.env.REACT_APP_SERVER_URL + '/v1/search/' + state.vertical
            + '/?query=' + state.query
            + '&page=' + state.page
            + '&providerName=' + state.provider
            + '&relevanceFeedback=' + state.relevanceFeedback
            + '&distributionOfLabour=' + state.distributionOfLabour
        )
        .send({
            filters : state.filters ,
            userId : AccountStore.getUserId(),
            sessionId : AccountStore.getSessionId()
        })
        .end((err, res) => {
            if (err || !res.body || res.body.error) {
                state.results = [];
            } else {
                const results = res.body.results;
                for (let i = 0; i < results.length; i++) {
                    results[i].position = i;
                }
                state.results = results;
                state.matches = res.body.matches;
                state.serpId = res.body.id;
                if ('facets' in res.body){
                    state.facets = res.body.facets;
                }
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
                elapsedTime: state.elapsedTime,
                session: localStorage.getItem("session-num")
            });
            SearchStore.emitChange();
            SearchActions.getSearchFacets(state.query, state.vertical, state.page, state.provider);
            SessionActions.getQueryHistory();
        });
};

const _getById = function (id) {
    request
        .get(process.env.REACT_APP_SERVER_URL + '/v1/search/' + state.vertical
            + '/getById/' + id
            + '?providerName=' + state.provider
        )
        .end((err, res) => {
            if (!res.body.error) {
                const result = res.body.result;
                if (result.url) {
                    state.activeUrl = result.activeUrl;
                } else {
                    state.activeUrl = result.id;
                }

                const viewer = config.providerViewers[provider];
                state.activeDoctext = viewer(result);
            }

            SyncStore.emitViewState(id);
            SearchStore.emitChange();
        });
};

const _updateUrl = function (query, vertical, page, provider, variant) {
    const url = window.location.href;
    const route = url.split("/").pop().split("?")[0];
    let params = 'q=' + query + '&v=' + vertical + '&p=' + page + '&provider=' + provider;
    if (config.variantQueryParameter) {
        params += '&variant=' + variant;
    }

    // todo: change this back to push to enable back button
    history.replace({
        pathname: route,
        search: params
    });
};

/*
 * Update result metadata by refreshing bookmarks and excludes from the BookmarkStore
 */
const _update_metadata = function () {
    const bookmarks = BookmarkStore.getBookmarks();
    const excludes = BookmarkStore.getExcludes();
    const bookmarkMap = {};
    const excludeMap = {};
    bookmarks.forEach(bookmark => {
        bookmarkMap[bookmark.url] = bookmark;
    });
    excludes.forEach(exclude => {
        excludeMap[exclude.url] = exclude;
    });
    const annotationsMap = AnnotationStore.getAnnotations();
    const ratingsMap = RatingStore.getRatings();

    state.results = state.results.map(result => {
        const newresult = result;
        const resultId = result.url ? result.url : result.id;
        newresult.metadata.bookmark = bookmarkMap[resultId];
        newresult.metadata.exclude = excludeMap[resultId];

        if (annotationsMap.hasOwnProperty(resultId)) {
            newresult.metadata.annotations = annotationsMap[resultId];
        }
        if (ratingsMap.hasOwnProperty(resultId)) {
            newresult.metadata.rating = ratingsMap[resultId];
        }
        return newresult;
    });


    SearchStore.emitChange();
};

////

if (Helpers.getURLParameter('q')) {
    _search();
}

export default SearchStore;
