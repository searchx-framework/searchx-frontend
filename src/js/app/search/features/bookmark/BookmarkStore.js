import request from 'superagent';
import EventEmitter from 'events'

import {register} from '../../../../utils/Dispatcher';
import ActionTypes from '../../../../actions/ActionTypes';

import AccountStore from '../../../../stores/AccountStore';
import SyncStore from '../../../../stores/SyncStore';
import SearchStore from "../../SearchStore";

const env = require('env');
const CHANGE_EVENT = 'change_bookmark';

let state = {
    bookmarks: [],
    tutorial: false
};

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
    getBookmarks() {
        if (state.tutorial) {
            return [
                {title: "You can view your bookmarked documents here", url: "https://www.viewbookmark.com", userId: AccountStore.getUserId()},
                {title: "You also can delete any bookmarked documents here", url: "https://www.deletebookmark.com"},
                {title: "A starred bookmark will appear on top", url: "https://www.starredbookmark.com", starred: true, userId: AccountStore.getUserId()}
            ];
        }

        const starred = state.bookmarks.filter(x => x.starred);
        const notStarred = state.bookmarks.filter(x => !x.starred);
        return starred.concat(notStarred);
    },

    setBookmarksTutorialData() {
        state.tutorial = true;
        this.emitChange();
    },
    removeBookmarksTutorialData() {
        state.tutorial = false;
        this.emitChange();
    },

    dispatcherIndex: register(action => {
        switch(action.type) {
            case ActionTypes.GET_BOOKMARKS:
                _get_bookmarks();
                break;
            case ActionTypes.ADD_BOOKMARK:
                _add_bookmark(action.payload.url, action.payload.title);
                break;
            case ActionTypes.REMOVE_BOOKMARK:
                _remove_bookmark(action.payload.url);
                break;
            case ActionTypes.STAR_BOOKMARK:
                _star_bookmark(action.payload.url);
                break;
        }
    })
});

////

let _get_bookmarks = function() {
    request
        .get(env.serverUrl + '/v1/session/' + AccountStore.getSessionId() + '/bookmark')
        .end((err, res) => {
            state.bookmarks = [];
            if (!res.body.error) {
                state.bookmarks = res.body.results;
            }
            BookmarkStore.emitChange();
        });
};

let _add_bookmark = function(url, title) {
    const userId = AccountStore.getUserId();
    request
        .post(env.serverUrl + '/v1/session/' + AccountStore.getSessionId() + '/bookmark')
        .send({
            userId: userId,
            url: url,
            title: title
        })
        .end(() => {
            _broadcast_change();
        });

    state.bookmarks.push({
        url: url,
        title: title,
        userId: userId,
        date: new Date()
    });
    BookmarkStore.emitChange();
};

let _remove_bookmark = function(url) {
    request
        .delete(env.serverUrl + '/v1/session/' + AccountStore.getSessionId() + '/bookmark')
        .send({
            url: url
        })
        .end(() => {
            _broadcast_change();
        });

    state.bookmarks = state.bookmarks.filter((item) => item.url !== url);
    BookmarkStore.emitChange();
};

let _star_bookmark = function(url) {
    request
        .post(env.serverUrl + '/v1/session/' + AccountStore.getSessionId() + '/bookmark/star')
        .send({
            url: url
        })
        .end(() => {
            _broadcast_change();
        });

    state.bookmarks.forEach((item) => {
        if (item.url === url) {
            item.starred = !item.starred;
        }
    });
    BookmarkStore.emitChange();
};

let _broadcast_change = function() {
    SyncStore.emitBookmarkUpdate(SearchStore.getSearchState());
};

////

export default BookmarkStore;
