import './Learning.pcss'
import React from 'react';

import Search from "../../search/Search";
import Video from "./video/Video";
import Task from "./taskbar/Task";

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';

import LearningStore from "./LearningStore";
import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";

////

class Learning extends React.Component {
    constructor() {
        super();
        this.state = {
            task: AccountStore.getTask()
        };

        this.handleOnIntroDone = this.handleOnIntroDone.bind(this);
        this.handleOnBackButtonEvent = this.handleOnBackButtonEvent.bind(this);
        IntroStore.addFinishListener(this.handleOnIntroDone);
    }

    ////

    handleOnIntroDone () {
        const start = localStorage.getItem("counter-start") || Date.now();
        localStorage.setItem("counter-start", start);

        log(LoggerEventTypes.SURVEY_LEARNING_START, {
            start: start,
            step: this.state.task.type
        });

        window.location.reload(true);
    }

    handleOnBackButtonEvent (e) {
       e.preventDefault();
       this.props.history.go();
    }

    ////

    componentWillMount() {
        const task = AccountStore.getTask();
        let medium = <Search/>;

        if (task.type === 'video') {
            medium = <Video/>;
        }

        if (task.type === 'both') {
            medium =
                <div>
                    <Video/>
                    <hr/>
                    <Search/>
                </div>;
        }

        this.state.task = task;
        this.state.medium = medium;
    }

    componentDidMount() {
        if (this.state.task.topic !== '') {
            if (!IntroStore.isIntroDone()) {
                IntroStore.startIntro();
            }
        }

        window.onpopstate = this.handleOnBackButtonEvent;
    }

    ////

    render() {
        if (this.state.task.topic === '' || LearningStore.isOverSwitchTabsLimit()) {
            return (
                <div/>
            );
        }

        ////

        let style = {};
        if (!IntroStore.isIntroDone()) {
            style.position = 'relative'
        }

        return(
            <div className="Learning">
                <div className="Learning-medium">
                    {this.state.medium}
                </div>

                <div className="Learning-task" style={style}>
                    <Task task={this.state.task}/>
                </div>
            </div>
        );
    }
}

export default Learning;
