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
            timedOut: false,
            returnCode: Math.random().toString(36).substring(2, 10)
        };


        this.onSwitchPage = this.onSwitchPage.bind(this);
        this.onSync = this.onSync.bind(this);
        this.onLeave = this.onLeave.bind(this);

        Helpers.sleep(constants.waitDuration * 60 * 1000).then(() => {
            this.setState({timedOut: true}, () => {
                this.onLeave();
            });
        });
    }

    componentDidMount() {
        SyncStore.listenToSyncData((data) => {
            this.onSync(data);
        });
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

    onSwitchPage() {
        // TODO: add desktop notification, or disallow switching
        // Do nothing, since we allow switching tabs during the wait period
    }
}

export default Wait;