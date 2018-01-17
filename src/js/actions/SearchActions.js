import AppConstants from '../AppConstants';
import {dispatch} from '../AppDispatcher';

export default {
    search(query, vertical, pageNumber) {
        dispatch({
            type: AppConstants.SEARCH,
            payload: {
                query: query,
                pageNumber: pageNumber
            },
        })
    },

    nextPage(query, vertical, pageNumber) {
        dispatch({
            type: AppConstants.NEXT_PAGE,
            payload: {
                query: query,
                pageNumber: pageNumber
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

    refreshSearch(query, vertical, pageNumber) {
        dispatch({
            type: AppConstants.REFRESH_SEARCH,
            payload: {
                query: query,
                vertical: vertical,
                pageNumber: pageNumber
            }
        })
    },
}