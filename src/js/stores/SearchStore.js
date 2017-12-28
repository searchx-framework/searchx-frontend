import {register} from '../utils/Dispatcher';
import AppConstants from '../constants/AppConstants';
import EventEmitter from 'events';
import request from 'superagent';
import AccountStore from '../stores/AccountStore';
import {log} from '../utils/Logger';
import {LoggerEventTypes} from '../constants/LoggerEventTypes';

const configuration = require('../config');
const Config = require('config');
const CHANGE_EVENT = 'change_search';

let _getURLParameter = (name) => {
    // http://stackoverflow.com/a/11582513/3300831
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
};

let state = {
    query: _getURLParameter('q') || '',
    vertical: _getURLParameter('v') || 'web',
    pageNumber: parseInt(_getURLParameter('p')) || 1,
    results: [],
    forum_results: [],
    matches: 0,
    submittedQuery: false,
    elapsedTime: 0,
    finish: false,
    serp_id: '',
    resultsNotFound: false
};

if (!localStorage.getItem("intro-done")) {
    state.results = [{name: "You can view the search first result here", displayUrl: "https://www.result1.com" , snippet: "This is the first result result..."}, 
    {name: "You can view the search second result here", displayUrl: "https://www.result2.com" , snippet: "This is the second result result..."},
    {name: "You can view a search third result here", displayUrl: "https://www.result3.com" , snippet: "This is the third result result..."},
    {name: "You can view a search fourth result here", displayUrl: "https://www.result4.com" , snippet: "This is the fourth result result..."},
    {name: "You can view a search fifth result here", displayUrl: "https://www.result5.com" , snippet: "This is the fifth result result..."}]
}

const SearchStore = Object.assign(EventEmitter.prototype, {
    
        emitChange() {
            this.emit(CHANGE_EVENT);
        },
        addChangeListener(callback) {
            this.on(CHANGE_EVENT, callback);
        },
        removeChangeListener(callback) {
            this.removeListener(CHANGE_EVENT, callback);
        },
        getQuery() {
            return state.query;
        },
        getSerpId() {
            return state.serp_id;
        },
        getVertical() {
            return state.vertical;
        },
        getPageNumber(){
            return state.pageNumber || 1;
        },
        getResults() {
            return state.results;
        },
        getSubmittedQuery(){
            return state.submittedQuery;
        },
        getElapsedTime(){
            return state.elapsedTime;
        },
        isFinished(){
            return state.finished;
        },
        getMatches(){
            return state.matches || 0;
        },
        getResultsNotFound(){
            return state.resultsNotFound;
        },
    
        addBookmark(position) {
            state.results[position].bookmark = true;
            SearchStore.emitChange();
        },
    
        removeBookmark(position){
            state.results[position].bookmark = false;
            SearchStore.emitChange();
        },
    
        searchAndRemoveBookmark(url){
            state.results = state.results.filter(function(item) { 
                if (item["url"] == url ) {
                    item.bookmark = false;
                }
                return true;
            })
        
        },
    
        dispatcherIndex: register(action => {
            switch(action.actionType) {
                case AppConstants.SEARCH:
                    _search(action.query, action.pageNumber);
                    break;
                case AppConstants.NEXT_PAGE:
                    _search(action.query, action.pageNumber);
                    break;
                case AppConstants.CHANGE_VERTICAL:
                    _changeVertical(action.vertical);
                    break;
                case AppConstants.CHANGE_QUERY:
                    _changeQuery(action.query);
                    break;
            }
            SearchStore.emitChange();
        })
    
    });


let _search = (query,pageNumber) => {

    state.submittedQuery = true;
    state.finished = false;
    var elapsedTime = new Date().getTime();
    state.resultsNotFound = false;
    
    state.results = [];
    SearchStore.emitChange();

    pageNumber = pageNumber || state.pageNumber || 1;
    state.pageNumber = pageNumber;
    state.query = query || state.query;

    request
        .get(Config.serverUrl + '/v1/search/'+state.vertical+'/?query='+state.query+ '&page=' 
            + pageNumber + '&userId=' + AccountStore.getTaskSessionId())
        .end((err, res) => {
            if (!res.body.error) {

                if (state.vertical === 'web') {
                    const results = res.body.results;
                   
                    for (let i = 0; i < results.length; i++) {
                        results[i].position = i;
                        if (results[i].signal === "up") {
                            results[i].upPressed = true;
                            results[i].downPressed = false;
                        } else if (results[i].signal === "down") {
                            results[i].upPressed = false;
                            results[i].downPressed = true;
                        } else {
                            results[i].upPressed = false;
                            results[i].downPressed = false;    
                        }
                    }
                    state.results = results;
                    state.matches = res.body.matches;
                    state.pageNumber = pageNumber;
                    state.serp_id = res.body.id;

                } else {
                    state.results = res.body.results;
                    state.matches = res.body.matches;
                    state.pageNumber = pageNumber;
                    state.serp_id = res.body.id;
                }

            } else {
                state.results = [];
                state.pageNumber = pageNumber;
            }

            if (state.results.length === 0) {
                state.resultsNotFound = true;
            }

            state.elapsedTime = (new Date().getTime()) - elapsedTime;

            ////

            const metaInfo = {
                query: state.query,
                page: pageNumber,
                vertical: state.vertical,
                serp_id: state.serp_id,
                elapsedTime: state.elapsedTime
            };
            log(LoggerEventTypes.SEARCHRESULT_ELAPSEDTIME, metaInfo);

            state.finished = true;
            SearchStore.emitChange();
        });
};


if (_getURLParameter('q')) {
    _search();
}

let _changeVertical = (vertical) => {
    state.vertical = vertical;
    state.results = [];
    state.pageNumber = 1;
};

let _changeQuery = (query) => {
    state.query = query;
};



export default SearchStore;
