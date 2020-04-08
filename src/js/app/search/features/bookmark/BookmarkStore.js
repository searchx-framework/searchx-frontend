import request from 'superagent';
import EventEmitter from 'events'

import {register} from '../../../../utils/Dispatcher';
import ActionTypes from '../../../../actions/ActionTypes';

import AccountStore from '../../../../stores/AccountStore';
import SyncStore from '../../../../stores/SyncStore';
import SearchStore from "../../SearchStore";
import AnnotationStore from "../annotation/AnnotationStore";
import RatingStore from "../rating/RatingStore.js";

const CHANGE_EVENT = 'change_bookmark';

const state = {
    bookmark: [],
    exclude: [],
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
                {title: "You can view your bookmarked documents here", url: "https://www.viewbookmark.com", userId: "1"},
                {title: "You also can delete any bookmarked documents here", url: "https://www.deletebookmark.com", userId: "1"},
                {title: "A starred bookmark will appear on top", url: "https://www.starredbookmark.com", starred: true, userId: "1"}
            ];
        }

        const starred = state.bookmark.filter(x => x.starred);
        const notStarred = state.bookmark.filter(x => !x.starred);
        return starred.concat(notStarred);
    },
    getExcludes() {
        return state.exclude;
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
            case ActionTypes.GET_BOOKMARKS_AND_EXCLUDES:
                _get('bookmark');
                _get('exclude');
                break;
            case ActionTypes.ADD_BOOKMARK:
                _add(action.payload.url, action.payload.title, 'bookmark');
                break;
            case ActionTypes.REMOVE_BOOKMARK:
                _remove(action.payload.url, 'bookmark');
                break;
            case ActionTypes.GET_EXCLUDES:
                _get('exclude');
                break;
            case ActionTypes.ADD_EXCLUDE:
                _add(action.payload.url, action.payload.title, 'exclude');
                break;
            case ActionTypes.REMOVE_EXCLUDE:
                _remove(action.payload.url, 'exclude');
                break;
            case ActionTypes.STAR_BOOKMARK:
                _star_bookmark(action.payload.url);
                break;
            default:
                break;
        }
    })
});

////

const _get = function(type) {
    request
        .get(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/${type}`)
        .end((err, res) => {
            if (err || !res.body || res.body.error) {
                state[type] = [];
            } else {
                state[type] = res.body.results;
                res.body.results.forEach(result => {
                    const resultId = result.url ? result.url : result.id;
                    if (!AnnotationStore.getUrlAnnotations(resultId)) {
                        AnnotationStore._get_annotations(resultId);
                    }
                    if (!RatingStore.getUrlRating(resultId)) {
                        RatingStore._get_rating(resultId);
                    }
                })  
            }
            BookmarkStore.emitChange();
            SearchStore.updateMetadata();
        });
};

const _add = function(url, title, type) {
    const userId = AccountStore.getUserId();
    request
        .post(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/${type}`)
        .send({
            userId: userId,
            url: url,
            title: title
        })
        .end(() => {
            _broadcast_change();
        });

    state[type].push({
        url: url,
        title: title,
        userId: userId,
        date: new Date()
    });
    BookmarkStore.emitChange();
    SearchStore.updateMetadata();
};

const _remove = function(url, type) {
    request
        .delete(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/${type}`)
        .send({
            url: url
        })
        .end(() => {
            _broadcast_change();
        });

    state[type] = state[type].filter((item) => item.url !== url);
    BookmarkStore.emitChange();
    SearchStore.updateMetadata();
};

const _star_bookmark = function(url) {
    request
        .post(`${process.env.REACT_APP_SERVER_URL}/v1/session/${AccountStore.getSessionId()}/bookmark/star`)
        .send({
            url: url
        })
        .end(() => {
            _broadcast_change();
        });

    state.bookmark.forEach((item) => {
        if (item.url === url) {
            item.starred = !item.starred;
        }
    });
    BookmarkStore.emitChange();
    SearchStore.updateMetadata();
};

const _broadcast_change = function() {
    SyncStore.emitBookmarkUpdate(SearchStore.getSearchState());
};

////

export default BookmarkStore;
