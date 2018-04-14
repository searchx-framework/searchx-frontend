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
                    <h3 style={{textAlign: 'center'}}>Task Description</h3>
                    <hr/>

                    <p>
                        Explanation of topic here:
                    </p>

                    <p dangerouslySetInnerHTML={{__html: task.data.topic.description}}/>
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