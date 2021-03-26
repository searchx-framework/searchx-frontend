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
        if (socket.connected) {
            socket.emit('pushSearchState', {
                sessionId: AccountStore.getSessionId(),
                groupId: AccountStore.getGroupId(),
                userId: AccountStore.getUserId(),
                state: searchState,
            });
        }
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
        console.log('pushBookmarkUpdate');
        socket.emit('pushBookmarkUpdate', {
            searchState: searchState,
            groupId: AccountStore.getGroupId()
        });
    },

    emitBasketUpdate(searchState) {
        console.log('pushBasketUpdate')
        socket.emit('pushBasketUpdate', {
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

    emitChatUpdate(message) {
        console.log('pushChatUpdate', message);
        socket.emit('pushChatUpdate', {
            groupId: AccountStore.getGroupId(),
            sessionId: AccountStore.getSessionId(),
            message
        });
    }

});

////

socket.on("connect", function() {
    SyncStore.emitUserJoin();
});

socket.on("disconnect", function() {
    console.log("Disconnected");
});


socket.on('searchState', (data) => {
    console.log('searchState');
    Helpers.sleep(1000).then(() => {
        SessionActions.getQueryHistory();
        SessionActions.getSearchState();
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
    console.log('bookmarkUpdate');
    SessionActions.getBookmarksAndExcludes();
});

socket.on('basketUpdate', (data) => {
    console.log('basketUpdate');
    SessionActions.getBasketItems();
});

socket.on('pageMetadataUpdate', (data) => {
    SessionActions.getAnnotations(data.url);
    SessionActions.getRating(data.url);
});

socket.on('chatUpdate', (data) => {
    console.log('chatUpdate', data);
    SessionActions.updateChatMessageList(data);
});

export default SyncStore;