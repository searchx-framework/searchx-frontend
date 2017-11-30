import './App.css'

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import HTML5Backend from 'react-dnd-html5-backend';

import history from './History';
import AppActions from '../actions/AppActions';
import {flush,log} from '../logger/Logger';

import About from './Pages/About';
import Search from './Search/Search';
import PreTest from './Survey/Form/PreTest';
import PostTest from './Survey/Form/PostTest';
import Welcome from './Survey/Welcome';

var config = require('config');
import AccountStore from '../stores/AccountStore';

////

export class App extends React.Component {
    componentWillMount(){
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
                    <Route exact path="/" component={About}/>
                    <Route path="/about" component={About}/>
                    <Route path="/search" component={Search}/>
                    <Route path="/start" component={Welcome}/>
                    <Route path="/pretest" component={PreTest}/>
                    <Route path="/posttest" component={PostTest}/>
                </div>
            </Router>
        );
    }
}

export default App