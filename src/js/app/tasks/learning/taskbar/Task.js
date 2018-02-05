import './Task.pcss';
import React from 'react';

import TimedSubmit from './TimedSubmit';
import LearningStore from '../LearningStore';
import AccountStore from "../../../../stores/AccountStore";

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

        let instructions = (<div>
            The professor requires all students to demonstrate what they learn about a particular topic by conducting searches online and presenting their views on the topic.
            To prepare your term paper, you need to collect and save all the web pages, publications, and other online sources that are helpful for you to write a paper.
            <hr/>
            After you have completed the search phase, you will be asked to complete 13 exercises;
            those exercises include questions about your term paper topic and the writing of an outline for your term paper.
        </div>);

        if (AccountStore.isCollaborative()) {
            instructions = (<div>
                The professor requires all students to demonstrate what they learn about a particular topic by collaboratively conducting searches online and presenting their views on the topic.
                To prepare your term paper, you and your partner need to collect and save all the web pages, publications, and other online sources that are helpful for you to write a paper.
                <hr/>
                After you and your partner have completed the search phase, you will be asked to complete 13 exercises;
                those exercises include questions about your term paper topic and the writing of an outline for your term paper.
                The exercises are to be finished individually (without your partner).
            </div>);
        }

        return(
            <div className="Task">
                <div className="Task-box timer">
                    <div className="Task-submit no-padding">
                        <TimedSubmit start={start} duration={this.state.task.duration}/>
                    </div>
                </div>

                <div className="Task-box instruction" id={this.state.task.topic.id}>
                    <div className="Task-title">
                        Task Description
                    </div>

                    <div className="Task-info no-padding" id="intro-description">
                        <div className="Task-instruction-specific">
                            <div dangerouslySetInnerHTML={{__html: LearningStore.getTopicDescription(this.state.task.topic)}} />
                        </div>

                        <hr/>

                        <div className="Task-instruction-general">
                            {instructions}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Task;