import './Puzzle.pcss'
import React from 'react';

import Search from "../../search/Search";
import Task from "./PuzzleTaskbar";

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';

import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";

////

function handleSessionStart() {
    log(LoggerEventTypes.SESSION_START, {
        time: new Date()
    });

    window.location.reload(true);
}

function handleSessionEnd() {
    log(LoggerEventTypes.SESSION_END, {
        time: new Date()
    });
}

export default class Puzzle extends React.Component {
    constructor() {
        super();
        this.state = {
            task: AccountStore.getTask()
        };

        this.handleOnBackButtonEvent = this.handleOnBackButtonEvent.bind(this);
        IntroStore.addFinishListener(handleSessionStart);
    }

    ////

    handleOnBackButtonEvent (e) {
        e.preventDefault();
        this.props.history.go();
    }

    componentDidMount() {
        if (!IntroStore.isIntroDone()) {
            IntroStore.startIntro();
        }

        window.onpopstate = this.handleOnBackButtonEvent;
    }

    ////

    render() {
        let style = {};
        if (!IntroStore.isIntroDone()) {
            style.position = 'relative'
        }

        return(
            <div className="Learning">
                <div className="Learning-medium">
                    <Search />
                </div>

                <div className="Learning-task" style={style}>
                    <Task description={this.state.task.topic.task} onSubmit={handleSessionEnd}/>
                </div>
            </div>
        );
    }
}
