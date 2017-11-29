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
import PreTest from './PreTest';
import PostTest from './PostTest';

import About from './About';

import Welcome from './Welcome';

var config = require('config');

import AccountStore from '../../stores/AccountStore';


export class App extends React.Component {
    componentWillMount(){
        var taskId = AccountStore.getTaskId();
        
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
            <Router>
                <div>
                    <Route exact path="/" component={Welcome}/>
                    <Route path="/search" component={Template}/>
                    <Route path="/pretest" component={PreTest}/>
                    <Route path="/posttest" component={PostTest}/>
                    <Route path="/about" component={About}/>
                </div>
            </Router>
        );
    }
}



export default App