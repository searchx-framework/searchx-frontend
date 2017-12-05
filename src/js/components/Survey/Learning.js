import './Survey.css'
import React from 'react';

import Account from "../../stores/AccountStore";
import Search from "../Search/Search";
import Video from "../Video/Video";
import Task from "./Task/Task";

////

class Learning extends React.Component {
    render() {
        const task = {
            topicId: Account.getTopicId(),
            type: Account.getTaskType(),
            duration: Account.getTaskDuration()
        };

        let medium = <Search/>;
        if (task.type === 'video') medium = <Video/>;
        if (task.type === 'both') medium = (
            <div>
                <Video/>
                <hr/>
                <Search/>
            </div>
        );

        ////

        let test = true;
        test = false;

        return(
            <div className="Learning row">
                <div className="Learning-medium col-md-9">
                    {!test && medium}
                </div>

                <div className="Learning-task col-md-3">
                    {!test && <Task task={task}/>}
                </div>
            </div>
        );
    }
}

export default Learning;