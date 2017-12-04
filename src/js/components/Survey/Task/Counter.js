import React from 'react';
import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';

class Counter extends React.Component {    

    constructor(props){
        super(props);

        this.state = {
            elapsed: localStorage.getItem("elapsed") || 0,
            duration: props.duration
        };

        this.tick = this.tick.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000);
    }

    componentWillUnmount () {
        localStorage.setItem("elapsed", this.state.elapsed);
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
        localStorage.setItem("elapsed", 0);
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

        if (this.props.start === 0) {
            minutes = 0;
            seconds = 0;
        }

        return (
            <div className="counter" id="intro-counter">
                {minutes}:{this.padZero(seconds)}
                {minutes >= this.state.duration &&
                    <a className="btn btn-primary" href="/posttest" role="button" onClick={this.clickHandler}>Final Test</a>
                }
            </div>
        )
    }
}

export default Counter;