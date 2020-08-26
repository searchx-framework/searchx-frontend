import request from 'superagent';
import EventEmitter from 'events'

import {register} from '../../../../../utils/Dispatcher';
import ActionTypes from '../../../../../actions/ActionTypes'

const CHANGE_EVENT = 'change_filters';

////

let state = {
    facets: [],
    tutorial: false
};

const _search_facets = (query, vertical, page, provider) => {

    if (query === '') {
        return;
    }


    request
        .get(process.env.REACT_APP_SERVER_URL + '/v1/facets/' + vertical
            + '/?query=' + query
            + '&page=' + page
            + '&providerName=' + provider
        )
        .end((err, res) => {
            if (err || !res.body || res.body.error) {
                state.facets = [];
            } else {
                if ('facets' in res.body){
                    state.facets = res.body.facets;
                }
            }
            FiltersStore.emitChange();
        });
};


////

const FiltersStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getFacets() {
        if (state.tutorial) {
            return [
                {userId: 1, query: "first query", created: new Date() - 20000},
                {userId: 2, query: "second query", created: new Date() - 10000},
                {userId: 3, query: "third query", created: new Date()},
            ];
        }

        return state.facets;
    },

    setFiltersTutorialData() {
        state.tutorial = true;
        this.emitChange();
    },
    removeFiltersTutorialData() {
        state.tutorial = false;
        this.emitChange();
    },

    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.SEARCH_FACETS:
                    _search_facets(action.payload.query, action.payload.vertical, action.payload.page, action.payload.provider);
                    break;
            default:
                break;
        }
        FiltersStore.emitChange();
    })
});

export default FiltersStore;
