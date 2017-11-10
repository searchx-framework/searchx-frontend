import './Task.css';

import React from 'react';
import Counter from './Counter';

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

                if (task === undefined) {
                    this.setState({
                        taskId: taskId,
                        title: "Task Not Found",
                        instruction: "Invalid task id.",
                        duration: 0
                    })
                } else {
                    this.setState({
                        taskId: taskId,
                        title: task.title,
                        instruction: task.instruction,
                        duration: task.minutes
                    })
                }
            })
    }

    render () {
        return(
            <div className="Task row" id={this.state.id}>
                <div className="Task-submit no-padding">
                    <Counter userId={this.state.userId} taskId={this.state.taskId} minutes={this.state.duration} href={this.state.surveyUrl}/>
                    <a className="btn btn-primary" href={this.state.surveyUrl} role="button">Continue</a>
                </div>
                <div className="Task-info no-padding">
                    <div className="Task-info-title">{this.state.title}</div>
                    <div className="Task-info-instruction">{this.state.instruction}</div>
                </div>
            </div>
        )
    }
}

export default Task;