import ActionTypes from "./ActionTypes";
import {dispatch} from "../utils/Dispatcher";

export default {
    getQueryHistory() {
        dispatch({
            type: ActionTypes.GET_QUERY_HISTORY,
            payload: {}
        })
    },

    getBookmarks() {
        dispatch({
            type: ActionTypes.GET_BOOKMARKS,
            payload: {}
        })
    },

    addBookmark(url, title, userId) {
        dispatch({
            type: ActionTypes.ADD_BOOKMARK,
            payload: {
                url: url,
                title: title,
                userId: userId
            }
        })
    },

    removeBookmark(url) {
        dispatch({
            type: ActionTypes.REMOVE_BOOKMARK,
            payload: {
                url: url
            }
        })
    },

    starBookmark(url) {
        dispatch({
            type: ActionTypes.STAR_BOOKMARK,
            payload: {
                url: url
            }
        })
    },
}