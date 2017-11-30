import React from 'react';
import {log} from '../../logger/Logger';
import {LoggerEventTypes} from '../../constants/LoggerEventTypes';

class Counter extends React.Component {    


    constructor(props){

        // This is called before our render function. The object that is 
        // returned is assigned to this.state, so we can use it later.
        // get from localstorage

        super(props);
        
        this.state = {
            elapsed: localStorage.getItem("elapsed") || 0,
        };

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000);
    }

    componentWillUnmount () {
        localStorage.setItem("elapsed", this.state.elapsed);
        clearInterval(this.timer);
    }

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
        var metaInfo = {
            elapsedTime: Math.round(this.state.elapsed / 1000)
        }
        log(LoggerEventTypes.SEARCHRESULT_DONE, metaInfo)
    }

    render () {

        var elapsed = Math.round(this.state.elapsed / 1000);

        // This will give a number with one digit after the decimal dot (xx.x):
                        // Although we return an entire <p> element, react will smartly update
        // only the changed parts, which contain the seconds variable.
       

        var minutes = Math.floor(elapsed/60);
 
        var seconds =  elapsed-(minutes*60);

        return (
            <div className={"counter"}>
                {minutes > this.props.taskDuration ? <a className="btn btn-primary" href="/posttest" role="button" onClick={this.clickHandler()}>I'm done learning!</a> : ""}
                {minutes}:{this.padZero(seconds)}
            </div>
        )
    }
}

export default Counter;