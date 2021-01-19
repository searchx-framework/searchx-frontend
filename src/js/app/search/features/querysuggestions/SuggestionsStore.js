import request from 'superagent';
import EventEmitter from 'events'

import {register} from '../../../../utils/Dispatcher';
import ActionTypes from '../../../../actions/ActionTypes';
import AccountStore from "../../../../stores/AccountStore";
import {LoggerEventTypes} from "../../../../utils/LoggerEventTypes";
import {log} from "../../../../utils/Logger";

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
            case ActionTypes.CLEAR_SUGGESTIONS:
                _clear();
                break;
            default:
                break;
        }
    })
});

const _clear = function(){
    state.suggestions = [];
}



////
const _get = function(query) {
    request
        .get(`${process.env.REACT_APP_SERVER_URL}/v1/suggestions?query=${query}&userId=${AccountStore.getUserId()}&sessionId=${AccountStore.getSessionId()}`)
        .end((err, res) => {
            if (err || !res.body || res.body.error) {
                console.log('Failed to fetch suggestions');
                console.log(err);
            } else {
                state.suggestions = res.body;
                const metaInfo = {
                    suggestions: res.body
                };
                log(LoggerEventTypes.QUERYSUGGESTIONS_GET, metaInfo);
                SuggestionStore.emitChange();
            }
        });
};

////

export default SuggestionStore;
