import request from 'superagent';
import EventEmitter from 'events'

import {register} from '../../../../utils/Dispatcher';
import ActionTypes from '../../../../actions/ActionTypes';
import AccountStore from "../../../../stores/AccountStore";

const CHANGE_EVENT = 'change_suggestions';

const state = {
    suggestions: [],
};

const SuggestionStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getSuggestions() {
        return state.suggestions;
    },
    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.GET_SUGGESTIONS:
                _get(action.payload.query);
                break;
        }
        console.log('change emitted');
        SuggestionStore.emitChange();
    })
});

////
const _get = function(query) {
    const type = 'collaborative';
    request
        .get(`${process.env.REACT_APP_SERVER_URL}/v1/sensemaking/scent/?query=${query}&type=${type}&userId=${AccountStore.getUserId()}&sessionId=${AccountStore.getSessionId()}`)
        .end((err, res) => {
            if (err || !res.body || res.body.error) {
                console.log('Failed to fetch suggestions');
                console.log(err);
            } else {
                state.suggestions = res.body;
            }
        });
};

////

export default SuggestionStore;
