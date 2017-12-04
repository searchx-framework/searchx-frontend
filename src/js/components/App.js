import './App.css'

import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {flush} from '../utils/Logger';

import About from './Pages/About';
import Search from './Search/Search';
import PreTest from './Survey/Form/PreTest';
import PostTest from './Survey/Form/PostTest';
import Register from './Survey/Form/Register';
import Welcome from './Survey/Welcome';

const config = require('config');

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
                    <Route path="/register" component={Register}/>
                    <Route path="/pretest" component={PreTest}/>
                    <Route path="/posttest" component={PostTest}/>
                </div>
            </Router>
        );
    }
}

export default App