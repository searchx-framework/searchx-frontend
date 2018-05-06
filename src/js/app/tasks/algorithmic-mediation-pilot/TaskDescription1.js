import React from "react";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import IntroStore from "../../../stores/IntroStore";
import constants from "./constants";
import Helpers from "../../../utils/Helpers";

import './Pilot.pcss';
import Timer from "../components/Timer";
import {Link} from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';

const metaInfo = {
};

class TaskDescription1 extends React.Component {

    constructor(props) {
        super(props);
        this.onFinish = this.onFinish.bind(this);
    }

    

    componentDidMount(){
        const task = AccountStore.getTaskData();
        const groupId = localStorage.getItem("group-id");
        AccountStore.setSessionId(groupId+"-"+ task.topics[0].id);
        log(LoggerEventTypes.TASK_DESCRIPTION_LOAD,metaInfo);
    }

    onFinish(e) {
        log(LoggerEventTypes.TASK_DESCRIPTION_CONTINUE,metaInfo);
        this.props.history.push({
            pathname: '/pilot/session1',
            state: { waited: true }
        });
    }


    render() {
        
        const task = AccountStore.getTaskData();

        let waited = false;
        if (this.props.location.state) {
            waited = this.props.location.state.waited;
        }

        return <div className="Wait waitBox"> 

            <ReactAudioPlayer
                    src="../sound/notification.mp3"
                    play
            />

            <h3> Please read your task description:</h3>
            
            <p> Imagine you are a reporter for a newspaper. Your editor has just asked you and your colleagues to gather documents
        from a collection of news articles to write a story about <strong>{task.topics[0].title}</strong>.</p> 
        
            <p>There's a meeting in an hour, so your editor asks you and your colleagues to spend 10 minutes together and search
                    for and <strong>save as many useful documents as possible</strong>.</p>

            <p>To guarantee the quality of the documents, your editor, who will look over the collected resources in the end,
                    requests that you use a collaborative search system (SearchX).</p>

            <p>Collect documents according to the following criteria:</p>

            <p>{task.topics[0].description}</p>

            <p> You will be redirect to SearchX soon!</p>
            <Timer start={new Date()} duration={constants.taskDescriptionWait} onFinish={this.onFinish} style={{fontSize: '2em'}} showRemaining={true}/>
         

        
        </div>
    
    }
}

export default TaskDescription1;