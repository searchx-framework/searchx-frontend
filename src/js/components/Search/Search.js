import React from 'react';
import SearchHeader from './Header/SearchHeader';
import SearchResults from './Results/SearchResults';
import {log} from '../../utils/Logger';
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
                <SearchHeader/>
                <SearchResults/>
            </div>
        )
    }
};