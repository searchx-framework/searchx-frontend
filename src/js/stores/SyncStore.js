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

    emitStartPretest() {
        socket.emit('pushStartPretest', {
            userId: AccountStore.getUserId()
        });
    },

    emitPretestScore(scores) {
        socket.emit('pushPretestScores', {
            userId: AccountStore.getUserId(),
            sessionId: AccountStore.getSessionId(),
            scores: scores
        });
    },

    emitUserLeave() {
        if (AccountStore.isCollaborative()) {
            socket.emit('pushUserLeave', {
                userId: AccountStore.getUserId()
            });
        }
    },

    ////

    emitSearchState(searchState) {
        socket.emit('pushSearchState', {
            sessionId: AccountStore.getSessionId(),
            userId: AccountStore.getUserId(),
            state: searchState
        });
    },

    emitBookmarkUpdate(searchState) {
        socket.emit('pushBookmarkUpdate', searchState);
    }
});

////

if (AccountStore.getUserId() !== '') {
    SyncStore.registerSocket();
}

if (AccountStore.isCollaborative()) {
    socket.on('bookmarkUpdate', (data) => {
        SessionActions.getBookmarks();
        SearchActions.refreshSearch(data.query, data.vertical, data.page);
    });

    socket.on('searchState', (data) => {
        SessionActions.getQueryHistory();
    });
}

export default SyncStore;