import React from "react";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import IntroStore from "../../../stores/IntroStore";
import SessionStore from "../../../stores/SessionStore";
import constants from "./constants";
import Helpers from "../../../utils/Helpers";

import './Ecomm.pcss';
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
        window.removeEventListener('popstate', this.handleUnload);
        this.handleUnload();
    }

    handleBeforeUnload(e) {
        if (!this.state.isReady) {
            this.handleUnload();    
        }
    }

    handleUnload() {
        if (!this.state.isReady & localStorage.getItem("current-path") === '/ecomm/wait') {
            this.onLeave();
        }
    }

    render() {


        return <div className="Wait waitBox">
            <div>
                <h2>Waiting for your group members...</h2>
                <p>Please do not refresh or close this page. If you turn on your audio you can switch to other tabs or applications, we will try to play a notification sound when you can start the task. Please check the tab again regularly, because the sound may not play in the background in some browsers.</p>
                <p>The task will start after everyone in your group enters.</p>
            </div>
        </div>
    }

    onSync(data) {
        if (data.newUser === AccountStore.getUserId()) {
            SyncStore.emitSyncLeaveGroup();
            SessionStore.setGroup(data.newGroup._id, data.newGroup.members);
            AccountStore.setTask(data.newGroup.taskId, data.newGroup.taskData);
            SyncStore.emitUserJoinGroup(false);
        }
        else {
            SessionStore.setGroup(data._id, data.members);
            AccountStore.setTask(data.taskId, data.taskData);
            SearchActions.reset();
            IntroStore.clearIntro();
            SyncStore.stopListenToSyncData();

            log(LoggerEventTypes.SURVEY_GROUP_WAIT_FINISH, {
                step : "wait",
                state : this.state
            });
            localStorage.setItem("timer-start", Date.now());
            localStorage.setItem("current-path", '/ecomm/session');
            this.props.history.replace({
                pathname: '/ecomm/session',
                state: { waited: true }
            });
        }
    }

    onLeave() {
        log(LoggerEventTypes.SURVEY_EXIT, {
            step : "wait",
            state : this.state
        });

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
        //localStorage.setItem("invalid-user", true.toString());
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