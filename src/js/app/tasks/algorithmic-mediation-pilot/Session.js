import React from "react";
import {Redirect} from "react-router-dom";

import TaskedSession from "../components/session/TaskedSession";
import constants from "./constants";

import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";
import Helpers from "../../../utils/Helpers";
import Collapsible from "react-collapsible";
import Timer from "../components/Timer";

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';



class Session extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            start: false,
            finished: false
        };

        this.onFinish = this.onFinish.bind(this);
    }

    componentDidMount() {
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

        const timer = (
            <div className="box" style={{marginTop: '10px', textAlign: 'center'}}>
                <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}}/>
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
            <Collapsible trigger="Your task" transitionTime={3} onOpen={handleTaskOpen} onClose={handleTaskClose} >

                <p> Imagine you are a reporter for a newspaper. Your editor has just asked you and your colleague[s] to gather documents
                    from a collection of news articles to write a story about {task.title}. </p>
                <br/>
                <p> There's a meeting in an hour, so your editor asks you and your colleague[s] to spend 10 minutes together and search
                    for and save as many useful documents as possible.  </p>

                <p> To guarantee the quality of the documents, your editor, who will look over the collected resources in the end,
                    requests that you use a collaborative search system (SearchX). </p>

                <p> Collect documents according to the following criteria: </p>

                <p> {task.description} </p>

            </Collapsible>
        );

        if (this.state.finished) {
            return <Redirect to="/pilot/posttest" />;
        }

        return (
            <TaskedSession timer={timer} taskDescription={taskDescription}/>
        )
    }

    ////

    onFinish() {
        this.setState({
            finished: true
        });
    }
}


const introSteps = [
    {
        element: '.Task',
        intro:  
   "<h3> This is your task: </h3>" 
        
   + "<p> Imagine you are a reporter for a newspaper. Your editor has just asked you and your colleague[s] to gather documents"
   + " from a collection of news articles to write a story about [provided topic title]. </p>" 
   + "<br/>"
   + "<p> There's a meeting in an hour, so your editor asks you and your colleague[s] to spend 10 minutes together and search" 
   +  "for and save as many useful documents as possible.  </p>" 

   + "<p> To guarantee the quality of the documents, your editor, who will look over the collected resources in the end, " 
   + "requests that you use a collaborative search system (SearchX). </p>" 
   + "<p> Collect documents according to the following criteria: </p>" 
   + "<p> [topic narrative] </p>"

    },

    {
        element: '.Collapsible__trigger',
        intro:  "You can read the task description again here.",
        position: "left"
    },
    {
        element: '.SearchHeader',
        intro: 'We want you to use our search system, SearchX.',
        position: 'bottom-middle-aligned'
    },
    {
        element: '.SearchHeader .form',
        intro: 'Use SearchX to search for news articles as described in the task.'
    },
    {
        element: '.QueryHistory',
        intro: 'Recent queries shows your and your group\'s past search queries. In this manner you can see what the others are doing.',
        position: 'bottom'
    },
    {
        element: '.SearchResults',
        intro: 'The search results for your queries will appear here. You can also see which results have been saved and excluded.',
        position: 'right'
    },
    {
        element: '.BookmarkButton-0',
        intro: 'Click the Save button to save useful results.',
        position: 'right'
    },
    {
        element: '.ExcludeButton-0',
        intro: 'Click the Exclude button to exclude results that are not useful from future queries.',
        position: 'right'
    },
    {
        element: '.Bookmarks',
        intro: 'The documents you and your group save will appear here. You can revisit a saved result by clicking on it.',
        position: 'top'
    },
    {
        element: '.Side',
        intro: 'The recent queries and saved documents are color-coded to show who initiated the action.',
        position: 'auto'
    }
];

export default Session;