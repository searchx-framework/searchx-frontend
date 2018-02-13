import request from 'superagent';
import EventEmitter from 'events'

import {register} from '../../../../utils/Dispatcher';
import ActionTypes from '../../../../actions/ActionTypes';

import AccountStore from '../../../../stores/AccountStore';
import SyncStore from '../../../../stores/SyncStore';
import SearchStore from "../../SearchStore";

const env = require('env');
const CHANGE_EVENT = 'change_annotation';

let state = {
    annotations: []
};

const AnnotationsStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getActiveUrlAnnotations() {
        return state.annotations;
    },

    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.GET_ANNOTATIONS:
                if (SearchStore.getActiveUrl() === action.payload.url) {
                    _get_annotations(action.payload.url)
                }
                break;
            case ActionTypes.ADD_ANNOTATION:
                _add_annotation(action.payload.url, action.payload.annotation);
                break;
            case ActionTypes.REMOVE_ANNOTATION:
                _remove_annotation(action.payload.url, action.payload.position);
                break;
        }
        AnnotationsStore.emitChange();
    })
});

////

let _get_annotations = function(url) {
    request
        .get(`${env.serverUrl}/v1/session/${AccountStore.getSessionId()}/annotation/?url=${encodeURIComponent(url)}`)
        .end((err, res) => {
            state.annotations = [];
            if (!err && !res.body.error) {
                state.annotations = res.body.results;
            }
            AnnotationsStore.emitChange();
        });
};

let _add_annotation = function(url, annotation) {
    const userId = AccountStore.getUserId();
    request
        .post(`${env.serverUrl}/v1/session/${AccountStore.getSessionId()}/annotation`)
        .send({
            url: url,
            userId: userId,
            annotation: annotation
        })
        .end(() => {
            _broadcast_change();
        });

    state.annotations.push({
        url: url,
        annotation: annotation,
        userId: userId,
        created: new Date()
    });
    AnnotationsStore.emitChange();
};

let _remove_annotation = function(url, position) {
    const data = state.annotations[position];
    request
        .delete(`${env.serverUrl}/v1/session/${AccountStore.getSessionId()}/annotation`)
        .send({
            url: url,
            annotationId: data._id
        })
        .end(() => {
            _broadcast_change();
        });

    state.annotations = state.annotations.filter((item) => item._id !== data._id);
    AnnotationsStore.emitChange();
};

let _broadcast_change = function() {
    if (AccountStore.isCollaborative()) {
        SyncStore.emitPageMetadataUpdate(SearchStore.getActiveUrl());
    }
};

////

export default AnnotationsStore;
