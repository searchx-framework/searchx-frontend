import React from 'react'
import {Route, Router} from 'react-router-dom'
import MobileDetect from 'mobile-detect';

import {flush} from '../utils/Logger';
import history from './History';
import About from './pages/About';
import Search from './search/Search';

import Session from './tasks/puzzle/Puzzle';
import Register from './tasks/puzzle/forms/Register';
import Feedback from './tasks/puzzle/forms/Feedback';

const config = require('../config');

export class App extends React.Component {
    componentWillMount(){
        setInterval(flush, config.logTimeInterval);
    };

    render() {
        const md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile() !== null) {
            return (<div/>)
        }

        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={About}/>
                    <Route exact path="/about" component={About}/>
                    <Route path="/search" component={Search}/>

                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/feedback" component={Feedback}/>
                    <Route path="/session" component={Session}/>
                </div>
            </Router>
        );
    }
}

export default App