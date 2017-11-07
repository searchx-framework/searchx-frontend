import React from 'react';

import Header from '../Header/Header';

import {log,flush} from '../../logger/Logger';
import {LoggerEventTypes} from '../../constants/LoggerEventTypes';

import history from '../../components/App/History';
import AppActions from './../../actions/AppActions';

import SearchResults from '../SearchResults/SearchResults';


export default class Template extends React.Component {

    render() {

        return (
            <div >
                <Header />
                <div className="row">
                    <div className="col-xs-12 col-md-auto">
                        {this.props.children}
                    </div>
                </div>
                <SearchResults/>
            </div>
        )
    }
};