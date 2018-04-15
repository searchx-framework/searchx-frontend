import React from "react";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import IntroStore from "../../../stores/IntroStore";
import constants from "./constants";
import Helpers from "../../../utils/Helpers";

class Wait extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timedOut: false,
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

        return <div>
            {this.state.timedOut ?
                <div className='message'>
                    <h2>Sorry, we were not able to find you a partner in time.</h2>
                    <h3>Thank you for taking part in our study.</h3>
                </div>
                :
                <div>
                    <h2>Waiting for your group members...</h2>
                    <h3>Please do not refresh this page. You may switch to other tabs or applications, we will notify you when you can start the task.</h3>
                </div>
            }
        </div>
    }

    onSync(data) {
        AccountStore.setTask(data.taskId, data.taskData);
        IntroStore.clearIntro();
        this.props.history.push('/pilot/session');
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