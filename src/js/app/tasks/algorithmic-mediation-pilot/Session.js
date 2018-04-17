import React from "react";
import {Link} from "react-router-dom";

import TaskedSession from "../components/session/TaskedSession";
import Timer from "../components/Timer";
import constants from "./constants";

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

        return (
            <TaskedSession>
                <div className="box" style={{marginBottom: '20px', textAlign: 'center'}}>
                    <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}}/>
                    <Link className={"btn btn-primary" + (this.state.finished ? '' : ' disabled')} to="/pilot/posttest" role="button">
                        To Final Test
                    </Link>
                </div>

                <div className="box" style={{flexGrow: '1'}}>
                    <h4 style={{textAlign: 'center'}}>Task Description</h4>
                    <hr/>
                        <p>
                        Imagine that you are a reporter for a newspaper. 
                        Your editor has just asked you and your colleague to search for documents 
                        in a collection of news articles to write stories about . 
                        </p>

                        <hr/>

                        <p> There's a meeting in an hour, so your editor need you and your colleague to spend 10 minutes 
                            in this task to search and save as many documents as possible. 
                        </p>

                        <p> To guarantee the quality of the documents, your editor, which will judge the documents later, 
                            requested that you use SearchX with this criteria:

                        </p>

                        <p>  </p>
                </div>
        
            
        </TaskedSession>
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
        intro: 'Please take a minute to read your task description.',
        position: 'left'
    },
    {
        element: '.SearchHeader',
        intro: 'We want you to use ou search system, SearchX.',
        position: 'bottom-middle-aligned'
    },
    {
        element: '.SearchHeader .form',
        intro: 'Use SearchX to search for news article about the topic.'
    },
    {
        element: '.QueryHistory',
        intro: 'The query history shows your and your group\'s past search queries. In this manner you see what the others are doing.',
        position: 'top'
    },
    {
        element: '.SearchResults',
        intro: 'To save a resource that is useful, bookmark it. You also see your group\'s bookmarks here.',
        position: 'top'
    },
    {
        element: '.Bookmarks',
        intro: 'The documents you and your group bookmarked will appear here. You can revisit them before completing the session.',
        position: 'top'
    },
    {
        element: '.Search .Content',
        intro: 'The query history and bookmarks are color-coded to show who initiated the action.',
        position: 'top'
    },
    {
        intro: 'Please use the provided chat window to collaborate with your group during the session.',
        position: 'auto'
    }
];

export default Session;