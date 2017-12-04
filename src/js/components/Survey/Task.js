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
        //var start = localStorage.getItem("counter-start") || Date.now();
        //localStorage.setItem("counter-start", start);
        var start = localStorage.getItem("counter-start") || 0;
        return(
            <div className="Task row" id={this.state.task.topicId} >
                <div className="Task-submit no-padding">
                    <Counter start={start} duration={this.state.task.duration}/>  
                </div>
                <div className="Task-info no-padding">
                    <div className="Task-info-instruction">Learn about this topic using our search system.</div>
                    <div className="Task-info-title" id="intro-topic">{TaskStore.getTopicTitle(this.state.task.topicId)}</div> 
                    <div className="Task-info-instruction"> You may need to several queries in order to learn more about this topic.</div> 
                    <div className="Task-info-instruction" id="intro-terms">These terms/phraes may help you to formulate your queries: <b>{TaskStore.getTopicTerms(this.state.task.topicId)} </b></div>

                </div>
            </div>
        )
    }
}

export default Task;