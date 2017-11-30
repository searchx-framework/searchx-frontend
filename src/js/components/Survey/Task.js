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
            task: this.props.task
        };
    }

    render () {
        return(
            <div className="Task row" id={this.state.task.topicId}>
                <div className="Task-submit no-padding">
                    <a className="btn btn-primary" href="/posttest" role="button">I'm done learning!</a>
                    {this.state.duration > 0 &&
                        <Counter userId={this.state.userId} topicId={this.state.task.topicId} minutes={this.state.task.duration} href="/posttest"/>
                    }
                </div>
                <div className="Task-info no-padding">
                    <div className="Task-info-instruction">You are provided with a custom search system that will help you learn about the subject. Please use it to find and read documents about:</div>
                    <div className="Task-info-title">{TaskStore.getTopicTitle(this.state.task.topicId)}</div>
                </div>
            </div>
        )
    }
}

export default Task;