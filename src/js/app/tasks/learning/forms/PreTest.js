import './Forms.pcss'

import React from 'react';
import Alert from 'react-s-alert';
import * as Survey from 'survey-react';

import LearningStore from '../LearningStore';
import AccountStore from '../../../../stores/AccountStore';
import SyncStore from '../../../../stores/SyncStore';
import IntroStore from "../../../../stores/IntroStore";

import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../utils/LoggerEventTypes';
import config from '../../../../config';
import Helpers from "../../../../utils/Helpers";

export default class PreTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isComplete: false,
            sessionReady: false,
            partnerJoined: false,
            timedOut: false
        };

        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
        this.handleUnload = this.handleUnload.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
        this.handleTimeout = this.handleTimeout.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.handleTaskSetup = this.handleTaskSetup.bind(this);
    }

    ////

    componentWillMount() {
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }

    componentDidMount() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('unload', this.handleUnload);
        window.addEventListener('popstate', this.handleLeave);

        SyncStore.emitPretestStart();

        SyncStore.listenToGrouping((group) => {
            AccountStore.setGroup(group._id, group.members);
            this.handleTaskSetup(group.topic);
        });

        SyncStore.listenToGroupPretestStart(() => {
            if (this.state.isComplete) {
                this.setState({partnerJoined: true});
                Helpers.sleep(config.groupTimeout * 60 * 1000).then(this.handleTimeout);
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('unload', this.handleUnload);
        window.removeEventListener('popstate', this.handleLeave);
        this.handleUnload();
    }

    ////

    handleTimeout() {
        if (!this.state.sessionReady) {
            window.removeEventListener('beforeunload', this.handleBeforeUnload);
            this.setState({timedOut: true}, () => {
                SyncStore.emitPretestLeave();

                log(LoggerEventTypes.SURVEY_GROUPING_TIMEOUT, {
                    state: this.state
                });
            });
        }
    }

    handleBeforeUnload(e) {
        if (!this.state.sessionReady) {
            const dialogText = 'Changes you made may not be saved. Are you sure?';
            e.returnValue = dialogText;
            return dialogText;
        }
    }

    handleUnload(e) {
        if (!this.state.sessionReady) {
            this.handleLeave(e);
        }
    }

    handleLeave() {
        SyncStore.emitPretestLeave();
        LearningStore.clearTopics();

        log(LoggerEventTypes.SURVEY_EXIT, {
            step : "pretest",
            state : this.state
        });
    }

    ////

    handleComplete(result) {
        const results = result.data;
        log(LoggerEventTypes.SURVEY_PRE_TEST_RESULTS, {
            results: results
        });

        SyncStore.emitPretestSubmit(results);
        this.setState({isComplete: true});

        Helpers.sleep(config.groupTimeout * 60 * 1000).then(() => {
            if (!this.state.partnerJoined) this.handleTimeout()
        });
    }

    handleTaskSetup(topic) {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('unload', this.handleUnload);
        window.removeEventListener('popstate', this.handleLeave);

        IntroStore.clearIntro();
        AccountStore.setTask(topic);

        this.setState({sessionReady: true}, () => {
            Helpers.sleep(500).then(() => {
                this.props.history.push('/learning');
            });
        });
    }

    handleCutCopyPaste(e){
        Alert.warning('You cannot copy and paste in this step.', {
            position: 'top-right',
            effect: 'scale',
            beep: true,
            timeout: "none",
            offset: 100
        });

        e.preventDefault();
    }

    handleVisibilityChange() {
        log(LoggerEventTypes.WINDOW_CHANGE_VISIBILITY, {
            step : "pretest",
            hidden: document.hidden
        });

        ////

        if (document.hidden) {
            let switchTabs = 0;
            if (localStorage.getItem("switch-tabs-pretest") !== null) {
                switchTabs = localStorage.getItem("switch-tabs-pretest");
            }

            switchTabs++;
            localStorage.setItem("switch-tabs-pretest", switchTabs);

            let times = '';
            if (switchTabs === 1) {
                times = 'once.';
            } else if (switchTabs === 2) {
                times = 'twice.';
            } else {
                times = switchTabs + " times."
            }

            Alert.error('We have noticed that you have tried to change to a different window/tab.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none",
                offset: 100
            });

            Alert.error('Please, focus on completing the diagnostic test.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none",
                offset: 100
            });

            Alert.error('Remember that more than three tab changes result in non-payment. So far you have changed tabs ' + times, {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none",
                offset: 100
            });

            if (switchTabs >= 3) {
                SyncStore.emitPretestLeave();
                window.location.reload();
            }
        }
    }

    ////

    render() {
        if (!LearningStore.isTopicsPresent()) {
            this.props.history.push('/register');
            this.props.history.go();
        }

        if (this.state.isComplete) {
            document.removeEventListener("visibilitychange", this.handleVisibilityChange);

            if (this.state.sessionReady) {
                return (
                    <div className="Survey">
                        <div className="Survey-form">
                            <div className='Survey-complete'>
                                <h2>Starting session...</h2>
                            </div>
                        </div>
                    </div>
                )
            }

            return (
                <div className="Survey">
                    <div className="Survey-form">
                        <div className='Survey-complete'>
                            <h2>Waiting for another Prolific worker to join...</h2>
                            <h3>You will be doing a collaborative search study. We are still waiting for your partner to join.</h3>
                            <h3>Please do not refresh/exit this page yet.</h3>
                            <h3>If after {config.groupTimeout} minutes there is still no update, please stop the study.</h3>
                            <h3>Once you drop out after waiting, we will provide you with a partial payment for completing the Diagnostic test.</h3>
                            {this.state.partnerJoined &&
                                <div>
                                    <hr/>
                                    <h2>Your partner has just started their pretest...</h2>
                                    <h3>Please wait a bit longer :)</h3>
                                </div>
                            }
                            {this.state.timedOut &&
                                <div>
                                    <hr/>
                                    <h2>Sorry, we weren't able to find you a partner in time.</h2>
                                    <h3>PLEASE <b>stop the study without completion</b> (option 'Stop without completing').
                                        We will still provide you with a partial payment through the bonus payment system.</h3>
                                    <h3>DO NOT submit a completion (option 'I've finished' or 'Submit study'),
                                        or else we would have to reject your completion (which would decrease your rating).</h3>
                                    <h3>Thank you for taking part in our study.</h3>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            );
        }

        ////

        const switchTabs = localStorage.getItem("switch-tabs-pretest") || 0;
        if (switchTabs >= 3) {
            return (
                <div className="Survey">
                    <div className="Survey-form">
                        <div className='Survey-complete'>
                            <h2>Sorry!</h2>
                            <h3>You have changed to a different tab/windows than three times, we have cancelled your participation, we will not pay you.</h3>
                        </div>
                    </div>
                </div>
            );
        }

        ////

        const data = LearningStore.getPreTest();
        let survey = new Survey.Model(data);

        survey.requiredText = "";
        survey.onComplete.add(this.handleComplete);

        return (
            <div className="Survey" >
                <div className="Survey-form" onPaste={this.handleCutCopyPaste} onCut={this.handleCutCopyPaste} onCopy={this.handleCutCopyPaste} >
                    <Survey.Survey model={survey}/>
                </div>
            </div>
        );
    }
}