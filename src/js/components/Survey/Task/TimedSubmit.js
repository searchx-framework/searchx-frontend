import React from 'react';
import {Link} from 'react-router-dom';
import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import AccountScore from '../../../stores/AccountStore';

class TimedSubmit extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            elapsed: 0,
            duration: props.duration
        };

        this.tick = this.tick.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000);
    }

    componentWillUnmount () {
        clearInterval(this.timer);
    }

    ////

    tick(){
        this.setState({elapsed: new Date() - this.props.start});
    }

    padZero(num) {
        if (num < 10 && num >= 0) {
            return '0' + num;
        }
        return num;
    }

    clickHandler(){
        const metaInfo = {
            elapsedTime: Math.round(this.state.elapsed / 1000),
            type: AccountScore.getTaskType()
        };
        log(LoggerEventTypes.SURVEY_LEARNING_DONE, metaInfo);

        if (AccountScore.getTaskType() === "video") {
            AccountScore.setTaskType("search");
            this.props.history.push('/learning');
        }
    }

    ////

    render () {
        const elapsed = Math.round(this.state.elapsed / 1000);
        let minutes = Math.floor(elapsed/60);
        let seconds = elapsed-(minutes*60);

        const started = this.props.start !== 0;
        if (!started) {
            minutes = 0;
            seconds = 0;
        }

        let active = minutes < this.state.duration ? "disabled" : "active";
        if (AccountScore.getTaskType() === "video") {
            active = "active";
        }

        return (
            <div id="intro-counter">
                <div className="counter">
                    {minutes}:{this.padZero(seconds)}
                </div>

                <Link className={"btn btn-primary " + active} to={AccountScore.getTaskType() === "search" ? "/posttest": "/learning"} role="button" onClick={this.clickHandler}>
                    {AccountScore.getTaskType() === "video" ? "To Search Phase": "To Final Test"}
                </Link>

                {!started &&
                    <div>
                        <br/>
                        Finish the guide tour to start the counter. You may need to reload this page to restart the guide tour.
                    </div>
                }
            </div>
        )
    }
}

export default TimedSubmit;