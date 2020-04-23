import React from "react";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import IntroStore from "../../../stores/IntroStore";
import SessionStore from "../../../stores/SessionStore";
import constants from "./constants";
import Helpers from "../../../utils/Helpers";

import './RoleBased.pcss';
import Timer from "../components/Timer";
import {Button} from "react-bootstrap";
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
       // window.addEventListener('unload', this.handleUnload);
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
    //    window.removeEventListener('unload', this.handleUnload);
        window.removeEventListener('popstate', this.handleUnload);
        this.handleUnload();
    }

    handleBeforeUnload(e) {
        if (!this.state.isReady) {
            this.handleUnload();    
            // const dialogText = 'Leaving this page will quit the task. Are you sure?';
            // e.returnValue = dialogText;
            // return dialogText;
        }
    }

    handleUnload() {
        if (!this.state.isReady & localStorage.getItem("current-path") === '/role-based/wait') {
            this.onLeave();
        }
    }

    render() {

        // if (localStorage.getItem("current-path") !== '/role-based/wait') {
        //     this.props.history.replace({
        //         pathname: localStorage.getItem("current-path")
        //     });
        // }

        // if (localStorage.getItem("invalid-user") === "true") {
        //     this.props.history.replace({
        //         pathname: '/disq'
        //     });
        // }

        const Tetris = <iframe title="Tetris" scrolling="yes"
        frameBorder="0" className="Tetris"
        src={`${process.env.REACT_APP_TETRIS}`} height>
        </iframe>

        return <div className="Wait waitBox">
            <div>
                <h2>Waiting for your group members...</h2>
                <h3>Time elapsed :
                <Timer start={this.state.start} duration={constants.waitDuration} onFinish={this.onFinish} style={{fontSize: '2em'}}/></h3>
                <p>Please do not refresh or close this page. If you turn on your audio you can switch to other tabs or applications, we will try to play a notification sound when you can start the task. Please check the tab again regularly, because the sound may not play in the background in some browsers.</p>
                <p>The task will start after your group forms. This may take a few minutes, at most {constants.waitDuration}. If we do not find a group for you, you will do the task alone.</p>
                <p>You can play Tetris to pass the time if you want to:</p>
                <Button onClick={() => {
                    if (!this.state.open){
                        log(LoggerEventTypes.TETRIS_OPEN, {});
                    } else {
                        log(LoggerEventTypes.TETRIS_CLOSE, {});
                    }
                    this.setState({ open: !this.state.open })}
                }>
                    {this.state.open ? "Close Tetris" : "Play Tetris"}
                </Button>
                {this.state.open ? Tetris : <div/> }
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

            localStorage.setItem("current-path", '/role-based/description');
            this.props.history.replace({
                pathname: '/role-based/description',
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