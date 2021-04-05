import React from 'react'
import {Route, Router} from 'react-router-dom'
import MobileDetect from 'mobile-detect';
import Bowser from "bowser"
import history from './History';

import About from './pages/About';
import Search from './search/Search';

import SimpleRegister from './tasks/example-simple/Register';
import SimpleSubmit from './tasks/example-simple/Submit';
import SimpleSession from './tasks/example-simple/Session';
import SyncRegister from './tasks/example-group-sync/Register';
import Disqualified from './tasks/example-group-sync/Disqualified';
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


import RoleBasedRegister from './tasks/role-based/Register';
import RoleBasedReRegister from './tasks/role-based/ReRegister';
import RoleBasedWait from './tasks/role-based/Wait';
import RoleBasedSession from './tasks/role-based/Session';
import RoleBasedDescription from './tasks/role-based/TaskDescription';
import RoleBasedDescriptionShort from './tasks/role-based/TaskDescriptionShort';
import RoleBasedPostTest from './tasks/role-based/PostTest';
import Chat from './search/features/chat/Chat';

import EcommRegister from './tasks/ecomm/Register';
import EcommWait from './tasks/ecomm/Wait';
import EcommSession from './tasks/ecomm/Session';
import EcommDescription from './tasks/ecomm/TaskDescription';
import EcommPostTest from './tasks/ecomm/PostTest';


export class App extends React.Component {

    render() {
        const md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile() !== null) {
            return (<div/>)
        }
        const browser = Bowser.getParser(window.navigator.userAgent);
        const isValidBrowser = browser.satisfies({
        // or in general
        chrome: ">=47",
        firefox: ">=50",
        safari:  ">=14"
        });

        if(!isValidBrowser){
            return (<div>
                <h3>Your browser does not meet our requriement:
                    Google Chrome version 47 (or higher) and Mozilla Firefox version 50 (or higher).
                    Please upgrade your browser to take part in our study</h3>
            </div>)
        } 

        let invalid = localStorage.getItem("invalid-user") || 0;
        if(invalid === 1 ){
            return (<div>
                <h3>You have been disqualified from the study.</h3>
            </div>)
        }



        return (
            <Router history={history}>
                <div>
                    <Route exact path="/" component={About}/>
                    <Route exact path="/about" component={About}/>
                    <Route path="/search" component={Search}/>
                    <Route path="/chat" component={Chat}/>

                    <Route exact path="/simple" component={SimpleRegister}/>
                    <Route exact path="/simple/submit" component={SimpleSubmit}/>
                    <Route path="/simple/session" component={SimpleSession}/>

                    <Route exact path="/sync" component={SyncRegister}/>
                    <Route exact path="/disq" component={Disqualified}/>
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

                    <Route exact path="/role-based" component={RoleBasedRegister}/>
                    <Route exact path="/role-based/register" component={RoleBasedReRegister}/>
                    <Route exact path="/role-based/wait" component={RoleBasedWait}/>
                    <Route path="/role-based/session" component={RoleBasedSession}/>
                    <Route path="/role-based/description" component={RoleBasedDescription}/>
                    <Route path="/role-based/description_short" component={RoleBasedDescriptionShort}/>
                    <Route exact path="/role-based/posttest" component={RoleBasedPostTest}/>

                    <Route exact path="/ecomm" component={EcommRegister}/>
                    <Route exact path="/ecomm/wait" component={EcommWait}/>
                    <Route path="/ecomm/session" component={EcommSession}/>
                    <Route path="/ecomm/description" component={EcommDescription}/>
                    <Route exact path="/ecomm/posttest" component={EcommPostTest}/>

                </div>
            </Router>
        );
    }
}

export default App