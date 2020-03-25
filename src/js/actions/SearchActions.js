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

    updateMetadata() {
        dispatch({
            type: ActionTypes.UPDATE_METADATA
        })
    },

    openUrl(url, doctext) {
        dispatch({
            type: ActionTypes.OPEN_URL,
            payload: {
                url: url,
                doctext: doctext
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

    getDocumentById(id) {
        dispatch({
            type: ActionTypes.GET_DOCUMENT_BY_ID,
            payload: {
                id: id
            }
        })
    },

    reset() {
        dispatch({
            type: ActionTypes.RESET,
            payload: {}
        })
    },

    changeVariant(variant) {
        dispatch({
            type: ActionTypes.CHANGE_VARIANT,
            payload: {}
        })
    }
}