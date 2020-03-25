import request from 'superagent';
import EventEmitter from 'events'

import {register} from '../../../../utils/Dispatcher';
import ActionTypes from '../../../../actions/ActionTypes';

import AccountStore from '../../../../stores/AccountStore';
import SyncStore from '../../../../stores/SyncStore';
import SearchStore from "../../SearchStore";

const CHANGE_EVENT = 'change_rating';

let state = {
    ratings: {}
};

const RatingStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getRatings() {
        return state.ratings
    },
    getUrlRating(url) {
        if (state.ratings.hasOwnProperty(url)) {
            return state.ratings[url];
        } else {
            const results = SearchStore.getSearchResultsMap();
            if (results.hasOwnProperty(url)) {
                return results[url].metadata.rating;
            }
        }
    },
    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.GET_RATING:
                _get_rating(action.payload.url);
                break;
            case ActionTypes.SUBMIT_RATING:
                if (action.payload.rating !== state.ratings[action.payload.url].rating) {
                    _submit_rating(action.payload.url, action.payload.rating);
                }
                break;
            default:
                break;
        }
        RatingStore.emitChange();
    }),
    // Todo: remove this hack by refactoring async fetching to happen in action dispatchers
    _get_rating(url) {
        _get_rating(url);
    }
});

////

let _get_rating = function(url) {
    request
        .get(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/rating/?url=${encodeURIComponent(url)}&userId=${AccountStore.getUserId()}`)
        .end((err, res) => {
            if (err || !res.body || res.body.error) {
                state.ratings[url].rating = 0;
                state.ratings[url].total = 0;
            } else {
                state.ratings[url] = {};
                state.ratings[url].rating = res.body.results.rating;
                state.ratings[url].total = res.body.results.total;
            }
            RatingStore.emitChange();
            SearchStore.updateMetadata();
        });
};

let _submit_rating = function(url, rating) {
    const userId = AccountStore.getUserId();
    request
        .post(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/rating`)
        .send({
            url: url,
            userId: userId,
            rating: rating
        })
        .end(() => {
            _broadcast_change();
        });

    state.ratings[url].total = state.ratings[url].total - state.ratings[url].rating + rating;
    state.ratings[url].rating = rating;
    RatingStore.emitChange();
    SearchStore.updateMetadata();
};

let _broadcast_change = function() {
    SyncStore.emitPageMetadataUpdate(SearchStore.getActiveUrl());
};

////

export default RatingStore;
