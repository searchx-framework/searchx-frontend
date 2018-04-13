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
                    <h3 style={{textAlign: 'center'}}>Task Description</h3>
                    <hr/>

                    <p>
                        Explanation of topic here:
                    </p>

                    <p dangerouslySetInnerHTML={{__html: task.data.topic.description}}/>
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
        intro: 'We want you to use our custom web search system SearchX.',
        position: 'bottom-middle-aligned'
    },
    {
        element: '.SearchHeader .form',
        intro: 'Use SearchX to search for webpages, publications, and other online sources about the topic.'
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
        //TODO: adjust explanation conditionally for SS0, or reformulate
        intro: 'The documents you and your group bookmarked will appear here. You can revisit them before completing the session.',
        position: 'top'
    },
    {
        element: '.Search .Content',
        intro: 'The query history and bookmarks are color-coded to show who initiated the action.',
        position: 'top'
    },
    {
        //TODO: write explanation of real-time changes to SERP
        intro: 'explanation of real-time functionality here',
        position: 'auto'
    }
];

export default Session;