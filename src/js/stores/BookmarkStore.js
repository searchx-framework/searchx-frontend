import {register} from '../utils/Dispatcher';
import AppConstants from '../constants/AppConstants';
import EventEmitter from 'events';
import request from 'superagent';
import AccountStore from '../stores/AccountStore';

const env = require('env');
const CHANGE_EVENT = 'change_search';

////

let state = {
    bookmarks: [],
};

if (!localStorage.getItem("intro-done")) {
    state.bookmarks = [{title: "You can view your bookmarked documents here", url: "https://www.viewbookmark.com"}, 
        {title: "You also can delete any bookmarked documents here", url: "https://www.deletebookmark.com"}]
}

let _get_bookmarks = () => {
    request
        .get(env.serverUrl + '/v1/bookmark/' + AccountStore.getTaskSessionId())
        .end((err, res) => {
            if (!res.body.error) {
                state.bookmarks = res.body.results;

            } else {
                state.bookmarks = [];
            }
            
            if (!localStorage.getItem("intro-done")) {
                state.bookmarks = [{title: "You can view your bookmarked documents here", url: "https://www.viewbookmark.com"}, 
                    {title: "You also can delete any bookmarked documents here", url: "https://www.deletebookmark.com"}]
            }

            BookmarkStore.emitChange();
        });
};

let _add_bookmark = function(url, title){
    request
    .post( env.serverUrl + '/v1/bookmark/')
    .send({
        userId: AccountStore.getTaskSessionId(),
        url: url,
        title : title
    })
    .end((err, res) => {
        //console.log(res.body);
    });
    state.bookmarks.unshift( {url: url,title : title});
    BookmarkStore.emitChange();
};

let _remove_bookmark = function(url){

    request
    .delete( env.serverUrl + '/v1/bookmark/')
    .send({
        userId: AccountStore.getTaskSessionId(),
        url: url
    })
    .end((err, res) => {
        //console.log(res.body);
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
    getBookmarks() {
        return state.bookmarks;
    },

    dispatcherIndex: register(action => {
        switch(action.actionType) {
            case AppConstants.GET_BOOKMARKS:
                _get_bookmarks();
                break;
            case AppConstants.ADD_BOOKMARK:
                _add_bookmark(action.url, action.title);
                break;
            case AppConstants.REMOVE_BOOKMARK:
                _remove_bookmark(action.url);
                break;
        }
        BookmarkStore.emitChange();
    })

});

export default BookmarkStore;
