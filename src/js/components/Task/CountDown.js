import React from 'react';

class CountDown extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            time: {},
            url: ""
        }

        this.countDown = this.countDown.bind(this);
        this.timer = setInterval(this.countDown, 1000);

        if (this.props.href !== undefined) {
            this.state.url = this.props.href;
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            seconds: nextProps.minutes * 60
        });
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
        if (num < 10) {
            return '0' + num
        };

        return num;
    }

    countDown() {
        let seconds = this.state.seconds - 1;

        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });
        
        if (seconds == 0) { 
            clearInterval(this.timer);
            
            if (this.state.url !== "") {
                window.location.href = this.state.url;
            }
        }
    }

    /* ---- */

    render () {
        return(
            <div className="countdown">
                {this.padZero(this.state.time.m)}:{this.padZero(this.state.time.s)}
            </div>
        )
    }
}

export default CountDown;