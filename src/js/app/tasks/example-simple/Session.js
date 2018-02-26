import React from "react";
import {Link} from "react-router-dom";
import TaskedSession from "../components/session/TaskedSession";
import constants from "./constants";

class Session extends React.PureComponent {
    render() {
        return (
            <TaskedSession collaborative={false}>
                <div className="box" style={{marginBottom: '20px', textAlign: 'center'}}>
                    <Link className={"btn btn-primary"} to="/simple/submit" role="button">
                        Submit Itinerary
                    </Link>
                </div>

                <div className="box" style={{flexGrow: '1'}}>
                    <h3 style={{textAlign: 'center'}}>Task Description</h3>
                    <hr/>
                    <p>Please search for more information regarding the travel destination "{constants.destination}"</p>
                </div>
            </TaskedSession>
        )
    }
}

export default Session;