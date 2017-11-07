import './App.css'


import HTML5Backend from 'react-dnd-html5-backend';


import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


import history from './History';


import AppActions from '../../actions/AppActions';
import {flush,log} from '../../logger/Logger';

import Template from './AppTemplate';
import SiteSearch from '../SiteSearch/SiteSearch';

import About from './About';


var config = require('config');

import AccountStore from '../../stores/AccountStore';




export class App extends React.Component {
    componentWillMount(){
        var courseId = AccountStore.getCourseId();
        
        setInterval( flush, config.logTimeInterval);

        window.onbeforeunload = function (e) {
            flush();
        };
        document.addEventListener('visibilitychange', function(){
            flush();
        })
    };

        render() {
        
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={Template}/>
                    <Route path="/site-search" component={SiteSearch}/>
                    <Route path="/about" component={About}/>
                </div>
            </Router>
        );
    }
}



export default App