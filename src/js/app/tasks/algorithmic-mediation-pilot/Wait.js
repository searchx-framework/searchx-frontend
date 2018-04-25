import React from "react";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import IntroStore from "../../../stores/IntroStore";
import constants from "./constants";
import Helpers from "../../../utils/Helpers";

import './Pilot.pcss';

class Wait extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            timedOut: false,
            returnCode: Math.random().toString(36).substring(2, 10)
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
            this.state.isReady = true;
            this.onSync(data);
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
            const dialogText = 'Leaving this page will quit the task, and cancel your payment. Are you sure?';
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
        const task = AccountStore.getTaskData();

        return <div className="Wait">
            {this.state.timedOut ?
                <div className='message'>
                    <h2>Sorry, we were not able to find you a partner in time.</h2>
                    <h3>Thank you for taking part in our study.</h3>
                    <h3> Use this code on Amazon MTurk:  {this.state.returnCode} +  </h3>
                </div>
                :
                <div>
                    <h2>Waiting for your group members...</h2>
                    <h3>Please do not refresh or close this page. If you turn on your audio you can switch to other tabs or applications, we will play a notification sound you when you can start the task.</h3>
                </div>
            }
        </div>
    }

    onSync(data) {
        AccountStore.setTask(data.taskId, data.taskData);
        IntroStore.clearIntro();

        log(LoggerEventTypes.SURVEY_GROUP_WAIT_FINISH, {
            step : "wait",
            state : this.state
        });

        this.props.history.push({
            pathname: '/pilot/session',
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

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }

    onSwitchPage() {
        // Do nothing, since we allow switching tabs during the wait period
    }
}

export default Wait;