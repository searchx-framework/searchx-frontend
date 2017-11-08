import './Task.css';

import React from 'react';

var configuration = require('../../config');

class Task extends React.Component {    
    constructor() {
        super();
        this.state = {};
        this.setTaskData();
    }

    setTaskData() {
        fetch(configuration.taskFileLocation)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    id: data.id,
                    title: data.title,
                    instruction: data.instruction
                })
            })
    }

    render () {
        return(
            <div className="Task" id={this.state.id}>
                <div className="Task-title">{this.state.title}</div>
                <div className="Task-instruction">{this.state.instruction}</div>
            </div>
        )
    }
}

export default Task;