import React from "react";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SearchStore from "../../search/SearchStore";
import constants from "./constants";

import './RoleBased.pcss';
import Timer from "../components/Timer";
import {getTaskDescription} from "./Utils";
import SessionStore from "../../../stores/SessionStore";

const metaInfo = {
    currentTopic : parseInt(localStorage.getItem("current-topic")) || 0
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
        var audio = new Audio("/sounds/notification.mp3");
        audio.play();
        return dialogText;
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('popstate', this.handleBeforeUnload);
        log(LoggerEventTypes.TASK_DESCRIPTION_LOAD,metaInfo);
        var audio = new Audio("/sounds/notification.mp3");
        audio.play();
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('popstate', this.handleBeforeUnload);
    }

    onFinish(e) {
        log(LoggerEventTypes.TASK_DESCRIPTION_CONTINUE,metaInfo);
        localStorage.setItem("timer-start", Date.now());
        localStorage.setItem("current-path", '/role-based/session');
        this.props.history.replace({
            pathname: '/role-based/session',
            state: { waited: true }
        });
    }


    render() {
        const start = localStorage.getItem("timer-start") || Date.now();
        localStorage.setItem("timer-start", start);
        if (localStorage.getItem("current-path") !== '/role-based/description') {
            this.props.history.replace({
                pathname: localStorage.getItem("current-path")
            });
        }

        if (localStorage.getItem("invalid-user") === "true") {
            this.props.history.replace({
                pathname: '/disq'
            });
        }

        const task = AccountStore.getTaskData();

        const role = SessionStore.getMemberRole(AccountStore.getUserId());
        let t  = parseInt(localStorage.getItem("current-topic")) || 0;
        localStorage.setItem("current-topic", t || 0);
        const groupId = AccountStore.getGroupId();
        AccountStore.setSessionId(groupId+"-"+ task.topics[t].id + "-" + SearchStore.getVariant() );

        return ( <div className="Wait waitBox">

            <h3> Please read your task description:</h3>
            

            {getTaskDescription(role, task.topics[t].title, task.topics[t].description)}
            <img className="topicVisual" src={'/img/' + task.topics[t].id + ".png"} alt={task.topics[t].title}/>
            <br/>
            <p> SearchX is a specialized search engine for news articles, use it to find relevant articles for the topic. Do not use any other Web search engine. </p>

            <p> You will be redirected once the time is up! <b>DO NOT PRESS THE BROWSER BACK BUTTON!</b> This will invalidate your participation!</p>
            <Timer start={start} duration={constants.taskDescriptionWait + 1} onFinish={this.onFinish} style={{fontSize: '2em'}} showRemaining={true}/>
        </div>
        )
    }
}

export default TaskDescription;