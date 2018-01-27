import React from 'react';
import SearchHeader from './Header/SearchHeader';
import ResultsPage from "./Results/ResultsPage";

import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';

export default class Template extends React.Component {
    componentDidMount(){
        document.addEventListener('visibilitychange', function() {
            log(LoggerEventTypes.WINDOW_CHANGE_VISIBILITY, {
                step : "search",
                hidden: document.hidden
            });
        })
    }

    render() {
        return (
            <div >
                <SearchHeader/>
                <ResultsPage/>
            </div>
        )
    }
};