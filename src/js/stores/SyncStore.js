import EventEmitter from 'events';
import io from 'socket.io-client';

import AccountStore from "./AccountStore";
import SearchActions from "../actions/SearchActions";
import SessionActions from "../actions/SessionActions";

const env = require('env');
const socket = io(env.serverUrl + '/session');

////

const SyncStore = Object.assign(EventEmitter.prototype, {
    registerSocket() {
        socket.emit('register', {
            userId: AccountStore.getUserId(),
            groupId: AccountStore.getSessionId()
        });
    },

    ////

    listenToSyncData(callback) {
        socket.on('syncData', (data) => {
            callback(data);
        });
    },

    emitSyncSubmit(data) {
        socket.emit('pushSyncSubmit', {
            taskId: AccountStore.getTaskId(),
            userId: AccountStore.getUserId(),
            sessionId: AccountStore.getSessionId(),
            data: data
        });
    },

    emitSyncLeave() {
        socket.emit('pushSyncLeave', {
            taskId: AccountStore.getTaskId(),
            userId: AccountStore.getUserId(),
            sessionId: AccountStore.getSessionId(),
        });
    },

    emitSyncTimeout() {
        socket.emit('pushSyncTimeout', {
            taskId: AccountStore.getTaskId(),
            userId: AccountStore.getUserId(),
            sessionId: AccountStore.getSessionId(),
        });
    },

    ////

    emitSearchState(searchState) {
        socket.emit('pushSearchState', {
            sessionId: AccountStore.getSessionId(),
            userId: AccountStore.getUserId(),
            state: searchState
        });
    },

    emitViewState(url) {
        socket.emit('pushViewState', {
            sessionId: AccountStore.getSessionId(),
            userId: AccountStore.getUserId(),
            state: {
                url: url
            }
        });
    },

    emitBookmarkUpdate(searchState) {
        socket.emit('pushBookmarkUpdate', searchState);
    },

    emitPageMetadataUpdate(activeUrl) {
        socket.emit('pushPageMetadataUpdate', {
            url: activeUrl
        });
    },
});

////

SyncStore.registerSocket();

socket.on('searchState', (data) => {
    SessionActions.getQueryHistory();
});

socket.on('bookmarkUpdate', (data) => {
    SessionActions.getBookmarksAndExcludes();
});

socket.on('pageMetadataUpdate', (data) => {
    SessionActions.getAnnotations(data.url);
    SessionActions.getRating(data.url);
});

export default SyncStore;