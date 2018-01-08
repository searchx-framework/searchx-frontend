import {register} from '../utils/Dispatcher';
import AppConstants from '../constants/AppConstants';
import EventEmitter from 'events';
import request from 'superagent';

import AccountStore from '../stores/AccountStore';
import SyncStore from '../stores/SyncStore';
import TaskStore from "./TaskStore";

const env = require('env');
const CHANGE_EVENT = 'change_bookmark';

////

let state = {
    bookmarks: [],
};

if (!TaskStore.isIntroDone()) {
    state.bookmarks = [
        {title: "You can view your bookmarked documents here", url: "https://www.viewbookmark.com"},
        {title: "You also can delete any bookmarked documents here", url: "https://www.deletebookmark.com"}
    ]
}

////

let broadcastChange = function() {
    if (AccountStore.isCollaborative()) {
        SyncStore.emitBookmarkUpdate();
    }
};

////

let _get_bookmarks = () => {
    request
        .get(env.serverUrl + '/v1/bookmark/' + AccountStore.getSessionId())
        .end((err, res) => {
            if (!res.body.error) {
                state.bookmarks = res.body.results;
            } else {
                state.bookmarks = [];
            }
            
            if (!TaskStore.isIntroDone()) {
                state.bookmarks = [{title: "You can view your bookmarked documents here", url: "https://www.viewbookmark.com"}, 
                    {title: "You also can delete any bookmarked documents here", url: "https://www.deletebookmark.com"}]
            }

            BookmarkStore.emitChange();
        });
};

let _add_bookmark = function(url, title, userId){
    request
        .post( env.serverUrl + '/v1/bookmark/')
        .send({
            sessionId: AccountStore.getSessionId(),
            userId: userId,
            url: url,
            title: title
        })
        .end((err, res) => {
            //console.log(res.body);
            broadcastChange();
        });

    state.bookmarks.push({
        url: url,
        title: title,
        userId: userId,
        date: new Date()
    });
    BookmarkStore.emitChange();
};

let _remove_bookmark = function(url){
    request
        .delete( env.serverUrl + '/v1/bookmark/')
        .send({
            sessionId: AccountStore.getSessionId(),
            url: url
        })
        .end((err, res) => {
            //console.log(res.body);
            broadcastChange();
        });

    state.bookmarks = state.bookmarks.filter(function(item) { 
        return item["url"] !== url
    });

    BookmarkStore.emitChange();
};

////

const BookmarkStore = Object.assign(EventEmitter.prototype, {

    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    ////

    getBookmarks() {
        return state.bookmarks;
    },

    dispatcherIndex: register(action => {
        switch(action.actionType) {
            case AppConstants.GET_BOOKMARKS:
                _get_bookmarks();
                break;
            case AppConstants.ADD_BOOKMARK:
                _add_bookmark(action.url, action.title, action.userId);
                break;
            case AppConstants.REMOVE_BOOKMARK:
                _remove_bookmark(action.url);
                break;
        }
        BookmarkStore.emitChange();
    })

});

export default BookmarkStore;
