import './SiteSearch.css'

import React from 'react';
import history from '../../components/App/History';
import AppActions from './../../actions/AppActions';
import SearchStore from './../../stores/SearchStore';

import { Redirect } from 'react-router'

import SiteSearchBox from './SiteSearchBox';

var config = require('config');
var configuration = require('../../config');

import AccountStore from '../../stores/AccountStore';

import {log} from '../../logger/Logger';
import {LoggerEventTypes} from '../../constants/LoggerEventTypes';



class Search extends React.Component {
    constructor() {
        super();
        this.state = {query: SearchStore.getQuery()};
        this._onChange = this._onChange.bind(this);
    }
    componentWillMount() {
        SearchStore.addChangeListener(this._onChange);
    }
    componentWillUnmount() {
        SearchStore.removeChangeListener(this._onChange);
    }
    
    _onChange() {
        this.setState({query: SearchStore.getQuery()});
    }

    queryChangeHandler(e) {
        var query = e.target.value;
        this.state.query = query;
        AppActions.changeQuery(query);
    }

    searchHandler(e) {
        var courseId = AccountStore.getCourseId();

        window.top.location.href = config.redirectSearchBox[courseId] + "?query=" + this.state.query ;
         
    }


    render() {
       
        return (
            <div className="Search" data-intro='Hello step one!'>
                <form onSubmit={this.searchHandler.bind(this)}>
                    <SiteSearchBox query={this.state.query} changeHandler={this.queryChangeHandler.bind(this)}/>
                </form>
            </div>
        )
    }
}

export default Search;