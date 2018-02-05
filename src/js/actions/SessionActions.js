import AppConstants from "./ActionTypes";
import {dispatch} from "../utils/Dispatcher";

export default {
    getQueryHistory() {
        dispatch({
            type: AppConstants.GET_QUERY_HISTORY,
            payload: {}
        })
    },

    getBookmarks() {
        dispatch({
            type: AppConstants.GET_BOOKMARKS,
            payload: {}
        })
    },

    addBookmark(url, title, userId) {
        dispatch({
            type: AppConstants.ADD_BOOKMARK,
            payload: {
                url: url,
                title: title,
                userId: userId
            }
        })
    },

    removeBookmark(url) {
        dispatch({
            type: AppConstants.REMOVE_BOOKMARK,
            payload: {
                url: url
            }
        })
    },

    starBookmark(url) {
        dispatch({
            type: AppConstants.STAR_BOOKMARK,
            payload: {
                url: url
            }
        })
    }
}