import EventEmitter from 'events';
import io from 'socket.io-client';

import AccountStore from "./AccountStore";
import SearchActions from "../actions/SearchActions";
import SessionActions from "../actions/SessionActions";

const socket = io(process.env.REACT_APP_SERVER_URL + '/session');

////

const SyncStore = Object.assign(EventEmitter.prototype, {
    emitUserJoin() {
        socket.emit('register', {
            userId: AccountStore.getUserId(),
            groupId: AccountStore.getGroupId(),
        });
    },

    emitUserJoinGroup(groupComplete) {
        socket.emit('joinGroup', {
            taskId: AccountStore.getTaskId(),
            userId: AccountStore.getUserId(),
            groupId: AccountStore.getGroupId(),
            groupComplete: groupComplete,
        })
    },

    ////

    listenToSyncData(callback) {
        socket.on('syncData', (data) => {
            callback(data);
        });
    },

    stopListenToSyncData() {
        socket.off('syncData');
    },

    emitSyncSubmit(data) {
        socket.emit('pushSyncSubmit', {
            taskId: AccountStore.getTaskId(),
            userId: AccountStore.getUserId(),
            groupId: AccountStore.getGroupId(),
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
            groupId: AccountStore.getGroupId(),
        });
    },

    ////

    emitSearchState(searchState) {
        socket.emit('pushSearchState', {
            sessionId: AccountStore.getSessionId(),
            groupId: AccountStore.getGroupId(),
            userId: AccountStore.getUserId(),
            state: searchState,
        });
    },

    emitViewState(url) {
        socket.emit('pushViewState', {
            sessionId: AccountStore.getSessionId(),
            groupId: AccountStore.getGroupId(),
            userId: AccountStore.getUserId(),
            state: {
                url: url
            }
        });
    },

    emitBookmarkUpdate(searchState) {
        socket.emit('pushBookmarkUpdate', {
            searchState: searchState,
            groupId: AccountStore.getGroupId()
        });
    },

    emitPageMetadataUpdate(activeUrl) {
        socket.emit('pushPageMetadataUpdate', {
            url: activeUrl,
            groupId: AccountStore.getGroupId(),
        });
    },
});

////

SyncStore.emitUserJoin();

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