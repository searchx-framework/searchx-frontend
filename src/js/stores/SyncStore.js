import EventEmitter from 'events';
import io from 'socket.io-client';

import AccountStore from "./AccountStore";
import AppActions from "../AppActions";
import SearchStore from "./SearchStore";

const env = require('env');
const socket = io(env.serverUrl + '/group');

////

if (AccountStore.getId() !== '') {
    socket.emit('register', {
        userId: AccountStore.getId()
    });
}

if (AccountStore.isCollaborative()) {
    socket.on('bookmarkUpdate', (data) => {
        AppActions.getBookmarks();
        AppActions.refreshSearch(data.query, data.vertical, data.pageNumber);
    });
}

////

const SyncStore = Object.assign(EventEmitter.prototype, {

    listenToTopicId(callback) {
        socket.on('groupTopic', (data) => {
            callback(data.topicId, data.sessionId)
        });
    },

    emitPretestScore(scores) {
        socket.emit('pushPretestScores', {
            userId: AccountStore.getId(),
            sessionId: AccountStore.getSessionId(),
            scores: scores
        });
    },

    emitGroupTimeout() {
        socket.emit('pushGroupTimeout', {});
    },

    ////

    listenToSearchState(callback) {
        socket.on('searchState', (data) => {
            callback(data.userId, data.state);
        });
    },

    emitSearchState(state) {
        socket.emit('pushSearchState', {
            userId: AccountStore.getId(),
            state: state
        });
    },

    ////

    emitBookmarkUpdate() {
        socket.emit('pushBookmarkUpdate', {
            query: SearchStore.getQuery(),
            vertical: SearchStore.getVertical(),
            pageNumber: SearchStore.getPageNumber()
        });
    }
});

export default SyncStore;