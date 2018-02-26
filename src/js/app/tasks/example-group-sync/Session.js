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

                    <p dangerouslySetInnerHTML={{__html: task.data.topic.task}}/>
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