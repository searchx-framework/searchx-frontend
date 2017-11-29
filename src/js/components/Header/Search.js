import './Search.css'

import React from 'react';
import request from 'superagent';

import history from '../../components/App/History';
import AppActions from './../../actions/AppActions';
import SearchStore from './../../stores/SearchStore';
import {log} from '../../logger/Logger';
import {LoggerEventTypes} from '../../constants/LoggerEventTypes';

import SearchBox from './SearchBox';
import SearchVerticals from './SearchVerticals';

var config = require('config');


/*****************************/


var getSearchState = () => {
    return {
        query: SearchStore.getQuery(),
        vertical: SearchStore.getVertical(),
        pageNumber: SearchStore.getPageNumber() ? SearchStore.getPageNumber() : 1
    }
};

var getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

var intro = introJs().setOptions({'doneLabel':  "Ok!",  'showStepNumbers': false, 'showBullets': false});


/*****************************/


class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign(getSearchState(), {
            userId: this.props.userId,
            taskId: this.props.taskId,
            aOrB: this.props.aOrB
        });

        this._onChange = this._onChange.bind(this);
    }

    ////

    componentWillMount() {
        SearchStore.addChangeListener(this._onChange);
        
        var url = (window.location != window.parent.location)
            ? document.referrer
            : document.location.href;
        
        var re = new RegExp('(edx\.org)');
        
        if (re.test(url)) {
           var splitedUrl = url.split("?query=");
          
           if (splitedUrl.length == 2) {

            var query = getParameterByName("query",url);

            log(LoggerEventTypes.SEARCHBOX_SEARCH, {
                query: query,
                vertical: "site-search"
                }
            );
            history.push({ 'pathname':  '/?q='+this.state.query+'&v=web&p=1'});
            AppActions.search(query, "web",1);
            this.setState({query: query, vertical: "site-search"})
           }
        }
    }

    componentDidMount(){   
        intro.onchange(function(targetElement) {  
            var name = targetElement.getAttribute("class") ;
            if ("Search" === name) {
                if (!this.state.aOrB) {
                    intro._introItems.pop()
                }
            }
        });

        request
        .get(config.serverUrl + '/v1/users/'+ this.state.userId + '/profile/?taskId=' + this.state.taskId)
        .end((err, res) => {
            console.log()
            if (!res.body.found) {
                intro.start();
            }
        });
    }
    
    componentWillUnmount() {
        SearchStore.removeChangeListener(this._onChange);
    }

    ////

    _onChange() {
        this.setState(getSearchState);
    }

    queryChangeHandler(e) {
        var query = e.target.value;
        AppActions.changeQuery(query);
    }
    
    verticalChangeHandler(vertical) {
        log(LoggerEventTypes.SEARCHBOX_CHANGE_VERTICAL, {
            query: this.state.query,
            vertical: vertical.toLowerCase(),
            current_vertical: this.state.vertical
        });
        AppActions.changeVertical(vertical.toLowerCase());
        if (this.state.query.length > 0) {
            history.push({'pathname':  '/?q='+this.state.query+'&v='+vertical.toLowerCase() + '&p=1'} );
            AppActions.search(this.state.query, vertical.toLowerCase(),1);
        }
    }

    searchHandler(e) {    
        log(LoggerEventTypes.SEARCHBOX_SEARCH,
            {
                query: this.state.query,
                vertical: this.state.vertical
            }
        );
        e.preventDefault();
        history.push({ 'pathname':  '/?q='+this.state.query+'&v='+this.state.vertical + '&p=1'});
        AppActions.search(this.state.query, this.state.vertical,1);
    }

    ////

    render() {
        var url = (window.location != window.parent.location)
            ? document.referrer
            : document.location.href;
        var re = new RegExp('(edx\.org)');
        
        return (
            <div className="Search" data-intro="Search the Web from within this MOOC, but that is not all ..."  data-set="step1" >
                <form action="/" method="GET" onSubmit={this.searchHandler.bind(this)}>
                    <SearchBox query={this.state.query} changeHandler={this.queryChangeHandler.bind(this)}/>
                    <SearchVerticals vertical={this.state.vertical} changeHandler={this.verticalChangeHandler.bind(this)}
                     edX={re.test(url)} data-set="1"/>
                </form>
                
            </div>
        )
    }
}

export default Search;
