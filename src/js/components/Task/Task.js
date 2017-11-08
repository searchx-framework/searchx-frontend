import './Task.css';

import React from 'react';
import CountDown from './CountDown';

var configuration = require('../../config');

class Task extends React.Component {    
    constructor() {
        super();
        this.state = {
            surveyUrl: configuration.surveyUrl
        };
        this.setTaskData();
    }

    setTaskData() {
        fetch(configuration.taskFileLocation)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    id: data.id,
                    title: data.title,
                    instruction: data.instruction,
                    duration: data.minutes
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