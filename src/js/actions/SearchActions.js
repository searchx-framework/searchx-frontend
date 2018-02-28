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

    changeVertical(vertical) {
        dispatch({
            type: ActionTypes.CHANGE_VERTICAL,
            payload: {
                vertical: vertical
            }
        })
    },

    changePage(page) {
        dispatch({
            type: ActionTypes.CHANGE_PAGE,
            payload: {
                page: page
            },
        })
    },

    updateMetadata(query, vertical, page) {
        dispatch({
            type: ActionTypes.UPDATE_METADATA,
            payload: {
                query: query,
                vertical: vertical,
                page: page
            },
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