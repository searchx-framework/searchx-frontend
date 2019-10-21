import React from 'react'
import {Route, Router} from 'react-router-dom'
import MobileDetect from 'mobile-detect';
import Bowser from "bowser"
import history from './History';
import {flush} from '../utils/Logger';
import config from '../config';

import About from './pages/About';
import Search from './search/Search';

import SimpleRegister from './tasks/example-simple/Register';
import SimpleSubmit from './tasks/example-simple/Submit';
import SimpleSession from './tasks/example-simple/Session';
import SyncRegister from './tasks/example-group-sync/Register';
import SyncPreTest from './tasks/example-group-sync/PreTest';
import SyncIntermediateTests from './tasks/example-group-sync/IntermediateTests';
import SyncPostTest from './tasks/example-group-sync/PostTest';
import SyncSession from './tasks/example-group-sync/Session';
import AsyncRegister from './tasks/example-group-async/Register';
import AsyncFeedback from './tasks/example-group-async/Feedback';
import AsyncSession from './tasks/example-group-async/Session';
import PilotRegister from './tasks/algorithmic-mediation-pilot/Register';
import PilotWait from './tasks/algorithmic-mediation-pilot/Wait';
import PilotSession1 from './tasks/algorithmic-mediation-pilot/Session1';
import PilotDescription1 from './tasks/algorithmic-mediation-pilot/TaskDescription1';
import PilotSession2 from './tasks/algorithmic-mediation-pilot/Session2';
import PilotDescription2 from './tasks/algorithmic-mediation-pilot/TaskDescription2';
import PilotSession3 from './tasks/algorithmic-mediation-pilot/Session3';
import PilotDescription3 from './tasks/algorithmic-mediation-pilot/TaskDescription3';
import PilotPostTest from './tasks/algorithmic-mediation-pilot/PostTest';

export class App extends React.Component {
    componentWillMount(){
        setInterval(flush, config.logTimeInterval);
    };

    render() {
        const md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile() !== null) {
            return (<div/>)
        }
        const browser = Bowser.getParser(window.navigator.userAgent);
        const isValidBrowser = browser.satisfies({
        // or in general
        chrome: ">=47",
        firefox: ">=60"
        });

        if(!isValidBrowser){
            return (<div>
                <h3>Your browser does not meet our requriement:
                    Google Chrome version 47 (or higher) and Mozilla Firefox version 44 (or higher).
                    Please upgrade your browser to take part in our study</h3>
            </div>)
        } else{
            console.log(browser.getBrowser());
        }

        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={About}/>
                    <Route exact path="/about" component={About}/>
                    <Route path="/search" component={Search}/>

                    <Route exact path="/simple" component={SimpleRegister}/>
                    <Route exact path="/simple/submit" component={SimpleSubmit}/>
                    <Route path="/simple/session" component={SimpleSession}/>

                    <Route exact path="/sync" component={SyncRegister}/>
                    <Route exact path="/sync/pretest" component={SyncPreTest}/>
                    <Route exact path="/sync/intermediatetest" component={SyncIntermediateTests}/>
                    <Route exact path="/sync/posttest" component={SyncPostTest}/>
                    <Route path="/sync/session" component={SyncSession}/>

                    <Route exact path="/async" component={AsyncRegister}/>
                    <Route exact path="/async/feedback" component={AsyncFeedback}/>
                    <Route path="/async/session" component={AsyncSession}/>

                    <Route exact path="/pilot" component={PilotRegister}/>
                    <Route exact path="/pilot/wait" component={PilotWait}/>
                    <Route path="/pilot/session1" component={PilotSession1}/>
                    <Route path="/pilot/description1" component={PilotDescription1}/>
                    <Route path="/pilot/session2" component={PilotSession2}/>
                    <Route path="/pilot/description2" component={PilotDescription2}/>
                    <Route path="/pilot/session3" component={PilotSession3}/>
                    <Route path="/pilot/description3" component={PilotDescription3}/>
                    <Route exact path="/pilot/posttest" component={PilotPostTest}/>
                </div>
            </Router>
        );
    }
}

export default App