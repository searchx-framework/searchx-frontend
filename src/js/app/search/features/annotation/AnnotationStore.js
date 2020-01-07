import request from 'superagent';
import EventEmitter from 'events'

import {register} from '../../../../utils/Dispatcher';
import ActionTypes from '../../../../actions/ActionTypes';

import AccountStore from '../../../../stores/AccountStore';
import SyncStore from '../../../../stores/SyncStore';
import SearchStore from "../../SearchStore";

const CHANGE_EVENT = 'change_annotation';

let state = {
    annotations: {}
};

const AnnotationStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getAnnotations() {
        return state.annotations
    },
    getUrlAnnotations(url) {
        if (state.annotations.hasOwnProperty(url)) {
            return state.annotations[url];
        } else {
            const results = SearchStore.getSearchResultsMap();
            if (results.hasOwnProperty(url)) {
                return results[url].metadata.annotations;
            }
        }
    },
    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.GET_ANNOTATIONS:
                _get_annotations(action.payload.url);
                break;
            case ActionTypes.ADD_ANNOTATION:
                _add_annotation(action.payload.url, action.payload.annotation);
                break;
            case ActionTypes.REMOVE_ANNOTATION:
                _remove_annotation(action.payload.url, action.payload.position);
                break;
            default:
                break;
        }
        AnnotationStore.emitChange();
    }),
    // Todo: remove this hack by refactoring async fetching to happen in action dispatchers
    _get_annotations(url) {
        _get_annotations(url);
    }
});

////

let _get_annotations = function(url) {
    request
        .get(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/annotation/?url=${encodeURIComponent(url)}`)
        .end((err, res) => {
            if (err || !res.body || res.body.error) {
            } else {
                state.annotations[url] = res.body.results;
            }
            AnnotationStore.emitChange();
            SearchStore.updateMetadata();
        });
};

let _add_annotation = function(url, annotation) {
    const userId = AccountStore.getUserId();
    request
        .post(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/annotation`)
        .send({
            url: url,
            userId: userId,
            annotation: annotation
        })
        .end(() => {
            _broadcast_change();
        });
    if (!state.annotations.hasOwnProperty(url)) {
        state.annotations[url] = []
    }
    state.annotations[url].push({
        url: url,
        annotation: annotation,
        userId: userId,
        created: new Date()
    });
    AnnotationStore.emitChange();
    SearchStore.updateMetadata();
};

let _remove_annotation = function(url, position) {
    const data = state.annotations[url][position];
    request
        .delete(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/annotation`)
        .send({
            url: url,
            annotationId: data._id
        })
        .end(() => {
            _broadcast_change();
        });

    state.annotations[url] = state.annotations[url].filter((item) => item._id !== data._id);
    AnnotationStore.emitChange();
    SearchStore.updateMetadata();
};

let _broadcast_change = function() {
    SyncStore.emitPageMetadataUpdate(SearchStore.getActiveUrl());
};

////

export default AnnotationStore;
