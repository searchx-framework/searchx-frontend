import EventEmitter from 'events';
import io from 'socket.io-client';

import AccountStore from "./AccountStore";
import SessionActions from "../actions/SessionActions";
import SearchStore from "../app/search/SearchStore";
import Helpers from "../utils/Helpers";

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

    emitSyncLeaveGroup() {
        socket.emit('pushSyncLeaveGroup', {
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

    emitChatUpdate() {
        socket.emit('pushChatUpdate', {
            groupId: AccountStore.getGroupId()
        });
    }

});

////

SyncStore.emitUserJoin();

socket.on('searchState', (data) => {

    Helpers.sleep(1000).then(() => {
        SessionActions.getQueryHistory();
    });

   
});

socket.on('viewState', (data) => {
    const url = data.state.url;
    const searchResultsMap = SearchStore.getSearchResultsMap();
    if (searchResultsMap.hasOwnProperty(url)) {
        SearchStore.modifyMetadata(url, {
            views: searchResultsMap[url].metadata.views + 1
        });
    }
});

socket.on('bookmarkUpdate', (data) => {
    SessionActions.getBookmarksAndExcludes();
});

socket.on('pageMetadataUpdate', (data) => {
    SessionActions.getAnnotations(data.url);
    SessionActions.getRating(data.url);
});

socket.on('chatUpdate', (data) => {
    SessionActions.getChatMessageList();
});

export default SyncStore;