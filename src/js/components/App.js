import './App.css'

import React from 'react'
import {Router, Route} from 'react-router-dom'
import {flush} from '../utils/Logger';
import history from '../components/History';

import About from './Pages/About';
import Page from './Pages/Page';
import Search from './Search/Search';
import Learning from './Survey/Learning';
import PreTest from './Survey/Form/PreTest';
import PostTest from './Survey/Form/PostTest';
import Register from './Survey/Form/Register';
import Welcome from './Survey/Welcome';

const config = require('config');

////

export class App extends React.Component {

    componentWillMount(){
        setInterval( flush, config.logTimeInterval);
    };

    render() {
        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={About}/>
                    <Route exact path="/about" component={About}/>
                    <Route path="/search" component={Search}/>

                    <Route exact path="/start" component={Welcome}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/pretest" component={PreTest}/>
                    <Route exact path="/posttest" component={PostTest}/>

                    <Route path="/learning" component={Learning}/>
                    <Route path="/page" component={Page}/>

                </div>
            </Router>
        );
    }
}

export default App