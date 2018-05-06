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

const metaInfo = {
};


class TaskDescription1 extends React.Component {

    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }



    componentDidMount(){
        const groupId = localStorage.getItem("group-id");
        const task = AccountStore.getTaskData();
        AccountStore.setSessionId(groupId+"-"+ task.topics[2].id);
        log(LoggerEventTypes.TASK_DESCRIPTION_LOAD,metaInfo);
    }


    handleOnClick(e) {
        localStorage.setItem("timer-start", Date.now());
        log(LoggerEventTypes.TASK_DESCRIPTION_CONTINUE,metaInfo);
    }

    render() {
        const task = AccountStore.getTaskData();
    
        return <div className="Wait waitBox"> 

            <p> <strong> Please read your next task description:</strong> </p>
            
            <p> Imagine you are a reporter for a newspaper. Your editor has just asked you and your colleagues to gather documents
        from a collection of news articles to write a story about <strong>{task.topics[2].title}</strong>.</p> 
        
        <p>There's a meeting in an hour, so your editor asks you and your colleagues to spend 10 minutes together and search
                    for and <strong>save as many useful documents as possible</strong>.</p>

        <p>To guarantee the quality of the documents, your editor, who will look over the collected resources in the end,
                    requests that you use a collaborative search system (SearchX).</p>

         <p>Collect documents according to the following criteria:</p>

        <p>{task.topics[2].description}</p>

         <Link to="/pilot/session3">
            <button type="button" onClick={this.handleOnClick} >
                Continue
            </button>
        </Link>

        
        </div>
    
    }
}

export default TaskDescription1;