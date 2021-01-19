import request from 'superagent';
import EventEmitter from 'events'

import {register} from '../../../../utils/Dispatcher';
import ActionTypes from '../../../../actions/ActionTypes';
import AccountStore from '../../../../stores/AccountStore';

const CHANGE_EVENT = 'change_queryhistory';

////

let state = {
    queries: [],
    tutorial: false
};

let _get_query_history = () => {
    request
        .get(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/query`)
        .end((err, res) => {
            if (err || !res.body || res.body.error) {
                state.queries = [];
            } else {
                state.queries = res.body.results;
            }
            QueryHistoryStore.emitChange();
        });
};

////

const QueryHistoryStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getQueryHistory() {
        if (state.tutorial) {
            return [
                {userId: 1, query: "first query", created: new Date() - 20000},
                {userId: 2, query: "second query", created: new Date() - 10000},
                {userId: 3, query: "third query", created: new Date()},
            ];
        }

        return state.queries.slice().reverse();
    },

    setQueryHistoryTutorialData() {
        state.tutorial = true;
        this.emitChange();
    },
    removeQueryHistoryTutorialData() {
        state.tutorial = false;
        this.emitChange();
    },

    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.GET_QUERY_HISTORY:
                _get_query_history();
                break;
            default:
                break;
        }
        QueryHistoryStore.emitChange();
    })
});

export default QueryHistoryStore;
