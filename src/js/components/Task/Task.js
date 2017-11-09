import './Task.css';

import React from 'react';
import CountDown from './CountDown';

var configuration = require('../../config');

class Task extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            surveyUrl: configuration.surveyUrl
        };

        this.setTaskData(this.props.taskId);
    }

    setTaskData(taskId) {
        fetch(configuration.taskFileLocation)
            .then(res => res.json())
            .then(data => {
                let task = data[taskId];
                this.setState({
                    taskId: taskId,
                    title: task.title,
                    instruction: task.instruction,
                    duration: task.minutes
                })
            })
    }

    render () {
        return(
            <div className="Task row" id={this.state.id}>
                <div className="Task-info col-xs-10 no-padding">
                    <div className="Task-title">{this.state.title}</div>
                    <div className="Task-instruction">{this.state.instruction}</div>
                </div>
                <div className="col-xs-2 no-padding">
                    <CountDown minutes={this.state.duration} href={this.state.surveyUrl}/>
                    <a className="btn btn-primary" href={this.state.surveyUrl} role="button">Continue</a>
                </div>
            </div>
        )
    }
}

export default Task;