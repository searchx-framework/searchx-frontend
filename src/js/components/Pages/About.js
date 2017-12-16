import React from 'react';
import './About.css'

import { subscribeToTimer } from '../../stores/SocketStore';

class About extends React.Component {
    constructor() {
        super();

        this.state = {
            timestamp: 'no timestamp yet'
        };
    }

    componentDidMount() {
        subscribeToTimer((err, timestamp) => this.setState({
            timestamp
        }));
    }

    render() {
        return (
            <div className="About">
                <div className="row text-center">
                    <div className="col-md-12">

                        <h1>About <img className="Logo" src='/img/searchx_logo.png'/> </h1>
                        <div className="Info" >
                            <p>
                                SearchX is a search interface developed by <a href="http://www.wis.ewi.tudelft.nl"> TU Delft's Web Information Systems group</a>.
                                If you have questions or issues please contact <a href="http://www.wis.ewi.tudelft.nl/moraes/">Felipe Moraes</a> at f.moraes@tudelft.nl.
                            </p>

                            This is the timer value: {this.state.timestamp}
                         </div>

                        <img className="TUDLogo" src='/img/TUDLogo.png'/>

                    </div>
                </div>
            </div>
        )
    }
}

export default About;