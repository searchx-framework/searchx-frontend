import React from "react";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import IntroStore from "../../../stores/IntroStore";
import SessionStore from "../../../stores/SessionStore";
import constants from "./constants";
import Helpers from "../../../utils/Helpers";

import './Pilot.pcss';
import Timer from "../components/Timer";
import {Button} from "react-bootstrap";
import {openSnake, closeSnake} from "./Snake";
import SearchActions from "../../../actions/SearchActions";

class Wait extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            timedOut: false,
            returnCode: Math.random().toString(36).substring(2, 10),
            open: false
        };

        this.onSwitchPage = this.onSwitchPage.bind(this);
        this.onSync = this.onSync.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.onTimeout = this.onTimeout.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
        this.handleUnload = this.handleUnload.bind(this);

        Helpers.sleep(constants.waitDuration * 60 * 1000).then(() => {
            this.setState({timedOut: true}, () => {
                this.onTimeout();
            });
        });
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('unload', this.handleUnload);
        window.addEventListener('popstate', this.handleUnload);

        SyncStore.listenToSyncData((data) => {
            this.setState({isReady: true});
            this.onSync(data);
        });

        const start = Date.now();
        this.setState({
            start: start
        });
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('unload', this.handleUnload);
        window.removeEventListener('popstate', this.handleUnload);
        this.handleUnload();
    }

    handleBeforeUnload(e) {
        if (!this.state.isReady) {
            const dialogText = 'Leaving this page will quit the task. Are you sure?';
            e.returnValue = dialogText;
            return dialogText;
        }
    }

    handleUnload() {
        if (!this.state.isReady) {
            this.onLeave();
        }
    }

    render() {
        return <div className="Wait waitBox">
            <div>
                <h2>Waiting for your group members...</h2>
                <h3>Time elapsed:</h3>
                <Timer start={this.state.start} duration={constants.waitDuration} onFinish={this.onFinish} style={{fontSize: '2em'}}/>
                <h4>Please do not refresh or close this page. If you turn on your audio you can switch to other tabs or applications, we will try to play a notification sound when you can start the task. Please check the tab again regularly, because the sound may not play in the background in some browsers.</h4>
                <h4>The task will start after your group forms. This may take a few minutes, at most {constants.waitDuration}.</h4>
                <h4>You can play Snake to pass the time if you want to:</h4>
                <Button onClick={() => {
                    if (!this.state.open){
                        openSnake();
                        log(LoggerEventTypes.SNAKE_OPEN, {});
                    } else {
                        closeSnake();
                        log(LoggerEventTypes.SNAKE_CLOSE, {});
                    }
                    this.setState({ open: !this.state.open })}
                }>
                    {this.state.open ? "Close Snake" : "Play Snake"}
                </Button>
                <div id="snake-container"/>
            </div>
        </div>
    }

    onSync(data) {
        SessionStore.setGroup(data._id, data.members);
        AccountStore.setTask(data.taskId, data.taskData);
        SearchActions.reset();
        IntroStore.clearIntro();
        closeSnake();
        SyncStore.stopListenToSyncData();

        log(LoggerEventTypes.SURVEY_GROUP_WAIT_FINISH, {
            step : "wait",
            state : this.state
        });

    
        this.props.history.replace({
            pathname: '/pilot/description1',
            state: { waited: true }
        });
    }

    onLeave() {
        log(LoggerEventTypes.SURVEY_EXIT, {
            step : "wait",
            state : this.state
        });

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }

    onTimeout() {
        log(LoggerEventTypes.SURVEY_GROUPING_TIMEOUT, {
            step : "wait",
            state: this.state
        });

        SyncStore.emitSyncTimeout();
    }

    onSwitchPage() {
        // Do nothing, since we allow switching tabs during the wait period
    }
}

export default Wait;