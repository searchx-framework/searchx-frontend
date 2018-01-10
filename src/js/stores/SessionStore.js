import {register} from '../utils/Dispatcher';
import AppConstants from '../constants/AppConstants';
import EventEmitter from 'events';
import request from 'superagent';

import AccountStore from '../stores/AccountStore';
import SyncStore from '../stores/SyncStore';
import TaskStore from "./TaskStore";
import SearchStore from "./SearchStore";

const env = require('env');
const CHANGE_EVENT = 'change_session';

////

let state = {
    queries: [],
    bookmarks: []
};

////

let broadcastChange = function() {
    if (AccountStore.isCollaborative()) {
        SyncStore.emitBookmarkUpdate(SearchStore.getSearchState());
    }
};

////

let _get_query_history = () => {
    request
        .get(env.serverUrl + '/v1/session/' + AccountStore.getSessionId() + '/query')
        .end((err, res) => {
            if (!res.body.error) {
                state.queries = res.body.results;
            } else {
                state.queries = [];
            }

            ////

            if (!TaskStore.isIntroDone()) {
                state.queries = [
                    {query: "first query", created: new Date() - 10000},
                    {query: "second query", created: new Date()},
                ];
            }
            SessionStore.emitChange();
        });
};

let _get_bookmarks = () => {
    request
        .get(env.serverUrl + '/v1/session/' + AccountStore.getSessionId() + '/bookmark')
        .end((err, res) => {
            if (!res.body.error) {
                state.bookmarks = res.body.results;
            } else {
                state.bookmarks = [];
            }

            ////

            if (!TaskStore.isIntroDone()) {
                state.bookmarks = [
                    {title: "You can view your bookmarked documents here", url: "https://www.viewbookmark.com"},
                    {title: "You also can delete any bookmarked documents here", url: "https://www.deletebookmark.com"},
                    {title: "A starred bookmark will appear on top", url: "https://www.starredbookmark.com", starred: true}
                ];
            }
            SessionStore.emitChange();
        });
};

////

let _add_bookmark = function(url, title, userId) {
    request
        .post(env.serverUrl + '/v1/session/' + AccountStore.getSessionId() + '/bookmark')
        .send({
            userId: userId,
            url: url,
            title: title
        })
        .end((err, res) => {
            broadcastChange();
        });

    state.bookmarks.push({
        url: url,
        title: title,
        userId: userId,
        date: new Date()
    });
    SessionStore.emitChange();
};

let _remove_bookmark = function(url) {
    request
        .delete(env.serverUrl + '/v1/session/' + AccountStore.getSessionId() + '/bookmark')
        .send({
            url: url
        })
        .end((err, res) => {
            broadcastChange();
        });

    state.bookmarks = state.bookmarks.filter((item) => item.url !== url);
    SessionStore.emitChange();
};

let _star_bookmark = function(url) {
    request
        .post(env.serverUrl + '/v1/session/' + AccountStore.getSessionId() + '/bookmark/star')
        .send({
            url: url
        })
        .end((err, res) => {
            broadcastChange();
        });

    state.bookmarks.forEach((item) => {
        if (item.url === url) {
            item.starred = !item.starred;
        }
    });
    SessionStore.emitChange();

};

////

const SessionStore = Object.assign(EventEmitter.prototype, {

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

    getQueryHistory() {
        return state.queries.slice().reverse();
    },
    getBookmarks() {
        const starred = state.bookmarks.filter(x => x.starred);
        const notStarred = state.bookmarks.filter(x => !x.starred);
        return starred.concat(notStarred);
    },

    ////

    dispatcherIndex: register(action => {
        switch(action.actionType) {
            case AppConstants.GET_QUERY_HISTORY:
                _get_query_history();
                break;
            case AppConstants.GET_BOOKMARKS:
                _get_bookmarks();
                break;
            case AppConstants.ADD_BOOKMARK:
                _add_bookmark(action.url, action.title, action.userId);
                break;
            case AppConstants.REMOVE_BOOKMARK:
                _remove_bookmark(action.url);
                break;
            case AppConstants.STAR_BOOKMARK:
                _star_bookmark(action.url);
                break;
        }
        SessionStore.emitChange();
    })

});

export default SessionStore;
