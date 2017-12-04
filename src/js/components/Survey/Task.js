import './Task.css';
import React from 'react';

import Counter from './Counter';
import TaskStore from '../../stores/TaskStore';

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
        let start = localStorage.getItem("counter-start") || 0;

        return(
            <div className="Task row" id={this.state.task.topicId} >
                <div className="Task-submit no-padding">
                    <Counter start={start} duration={this.state.task.duration}/>  
                </div>
                <div className="Task-info no-padding" id="intro-description">
                    <div className="Task-info-title"> Task Description </div>
                    <div className="Task-info-instruction">Imagine that you are enrolled in a <font size="3" color="red"> <b> {TaskStore.getCourseTitle(this.state.task.topicId)} </b> </font> course.</div>
                    <div className="Task-info-instruction">For the final test of the course, you need to summarize the meaning of key terms/phrases about <font size="5" color="red" id="intro-topic"> <b> {TaskStore.getTopicTitle(this.state.task.topicId)}.</b></font></div> 
                    <div className="Task-info-instruction"> <br/> To prepare yourself for the final, here are some key terms/phrases that you need to learn and search for them: </div>
                    <div  className="Task-info-instruction"> <font size="3" id="intro-terms"> <b>{TaskStore.getTopicTerms(this.state.task.topicId)} </b> </font> </div>
                  
                </div>
            </div>
        )
    }
}

export default Task;