import AppConstants from './constants/AppConstants'
import {dispatch} from './utils/Dispatcher';

export default {
    /* Search actions */
    search(query, vertical, pageNumber) {
        dispatch({
            actionType: AppConstants.SEARCH, query, pageNumber
        })
    },
    nextPage(query, vertical, pageNumber) {
        dispatch({
            actionType: AppConstants.NEXT_PAGE, query, pageNumber
        })
    },
    changeVertical(vertical) {
        dispatch({
            actionType: AppConstants.CHANGE_VERTICAL, vertical
        })
    },
    changeQuery(query) {
        dispatch({
            actionType: AppConstants.CHANGE_QUERY, query
        })
    },
    refreshSearch(query, vertical, pageNumber) {
        dispatch({
            actionType: AppConstants.REFRESH_SEARCH, query, vertical, pageNumber
        })
    },

    /* Search actions */
    getQueryHistory() {
        dispatch({
            actionType: AppConstants.GET_QUERY_HISTORY
        })
    },
    getBookmarks() {
        dispatch({
            actionType: AppConstants.GET_BOOKMARKS
        })
    },
    addBookmark(url, title, userId) {
        dispatch({
            actionType: AppConstants.ADD_BOOKMARK, url, title, userId
        })
    },
    removeBookmark(url) {
        dispatch({
            actionType: AppConstants.REMOVE_BOOKMARK, url
        })
    }
}