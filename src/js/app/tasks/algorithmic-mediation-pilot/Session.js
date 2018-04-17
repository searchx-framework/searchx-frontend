import React from "react";
import {Link} from "react-router-dom";

import TaskedSession from "../components/session/TaskedSession";
import Timer from "../components/Timer";
import constants from "./constants";

import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";

class Session extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            start: false,
            finished: false,
        };

        this.onFinish = this.onFinish.bind(this);
    }

    componentDidMount() {
        const start = localStorage.getItem("timer-start") || Date.now();
        localStorage.setItem("timer-start", start);
        this.setState({
            start: start
        });
    }

    render() {
        const task = AccountStore.getTask();

        return (
            <TaskedSession>
                <div className="box" style={{marginBottom: '20px', textAlign: 'center'}}>
                    <Timer start={this.state.start} duration={constants.taskDuration} onFinish={this.onFinish} style={{fontSize: '2em'}}/>
                    <Link className={"btn btn-primary" + (this.state.finished ? '' : ' disabled')} to="/pilot/posttest" role="button">
                        To Final Test
                    </Link>
                </div>

                <div className="box" style={{flexGrow: '1'}}>
                    <h4 style={{textAlign: 'center'}}>Task Description</h4>
                    <hr/>
                        <p>
                        Imagine that you are a reporter for a newspaper. 
                        Your editor has just asked you and your colleague to search for documents 
                        in a collection of news articles to write stories about {task.data.topic.title}. 
                        </p>

                        <hr/>

                        <p> There's a meeting in an hour, so your editor need you and your colleague to spend 10 minutes 
                            in this task to search and save as many documents as possible. 
                        </p>

                        <p> To guarantee the quality of the documents, your editor, which will judge the documents later, 
                            requested that you use SearchX with this criteria:

                        </p>

                        <p> {task.data.topic.narrative} </p>
                </div>
        
            
        </TaskedSession>
        )
    }

    ////

    onFinish() {
        this.setState({
            finished: true
        });
    }
}

export default Session;