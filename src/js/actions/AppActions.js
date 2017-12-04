import AppConstants from '../constants/AppConstants'
import {dispatch} from '../dispatchers/AppDispatcher';

export default {
    /* Search actions */
    search(query, vertical, pageNumber) {
        dispatch({
            actionType: AppConstants.SEARCH, query, pageNumber
        })
    },
    nextPage(query, vertical,pageNumber) {
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

    /* Account actions */
    updateAccountDetails() {
        dispatch({
            actionType: AppConstants.UPDATE_ACCOUNT_DETAILS
        })
    },
    
    /* Current user actions */
    loadUser(handle) {
        dispatch({
            actionType: AppConstants.LOAD_USER, handle
        })
    }
}