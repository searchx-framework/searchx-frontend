import React from 'react';

class Counter extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            time: {},
            url: "",
            topic: props.topicId,
            duration: props.minutes * 60,
            seconds: this.getSeconds(props)
        }

        this.countDown = this.countDown.bind(this);
        this.timer = setInterval(this.countDown, 1000);

        if (this.props.href !== undefined) {
            this.state.url = this.props.href;
        }
    }

    getSeconds(nextProps) {
        let prevUser = localStorage.getItem("count-user");
        let prevTopic = localStorage.getItem("count-topic");
        let prevSecs = localStorage.getItem("count-seconds");

        if (prevUser !== null && prevTopic !== null && prevSecs !== null) {
            if (prevUser == nextProps.userId && prevTopic == nextProps.topicId && !isNaN(prevSecs)) {
                return prevSecs
            }
        }

        localStorage.setItem("count-user", nextProps.userId);
        localStorage.setItem("count-topic", nextProps.topicId);

        return nextProps.minutes * 60;
    }

    /* ---- */

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));
    
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
    
        let time = {
            "m": minutes + hours*60,
            "s": seconds
        };

        return time;
    }

    padZero(num) {
        if (num < 10 && num >= 0) {
            return '0' + num;
        };

        return num;
    }

    countDown() {
        let seconds = this.state.seconds - 10;
        let displaySeconds = this.state.duration - seconds;
        localStorage.setItem("count-seconds", seconds);

        this.setState({
            time: this.secondsToTime(displaySeconds),
            seconds: seconds,
        });
        
        if (seconds <= 0) { 
            clearInterval(this.timer);
            
            if (this.state.url !== "") {
                window.location.href = this.state.url;
            }
        }
    }

    /* ---- */

    render () {
        let classes = !this.state.seconds || this.state.seconds <= 0 ? " invisible" : "";

        return (
            <div className={"counter" + classes}>
                {this.padZero(this.state.time.m)}:{this.padZero(this.state.time.s)}
            </div>
        )
    }
}

export default Counter;