import React from "react";
import {Link} from "react-router-dom";
import SyncStore from "../../../stores/SyncStore";
import TaskedSession from "../components/session/TaskedSession";
// import Collapsible from "react-collapsible";
import Timer from "../components/Timer";
import constants from "./constants";
import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";
import Alert from "react-s-alert";

class Session extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            start: false,
            finished: false,
        };

        this.onFinish = this.onFinish.bind(this);
        this.onSwitchPage = this.onSwitchPage.bind(this);
    }

    componentDidMount() {
        const taskdata = JSON.parse(localStorage.getItem("task-data") === undefined ? "{}" : localStorage.getItem("task-data")) || '';
        let td = '<h3> Your task </h3><p> The professor requires all students to demonstrate what they learn about a particular topic by conducting searches online and presenting their views on the topic. </p>';
        td+= taskdata.topic ? taskdata.topic.description:'';
        // td += `Remember: there will be three intermittent tests. After searching for at least 20 minutes you can move on to the final test by clicking on the "To Final Test" button. 
        // The documents you saved will be available to you when writing (in your own words) a short summary about the topic.`

        const introSteps = [
            {
                element: '.Task',
                intro: 'Please take a minute to read your task description.',
                position: 'left'
            },
            {
                element: '.TaskDescription',
                intro: td
            },
            {
                element: '.SearchHeader',
                intro: 'We want you to use our custom web search system SearchX to learn about the topic mentioned in the task description for at least 20 minutes. Note that the "To Final Test" button will only be accessible after 20 minutes. You can search for longer if you want to know more about the given topic.',
                position: 'bottom-middle-aligned'
            },
            {
                element: '.SearchHeader .form',
                intro: 'Use SearchX to search for webpages, publications, and other online sources to learn about the topic. '
            },
            {
                element: '.QueryHistory',
                intro: 'The query history shows your past search queries.',
                position: 'top'
            },
            {
                element: '.SearchResults',
                intro: 'Save a resource that is useful by clicking on the yellow flag. Make sure to read the document and not just the snippet!',
                position: 'top'
            },
            {
                element: '.Bookmarks',
                intro: 'The saved documents saved will appear here. You can revisit them before completing the session and while writing the summary on what you have learned about the topic.',
                position: 'top'
            }

        ];     
        IntroStore.startIntro(introSteps, () => {
            const start = localStorage.getItem("timer-start") || Date.now();
            localStorage.setItem("timer-start", start);
            this.setState({
                start: start
                });
            


        });

    }

    

    render() {
        const task = AccountStore.getTask();
        // const timer = (
        //     <div style={{marginTop: '10px', textAlign: 'center'}}>
        //         <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}} showRemaining={false}/>
                
                
        //         <Link className={"btn btn-primary" + (this.state.finished ? '' : ' disabled')} to="/sync/posttest" role="button">
        //                 To Final Test
        //         </Link>
        //     </div>
        // );
        // const metaInfo = {
        //     session: localStorage.getItem("session-num") || 0,

        // };
        // let handleTaskOpen = () => {
        //     log(LoggerEventTypes.TASK_OPEN, metaInfo);
        // };

        // let handleTaskClose = () => {
        //     log(LoggerEventTypes.TASK_CLOSE, metaInfo);
        // };

        // const taskDescription = (
        //     <Collapsible trigger="Your Task" open transitionTime={3} onOpen={handleTaskOpen} onClose={handleTaskClose} >
        //        <p>
        //                 The professor requires all students to demonstrate what they learn about a particular topic by
        //                  conducting searches online and presenting their views on the topic.
        //              You need to use SearchX to learn about the topic. You must open and read documents/web pages that you think are 
        //              important about the given topic.  
        //              </p>

        //              <p dangerouslySetInnerHTML={{__html: task.data.topic.description}}/>
        //              <hr/>
        //             <p> Remember: there will be three intermittent tests. After searching for at least 20 minutes you can move on to the final test by clicking on the "To Final Test" button. 
        //                 The documents you saved will be available to you when writing (in your own words) a short summary about the topic.
        //             </p>


        //     </Collapsible>
        // );

        return (
            <TaskedSession>
                <div className="box" style={{marginBottom: '20px', textAlign: 'center'}}>
                    <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}}/>
                    <Link className={"btn btn-primary" + (this.state.finished ? '' : ' disabled')} to="/sync/posttest" role="button">
                        To Final Test
                    </Link>
                </div>

                <div className="box" style={{flexGrow: '1'}}>
                    <h3 style={{textAlign: 'center'}}>Task Description</h3>
                    <hr/>

                    <p>
                        The professor requires all students to demonstrate what they learn about a particular topic by
                        collaboratively conducting searches online and presenting their views on the topic.
                        To prepare your term paper, your group needs to collect and save all the web pages,
                        publications, and other online sources that are helpful for you to write a paper.
                    </p>

                    <p dangerouslySetInnerHTML={{__html: task.data.topic.description}}/>
                    <hr/>

                    <p>
                        After you and your group have completed the search phase, you will be asked to complete 13
                        exercises;
                        those exercises include questions about your term paper topic and the writing of an outline for
                        your term paper.
                        The exercises are to be finished individually (without help from your group members).
                    </p>
                </div>
            </TaskedSession>
        )
    }

    ////

    onFinish() {
        // if (localStorage.session ==1):
        let sessionNum = localStorage.getItem("session-num") || 0;
        
        
        const flag = localStorage.getItem("full-KG-flag") ;
        if (flag===1){
            sessionNum  = 4
        }
        else{
            sessionNum++;
           
        }
        localStorage.setItem("session-num", sessionNum);
        if (sessionNum === 4 ){
            this.setState({
                finished: true
            });;
        } else {
            this.props.history.push('/sync/intermediatetest');
        }
        
    }
    onLeave() {
        log(LoggerEventTypes.SEARCH_EXIT, {
            step : "session",
            state : this.state
        });

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }
    onSwitchPage() {
        let switchTabs = localStorage.getItem("switch-tabs-session") || 0;
        switchTabs++;
        localStorage.setItem("switch-tabs-session", switchTabs);
        log(LoggerEventTypes.TAB_CHANGE, {
            step: "sessions",
            switch: switchTabs
        });
        if (switchTabs >= constants.switchPageLimit) {
            this.onLeave();
            localStorage.setItem("invalid-user",1);
            this.props.history.push('/disq');
            localStorage.removeItem("switch-tabs-session");

            Alert.error('You have been disqualified from the study.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        } else {
            Alert.error('We have noticed that you have tried to change to a different window/tab. Please, use SearchX only for your learning about the given topic!', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });

            Alert.warning(`Remember that more than ${constants.switchPageLimit} tab changes result in a disqualification. So far you have changed tabs ${switchTabs} time(s)`, {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        }
    }
}



export default Session;