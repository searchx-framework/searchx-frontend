import React from 'react';

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";
import TaskBarWindow from "./TaskBarWindow";
import {Button} from "react-bootstrap";
import './TaskBar.pcss';

export default class TaskBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popup: false
        };
        this.popupHandler = this.popupHandler.bind(this);
    }

    
    render() {

        return ( 
            <div>
                <Button variant="light" className="taskDescriptionButton" bssize="s" onClick={this.popupHandler}>Task Description</Button>
                
                <TaskBarWindow
                active={this.state.popup}
                taskDescription={this.props.taskDescription}
                closeHandler={this.popupHandler}
            />
            </div>
 

        )
    }


    popupHandler() {
        const metaInfo = {
        };
        if (this.state.popup) {
            log(LoggerEventTypes.TASK_OPEN, metaInfo);
        } else {
            log(LoggerEventTypes.TASK_CLOSE, metaInfo);
        }
        this.setState({
            popup: !this.state.popup
        });
    }
}