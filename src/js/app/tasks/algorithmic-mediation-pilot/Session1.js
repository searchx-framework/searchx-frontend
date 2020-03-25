import React from "react";
import {withRouter} from "react-router";

import TaskedSession from "../components/session/TaskedSession";
import constants from "./constants";

import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";
import Collapsible from "react-collapsible";
import Timer from "../components/Timer";

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import ReactAudioPlayer from 'react-audio-player';


class Session extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            start: false
        };
        this.onFinish = this.onFinish.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('popstate', this.handleBeforeUnload);

        IntroStore.startIntro(getIntroSteps(), () => {
            const start = localStorage.getItem("timer-start") || Date.now();
            localStorage.setItem("timer-start", start);
            this.setState({
                start: start
            });
        });
    }
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('popstate', this.handleBeforeUnload);
    }

    handleBeforeUnload(e) {
        const dialogText = 'Leaving this page will quit the task. Are you sure?';
        e.returnValue = dialogText;
        return dialogText;
    }

    render() {
        
        const task = AccountStore.getTask();
        const timer = (
            <div style={{marginTop: '10px', textAlign: 'center'}}>
                <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}} showRemaining={true}/>
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

        let waited = false;
        if (this.props.location.state) {
            waited = this.props.location.state.waited;
        }


        const taskDescription = (
            <Collapsible open trigger="Your Task 1" transitionTime={3} onOpen={handleTaskOpen} onClose={handleTaskClose} >

                <p>Imagine you are a reporter for a newspaper. Your editor has just told you to write a story about <font color="#33BEFF"> <strong>{task.data.topics[0].title}</strong> </font>.</p>
                <p>There's a meeting in an hour, so your editor asks you and your colleagues to spend 10 minutes together and search
                    for <strong>as many useful documents (news articles) as possible</strong>.</p>

                <p>Collect documents according to the following criteria:</p>
                <strong> <font color="#33BEFF">
                <p>{task.data.topics[0].description}</p>
                </font> </strong>

                <br/>


                <p> SearchX is a specialized search engine for news articles, use it to find relevant articles for the topic. Do not use any other Web search engine. </p>

                <hr/>

                <font color="#9C9C9C"> <p> After 10 minutes the system will give your next search task. </p> </font>

            </Collapsible>
        );

        return (
            <div>
                {waited && <ReactAudioPlayer
                    src="../sound/notification.mp3"
                    autoPlay
                />}
                <TaskedSession timer={timer} taskDescription={taskDescription} lastSession={false} firstSession={true}/>
            </div>
        )
    }

    ////

    onFinish() {
        this.props.history.replace({
            pathname: '/pilot/description2',
            state: { waited: true }
        });
    }
}

function getIntroSteps() {

    return [
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
                intro: 'Recent queries shows your and your group\'s past search queries. In this manner you can see what the other group members are doing. Groups vary in size, so you may see many queries by others, or none at all.',
                position: 'bottom'
            },
            {
                element: '.SearchResultsContainer',
                intro: 'The search results for your queries will appear here. You can also see which results have been saved and excluded.',
                position: 'right'
            },
            {
                element: '.SearchResultsContainer',
                intro: 'Use the Save icon (flag) on the left to save a useful result. Use the Forbidden icon to not show this result anymore for this topic.',
                position: 'right'
            },
            {
                element: '.Bookmarks',
                intro: 'The documents you and your group save will appear here. You can revisit a saved result by clicking on it.',
                position: 'top'
            },
            {
                element: '.Side',
                intro: 'The recent queries and saved documents are color-coded to show which collaborator initiated the action.',
                position: 'left'
            }
    ];
}

export default withRouter(Session);