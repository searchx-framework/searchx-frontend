import './Task.css';
import React from 'react';

import TimedSubmit from './TimedSubmit';
import TaskStore from '../../../stores/TaskStore';

class Task extends React.Component {    

    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            task: this.props.task
        };
    }

    render () {
        let start = localStorage.getItem("counter-start") || 0;

        return(
            <div className="Task row" id={this.state.task.topicId} >
                <div className="Task-title">
                    Task Description
                </div>

                <hr/>

                <div className="Task-info no-padding" id="intro-description">
                    <div className="Task-instruction">
                        Imagine that you are enrolled in a <font size="3" color="orangered"> <b>{TaskStore.getCourseTitle(this.state.task.topicId)}</b> </font> course.
                        For the final test of the course, you need to summarize the meaning of key terms/phrases about
                        <font size="3" color="orangered" id="intro-topic"><b> {TaskStore.getTopicTitle(this.state.task.topicId)}</b></font>.
                    </div>
                    <br/>

                    <div className="Task-instruction">
                        To prepare yourself for the final test, here are some key terms/phrases that you need to learn.
                        We have provided a learning tool to the left to help you in studying.
                    </div>
                    <br/>

                    <div className="Task-instruction">
                        <font size="3" id="intro-terms"> <b>{TaskStore.getTopicTerms(this.state.task.topicId)}</b> </font>
                    </div>
                </div>

                <hr/>

                <div className="Task-info no-padding">
                    <b>Notes:</b>

                    <div>- We will provide a <b>bonus</b> based on your performance.</div>
                    <div>- Please <b>do not</b> use external resources and search engines.</div>
                </div>

                <hr/>

                <div className="Task-submit no-padding">
                    <TimedSubmit start={start} duration={this.state.task.duration}/>
                </div>
            </div>
        )
    }
}

export default Task;