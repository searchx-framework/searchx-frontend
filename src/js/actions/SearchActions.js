import ActionTypes from './ActionTypes';
import {dispatch} from '../utils/Dispatcher';

export default {
    search(query, vertical, page) {
        dispatch({
            type: ActionTypes.SEARCH,
            payload: {
                query: query,
                vertical: vertical,
                page: page
            },
        })
    },

    changePage(query, vertical, page) {
        dispatch({
            type: ActionTypes.CHANGE_PAGE,
            payload: {
                query: query,
                page: page
            },
        })
    },

    changeVertical(vertical) {
        dispatch({
            type: ActionTypes.CHANGE_VERTICAL,
            payload: {
                vertical: vertical
            }
        })
    },

    changeQuery(query) {
        dispatch({
            type: ActionTypes.CHANGE_QUERY,
            payload: {
                query: query
            }
        })
    },

    openUrl(url) {
        dispatch({
            type: ActionTypes.OPEN_URL,
            payload: {
                url: url
            }
        })
    },

    closeUrl() {
        dispatch({
            type: ActionTypes.CLOSE_URL,
            payload: {
            }
        })
    },
}