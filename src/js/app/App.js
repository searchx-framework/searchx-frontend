import React from 'react'
import {Route, Router} from 'react-router-dom'
import MobileDetect from 'mobile-detect';

import {flush} from '../utils/Logger';
import history from './History';
import About from './pages/About';
import Search from './search/Search';

import Learning from './tasks/learning/Learning';
import Welcome from './tasks/learning/forms/Welcome';
import Register from './tasks/learning/forms/Register';
import PreTest from './tasks/learning/forms/PreTest';
import PostTest from './tasks/learning/forms/PostTest';

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

                    <Route exact path="/start" component={Welcome}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/pretest" component={PreTest}/>
                    <Route exact path="/posttest" component={PostTest}/>
                    <Route path="/learning" component={Learning}/>
                </div>
            </Router>
        );
    }
}

export default App