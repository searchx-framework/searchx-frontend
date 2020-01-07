import React from "react";

import TaskedSession from "../components/session/TaskedSession";
import constants from "./constants";

import AccountStore from "../../../stores/AccountStore";
import Collapsible from "react-collapsible";
import Timer from "../components/Timer";

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import ReactAudioPlayer from 'react-audio-player';
import {withRouter} from 'react-router'
import SearchActions from "../../../actions/SearchActions";


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
        SearchActions.reset();
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('popstate', this.handleBeforeUnload);
        const start = localStorage.getItem("timer-start");
        this.setState({
            start: start
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
            <Collapsible trigger="Your Task 2" open transitionTime={3} onOpen={handleTaskOpen} onClose={handleTaskClose} >

                <p>Imagine you are a reporter for a newspaper. Your editor has just told you to write a story about <font color="#33BEFF"> <strong>{task.data.topics[1].title}</strong> </font>.</p>
                <p>There's a meeting in an hour, so your editor asks you and your colleagues to spend 10 minutes together and search
                    for <strong>as many useful documents (news articles) as possible</strong>.</p>

                <p>Collect documents according to the following criteria:</p>
                <strong> <font color="#33BEFF">
                <p>{task.data.topics[1].description}</p>
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
                <TaskedSession timer={timer} taskDescription={taskDescription} lastSession={false} firstSession={false}/>
            </div>
        )
    }

    ////

    onFinish() {
        this.props.history.replace({
            pathname: '/pilot/description3',
            state: { waited: true }
        });
    }
}



export default withRouter(Session);