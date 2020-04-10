import React from "react";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SearchStore from "../../search/SearchStore";
import constants from "./constants";

import './RoleBased.pcss';
import Timer from "../components/Timer";
import ReactAudioPlayer from 'react-audio-player';
import {getTaskDescription} from "./Utils";
import SessionStore from "../../../stores/SessionStore";

const metaInfo = {
    currentTopic : localStorage.getItem("current-topic")
};

class TaskDescription extends React.Component {

    constructor(props) {
        super(props);
        this.onFinish = this.onFinish.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }

    handleBeforeUnload(e) {
        const dialogText = 'Leaving this page will quit the task. Are you sure?';
        e.returnValue = dialogText;
        return dialogText;
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('popstate', this.handleBeforeUnload);
        const task = AccountStore.getTaskData();
        const groupId = AccountStore.getGroupId();
        AccountStore.setSessionId(groupId+"-"+ task.topics[0].id + "-" + SearchStore.getVariant() );
        log(LoggerEventTypes.TASK_DESCRIPTION_LOAD,metaInfo);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('popstate', this.handleBeforeUnload);
    }

    onFinish(e) {
        log(LoggerEventTypes.TASK_DESCRIPTION_CONTINUE,metaInfo);
        this.props.history.replace({
            pathname: '/role-based/session',
            state: { waited: true }
        });
    }


    render() {
        
        const task = AccountStore.getTaskData();

        const role = SessionStore.getMemberRole(AccountStore.getUserId());
        const t = metaInfo.currentTopic;

        return ( <div className="Wait waitBox">
            <ReactAudioPlayer
                    src="../sound/notification.mp3"
                    play
            />

            <h3> Please read your task description:</h3>
            

            {getTaskDescription(role, task.topics[t].title, task.topics[t].description)}

            <p> SearchX is a specialized search engine for news articles, use it to find relevant articles for the topic. Do not use any other Web search engine. </p>

            <p> You will be redirected once the time is up!</p>
            <Timer start={new Date()} duration={constants.taskDescriptionWait} onFinish={this.onFinish} style={{fontSize: '2em'}} showRemaining={true}/>
        </div>
        )
    }
}

export default TaskDescription;