import React from 'react';
import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';

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
            elapsedTime: Math.round(this.state.elapsed / 1000)
        };
        log(LoggerEventTypes.SURVEY_LEARNING_DONE, metaInfo);
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
       
        //const active = minutes < this.state.duration ? "disabled" : "active";
        const active = "active";
        
        return (
            <div id="intro-counter">
                <div className="counter">
                    {minutes}:{this.padZero(seconds)}
                </div>
                <a className={"btn btn-primary " + active} href="/posttest" role="button" onClick={this.clickHandler}>
                    To Final Test
                </a>
                {!started &&
                    <div>
                        <br/>
                        Finish the introduction to start the counter.
                    </div>
                }
            </div>
        )
    }
}

export default TimedSubmit;