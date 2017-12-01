import React from 'react';
import {log} from '../../logger/Logger';
import {LoggerEventTypes} from '../../constants/LoggerEventTypes';

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
        };

        return num;
    }

    clickHandler(){
        console.log('test');
        localStorage.setItem("elapsed", 0);

        var metaInfo = {
            elapsedTime: Math.round(this.state.elapsed / 1000)
        }
        log(LoggerEventTypes.SURVEY_LEARNING_DONE, metaInfo)
    }

    ////

    render () {
        var elapsed = Math.round(this.state.elapsed / 1000);
        var minutes = Math.floor(elapsed/60);
        var seconds = elapsed-(minutes*60);

        return (
            <div className={"counter"}>
                {minutes}:{this.padZero(seconds)}
                {minutes >= this.state.duration &&
                    <a className="btn btn-primary" href="/posttest" role="button" onClick={this.clickHandler}>I'm done learning!</a>
                }
            </div>
        )
    }
}

export default Counter;