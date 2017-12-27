import React from 'react';
import SearchHeader from './Header/SearchHeader';
import SearchResults from './Results/SearchResults';
import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../constants/LoggerEventTypes';


export default class Template extends React.Component {

    componentDidMount(){
        document.addEventListener('visibilitychange', function(){
            const metaInfo = {
                step : "search",
                hidden: document.hidden
            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
        })
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