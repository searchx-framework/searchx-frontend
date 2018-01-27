import './SearchBar.css'
import React from 'react';

import SearchActions from '../../../actions/SearchActions';
import SessionActions from '../../../actions/SessionActions';
import SearchStore from '../../../stores/SearchStore';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';

import SearchBox from './SearchBox';
import SearchVerticals from './SearchVerticals';

////

let getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");

    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

////

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign(SearchStore.getSearchState(), {
            userId: this.props.userId
        });

        this._onChange = this._onChange.bind(this);
    }

    ////

    componentWillMount() {
        SearchStore.addChangeListener(this._onChange);
    }
    
    componentWillUnmount() {
        SearchStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState(SearchStore.getSearchState());
    }

    ////

    queryChangeHandler(e) {
        const query = e.target.value;
        SearchActions.changeQuery(query);
    }
    
    verticalChangeHandler(vertical) {
        log(LoggerEventTypes.SEARCH_CHANGE_VERTICAL, {
            query: this.state.query,
            vertical: vertical.toLowerCase(),
            current_vertical: this.state.vertical
        });

        SearchActions.changeVertical(vertical.toLowerCase());
        if (this.state.query.length > 0) {
            SearchActions.search(this.state.query, vertical.toLowerCase(),1);
        }
    }

    searchHandler(e) {    
        log(LoggerEventTypes.SEARCH_QUERY, {
            query: this.state.query,
            vertical: this.state.vertical
        });

        e.preventDefault();
        SearchActions.search(this.state.query, this.state.vertical, 1);
        SessionActions.getBookmarks();
    }

    ////

    render() {
        return (
            <div className="Search">
                <form action="/" method="GET" onSubmit={this.searchHandler.bind(this)}>
                    <SearchBox query={this.state.query} changeHandler={this.queryChangeHandler.bind(this)}/>
                    <SearchVerticals vertical={this.state.vertical} changeHandler={this.verticalChangeHandler.bind(this)}/>
                </form>
            </div>
        )
    }
}

export default SearchBar;