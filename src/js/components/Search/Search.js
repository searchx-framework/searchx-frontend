import React from 'react';

import history from '../History';
import Header from './Header/Header';
import SearchResults from './SearchResults';

import AppActions from '../../actions/AppActions';
import {log,flush} from '../../logger/Logger';
import {LoggerEventTypes} from '../../constants/LoggerEventTypes';


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