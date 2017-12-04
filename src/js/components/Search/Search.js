import React from 'react';

import history from '../History';
import Header from './Header/Header';
import SearchResults from './SearchResults';

import AppActions from '../../actions/AppActions';
import {log,flush} from '../../logger/Logger';
import {LoggerEventTypes} from '../../constants/LoggerEventTypes';


export default class Template extends React.Component {

    componentDidMount(){
        window.onblur = function(){   

            var metaInfo = {
                type: "blur",
                step : "search"

            }
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo)

        }  
        window.onfocus = function(){  
            var metaInfo = {
                type: "focus",
                step : "search"

            }
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo)
        }
    }

    render() {

        return (
            <div >
                <Header />
                <SearchResults/>
            </div>
        )
    }
};