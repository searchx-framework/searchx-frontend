import './Form.css'

import React from 'react';
import Alert from 'react-s-alert';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';
import SyncStore from '../../../stores/SyncStore';

import {log_and_go, log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import config from '../../../config';

export default class PreTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isComplete: false
        };

        this.handleComplete = this.handleComplete.bind(this);
        this.handleTaskSetup = this.handleTaskSetup.bind(this);
        this.handleCutCopyPaste = this.handleCutCopyPaste.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    ////

    componentWillMount() {    
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }

    componentDidMount() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        SyncStore.listenToTopicId((topicId) => this.handleTaskSetup(topicId));
    }

    ////

    handleComplete(result) {
        const metaInfo = {
            results: result.data
        };
        log(LoggerEventTypes.SURVEY_PRE_TEST_RESULTS, metaInfo);

        ////

        const scores = TaskStore.getScoresFromResults(result.data);
        const newState = {
            isComplete: true,
            scores: scores
        };

        SyncStore.emitPretestScore(scores);
        this.setState(newState, () => {
            sleep(config.groupTimeout * 60 * 1000).then(() => {
                SyncStore.emitGroupTimeout();
            });
        });
    }

    handleTaskSetup(topicId) {
        if (AccountStore.getTopicId() === '' && this.state.scores) {
            if (topicId === '-1') {
                topicId = TaskStore.getMinScoreIndex(this.state.scores);
                AccountStore.clearGroup();
            }

            const type = 'search';
            const minutes = 20;
            AccountStore.setTask(topicId, type, minutes);

            this.props.history.push('/learning')
        }
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
        const metaInfo = {
            step : "pretest",
            hidden: document.hidden
        };
        log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);

        ////

        if (document.hidden) {
            let switchTabs = -1;
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

            Alert.error('Please, focus on completing the final test.', {
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
                window.location.reload();
            }
        }
    }

    ////

    render() {
        if (this.state.isComplete) {
            document.removeEventListener("visibilitychange", this.handleVisibilityChange);

            return (
                <div className="Survey">
                    <div className="Survey-form">
                        <div className='Survey-complete'>
                            <h2>Waiting for other members...</h2>
                            <h3>You have been assigned to a collaborative search experiment. We are still waiting for your partners to finish the Pretest.</h3>
                            <h3>If after {config.groupTimeout} minutes there is still no update, we will fallback to a single user experiment. Please do not close this page.</h3>
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

        const data = TaskStore.getPreTest();
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

const sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};
