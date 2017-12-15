import AppConstants from '../../constants/AppConstants'
import {dispatch} from '../../utils/Dispatcher';

export default {
    /* Search actions */
    getBookmarks() {
        dispatch({
            actionType: AppConstants.GET_BOOKMARKS
        })
    },
    addBookmark(url, title) {
        dispatch({
            actionType: AppConstants.ADD_BOOKMARK, url, title
        })
    },
    removeBookmark(url) {
        dispatch({
            actionType: AppConstants.REMOVE_BOOKMARK, url
        })
    }
}