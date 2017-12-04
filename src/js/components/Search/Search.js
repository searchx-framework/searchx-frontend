import React from 'react';
import Header from './Header/Header';
import SearchResults from './SearchResults';
import {log} from '../../logger/Logger';
import {LoggerEventTypes} from '../../constants/LoggerEventTypes';


export default class Template extends React.Component {

    componentDidMount(){
        window.onblur = function(){
            const metaInfo = {
                type: "blur",
                step : "search"

            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
        };

        window.onfocus = function(){  
            const metaInfo = {
                type: "focus",
                step : "search"

            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
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