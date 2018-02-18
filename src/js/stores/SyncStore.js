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

    listenToGrouping(callback) {
        socket.on('groupData', (data) => {
            callback(data.group)
        });
    },

    listenToGroupPretestStart(callback) {
        socket.on('startPretest', () => {
            callback()
        });
    },

    ////

    emitPretestStart() {
        socket.emit('pushPretestStart', {
            taskId: AccountStore.getTaskId(),
            userId: AccountStore.getUserId()
        });
    },

    emitPretestSubmit(results) {
        socket.emit('pushPretestSubmit', {
            taskId: AccountStore.getTaskId(),
            userId: AccountStore.getUserId(),
            sessionId: AccountStore.getSessionId(),
            results: results
        });
    },

    emitPretestLeave() {
        socket.emit('pushPretestLeave', {
            taskId: AccountStore.getTaskId(),
            userId: AccountStore.getUserId()
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

if (AccountStore.getUserId() !== '') {
    SyncStore.registerSocket();
}

if (AccountStore.isCollaborative()) {
    socket.on('searchState', (data) => {
        SessionActions.getQueryHistory();
    });

    socket.on('bookmarkUpdate', (data) => {
        SessionActions.getBookmarks();
        SearchActions.search(data.query, data.vertical, data.page);
    });

    socket.on('pageMetadataUpdate', (data) => {
        SessionActions.getAnnotations(data.url);
        SessionActions.getRating(data.url);
    });
}

export default SyncStore;