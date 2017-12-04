import {dispatch, register} from '../dispatchers/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import EventEmitter from 'events';
import request from 'superagent';
import AccountStore from '../stores/AccountStore';
import {log} from '../logger/Logger';
import { LoggerEventTypes } from '../constants/LoggerEventTypes';

var configuration = require('../config');

var Config = require('config');

const CHANGE_EVENT = 'change_search';

var _getURLParameter = (name) => {
    // http://stackoverflow.com/a/11582513/3300831
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
};


var state = {
    query: _getURLParameter('q') || '',
    vertical: _getURLParameter('v') || 'web',
    pageNumber: 1,
    results: [],
    forum_results: [],
    matches: 0,
    submittedQuery: false,
    elapsedTime: 0,
    finish: false,
    serp_id: '',
    resultsNotFound: false
};


var _search = (query,pageNumber) => {   

    state.submittedQuery = true;
    state.finished = false;
    pageNumber = pageNumber ? pageNumber: 1;
    state.elapsedTime = new Date().getTime();
    state.pageNumber = pageNumber;
    state.resultsNotFound = false;
    state.query = query || state.query;
    
    if (state.vertical == 'forums') { 
        //if searchx is in an iframe, alert the parent that a forum search should be enabled
        parent.postMessage( {query: state.query, page: pageNumber}, configuration.edxDomain);
        return; //end the function call as the forum vertical is client-side only
    } 

    request
        .get(Config.serverUrl + '/v1/search/'+state.vertical+'/?query='+state.query+ '&page=' 
            + pageNumber + '&userId=' + AccountStore.getId())
        .end((err, res) => {
            if (!res.body.error) {

                if (state.vertical === 'web') {
                    var results = res.body.results;
                   
                    for (let i = 0; i < results.length; i++) {
                        results[i].position = i;
                        if (results[i].signal == "up") {
                            results[i].upPressed = true;
                            results[i].downPressed = false;
                        } else if (results[i].signal == "down") {
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
        if (state.results.length == 0) {
            state.resultsNotFound = true;
        }
        state.elapsedTime = (new Date().getTime()) - state.elapsedTime;

        var metaInfo = {
            query: state.query,
            page: pageNumber,
            vertical: state.vertical,
            serp_id: state.serp_id,
            elapsedTime: state.elapsedTime
        }
        
        log(LoggerEventTypes.SEARCHRESULT_ELAPSEDTIME, metaInfo);

        

        state.finished = true;
        
        SearchStore.emitChange();
    });
};

var _rating = function(url,vertical,serpId, discount,signal){
    request
    .post( Config.serverUrl + '/v1/rating')
    .send({
        userId: AccountStore.getId(),
        signal: signal,
        discount: discount,
        vertical: vertical,
        url: url,
        serpId: serpId
    })
    .end((err, res) => {
        //console.log(res.body);
    });
}


if (_getURLParameter('q')) {
    _search();
}

var _changeVertical = (vertical) => {
    state.vertical = vertical;
    state.results = [];
    state.pageNumber = 1;
};

var _changeQuery = (query) => {
    state.query = query;
};

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
        return state.pageNumber;
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

    setRating(serpId, position, discount, signal){
        state.results[position].rating += discount;
        if (signal == "down") {
            state.results[position].upPressed = false;
            state.results[position].downPressed = true;
        } else if (signal == "up") {
            state.results[position].upPressed = true;
            state.results[position].downPressed = false;
        } else {
            state.results[position].upPressed = false;
            state.results[position].downPressed = false;
        }
        _rating(state.results[position].displayUrl,"web",serpId,discount,signal);
        
        SearchStore.emitChange();
        // send request to server
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

export default SearchStore;