import './Task.css';
import React from 'react';

import Counter from './Counter';
import TaskStore from '../../stores/TaskStore';

var configuration = require('../../config');


class Task extends React.Component {    

    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            taskId: this.props.taskId,

        };
    }

    render () {
        return(
            <div className="Task row" id={this.state.id}>
                <div className="Task-submit no-padding">
                    <Counter userId={this.state.userId} taskId={TaskStore.getTopicTitle(this.state.taskId)} minutes={this.state.duration} href={this.state.surveyUrl}/>
                    <a className="btn btn-primary" href="/posttest" role="button">I'm done learning!</a>
                </div>
                <div className="Task-info no-padding">
                    
                    <div className="Task-info-instruction">You are provided with a custom search system that will help you learn about the subject. Please use it to find and read documents about:</div>
                    <div className="Task-info-title">{TaskStore.getTopicTitle(this.state.taskId)}</div>
                </div>
            </div>
        )
    }
}

export default Task;