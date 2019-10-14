import React from "react";
import {Link} from "react-router-dom";

import TaskedSession from "../components/session/TaskedSession";
import Collapsible from "react-collapsible";
import Timer from "../components/Timer";
import constants from "./constants";
import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";


class Session extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            start: false,
            finished: false,
        };

        this.onFinish = this.onFinish.bind(this);
    }

    componentDidMount() {
        let sessionNum = localStorage.getItem("session-num") || 0;
        
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
        
        console.log("this state", this.state.start)
        const timer = (
            <div style={{marginTop: '10px', textAlign: 'center'}}>
                <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}} showRemaining={true}/>
                
                
                <Link className={"btn btn-primary" + (this.state.finished ? '' : ' disabled')} to="/sync/posttest" role="button">
                        To Final Test
                </Link>
            </div>
        );
        const metaInfo = {

        };
        let handleTaskOpen = () => {
            log(LoggerEventTypes.TASK_OPEN, metaInfo);
        };

        let handleTaskClose = () => {
            log(LoggerEventTypes.TASK_CLOSE, metaInfo);
        };

        const taskDescription = (
            <Collapsible trigger="Your Task" open transitionTime={3} onOpen={handleTaskOpen} onClose={handleTaskClose} >
               <p>
                        The professor requires all students to demonstrate what they learn about a particular topic by
                         conducting searches online and presenting their views on the topic.
                     To prepare your term paper, you to collect and save all the web pages,
                        publications, and other online sources that are helpful for you to write a paper.
                     </p>

                     <p dangerouslySetInnerHTML={{__html: task.data.topic.description}}/>
                     <hr/>
                    <p> During the search phase you will be asked short questions about the topic at regular intervals. Your payment does not depend on the
                        accuracy of your answers to these questions.
                    </p>
                     <p>
                         After you have completed the search phase, you will be asked to complete 11
                         exercises - 10 vocabulary exercise about your term paper topic and and the writing of a summary in your own words about what you have learned on the topic.
                     </p>

            </Collapsible>
        );

        return (
            <div>
                <TaskedSession timer= {timer} taskDescription={taskDescription} lastSession={false} firstSession={false}/>
            </div>
        )

        // return (
        //     <TaskedSession>
        //         <div className="box" style={{marginBottom: '20px', textAlign: 'center'}}>
        //             <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}}/>
        //             <Link className={"btn btn-primary" + (this.state.finished ? '' : ' disabled')} to="/sync/posttest" role="button">
        //                 To Final Test
        //             </Link>
        //         </div>

        //         <div className="box" style={{flexGrow: '1'}}>
        //             <h3 style={{textAlign: 'center'}}>Task Description</h3>
        //             <hr/>

        //             <p>
        //                 The professor requires all students to demonstrate what they learn about a particular topic by
        //                 collaboratively conducting searches online and presenting their views on the topic.
        //                 To prepare your term paper, your group needs to collect and save all the web pages,
        //                 publications, and other online sources that are helpful for you to write a paper.
        //             </p>

        //             <p dangerouslySetInnerHTML={{__html: task.data.topic.description}}/>
        //             <hr/>

        //             <p>
        //                 After you and your group have completed the search phase, you will be asked to complete 13
        //                 exercises;
        //                 those exercises include questions about your term paper topic and the writing of an outline for
        //                 your term paper.
        //                 The exercises are to be finished individually (without help from your group members).
        //             </p>
        //         </div>
        //     </TaskedSession>
        // )
    }

    ////

    onFinish() {
        // if (localStorage.session ==1):
        let sessionNum = localStorage.getItem("session-num") || 0;
        
        
        const flag = localStorage.getItem("full-KG-flag") ;
        if (flag==1){
            sessionNum  = 4
        }
        else{
            sessionNum++;
           
        }
        localStorage.setItem("session-num", sessionNum);
        console.log("sessionNum", sessionNum)
        if (sessionNum == 4 ){
            this.setState({
                finished: true
            });;
        } else {
            this.props.history.push('/sync/intermediatetest');
        }
        
    }
}


const introSteps = [
    {
        element: '.Task',
        intro: 'Please take a minute to read your task description.',
        position: 'left'
    },
    {
        element: '.SearchHeader',
        intro: 'We want you to use our custom web search system SearchX to learn about the topic mentioned in the task description.',
        position: 'bottom-middle-aligned'
    },
    {
        element: '.SearchHeader .form',
        intro: 'Use SearchX to search for webpages, publications, and other online sources to learn about the topic.'
    },
    {
        element: '.QueryHistory',
        intro: 'The query history shows your past search queries.',
        position: 'top'
    },
    {
        element: '.SearchResults',
        intro: 'To save a resource that is useful, bookmark it.',
        position: 'top'
    },
    {
        element: '.Bookmarks',
        intro: 'The documents bookmarked will appear here. You can revisit them before completing the session and while writing the summary on what you have learned about the topic.',
        position: 'top'
    }
    // {
    //     element: '.Search .Content',
    //     intro: 'The query history and bookmarks are color-coded to show who initiated the action.',
    //     position: 'top'
    // }
    // {
    //     intro: 'Please use the provided chat window to collaborate with your group during the session.',
    //     position: 'auto'
    // }
];

export default Session;