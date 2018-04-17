import request from 'superagent';
import EventEmitter from 'events'

import {register} from '../../../../utils/Dispatcher';
import ActionTypes from '../../../../actions/ActionTypes';

import AccountStore from '../../../../stores/AccountStore';
import SyncStore from '../../../../stores/SyncStore';
import SearchStore from "../../SearchStore";

const CHANGE_EVENT = 'change_rating';

let state = {
    rating: 0,
    total: 0,
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
    getState() {
        return state;
    },

    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.GET_RATING:
                if (SearchStore.getActiveUrl() === action.payload.url) {
                    _get_rating(action.payload.url)
                }
                break;
            case ActionTypes.SUBMIT_RATING:
                if (action.payload.rating !== state.rating) {
                    _submit_rating(action.payload.url, action.payload.rating);
                }
                break;
        }
        RatingStore.emitChange();
    })
});

////

let _get_rating = function(url) {
    request
        .get(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/rating/?url=${encodeURIComponent(url)}&userId=${AccountStore.getUserId()}`)
        .end((err, res) => {
            if (err || !res.body || res.body.error) {
                state.rating = 0;
                state.total = 0;
            } else {
                state.rating = res.body.results.rating;
                state.total = res.body.results.total;
            }
            RatingStore.emitChange();
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

    state.total = state.total - state.rating + rating;
    state.rating = rating;
    RatingStore.emitChange();
};

let _broadcast_change = function() {
    SyncStore.emitPageMetadataUpdate(SearchStore.getActiveUrl());
};

////

export default RatingStore;
