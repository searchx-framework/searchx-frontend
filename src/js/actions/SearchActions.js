import AppConstants from './ActionTypes';
import {dispatch} from '../utils/Dispatcher';

export default {
    search(query, vertical, page) {
        dispatch({
            type: AppConstants.SEARCH,
            payload: {
                query: query,
                page: page
            },
        })
    },

    changePage(query, vertical, page) {
        dispatch({
            type: AppConstants.CHANGE_PAGE,
            payload: {
                query: query,
                page: page
            },
        })
    },

    changeVertical(vertical) {
        dispatch({
            type: AppConstants.CHANGE_VERTICAL,
            payload: {
                vertical: vertical
            }
        })
    },

    changeQuery(query) {
        dispatch({
            type: AppConstants.CHANGE_QUERY,
            payload: {
                query: query
            }
        })
    },

    refreshSearch(query, vertical, page) {
        dispatch({
            type: AppConstants.REFRESH_SEARCH,
            payload: {
                query: query,
                vertical: vertical,
                page: page
            }
        })
    },
}