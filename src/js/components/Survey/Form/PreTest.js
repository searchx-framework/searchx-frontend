import './Form.css'

import React from 'react';
import Alert from 'react-s-alert';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';
import SyncStore from '../../../stores/SyncStore';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import config from '../../../config';

export default class PreTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isComplete: false
        };

        this.handleComplete = this.handleComplete.bind(this);
        this.handleSingleSetup = this.handleSingleSetup.bind(this);
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
        SyncStore.listenToGrouping((group) => {
            AccountStore.setGroup(group._id, group.members);
            this.handleTaskSetup(group.topic);
        });
    }

    ////

    handleComplete(result) {
        const metaInfo = {
            results: result.data
        };
        log(LoggerEventTypes.SURVEY_PRE_TEST_RESULTS, metaInfo);

        ////

        const scores = TaskStore.getScoresFromResults(result.data);

        if (AccountStore.isCollaborative()) {
            SyncStore.emitPretestScore(scores);
            this.setState({
                isComplete: true
            });

            sleep(config.groupTimeout * 60 * 1000).then(() => {
                SyncStore.emitGroupTimeout();
                this.handleSingleSetup(scores);
            });
        } else {
            this.handleSingleSetup(scores);
        }
    }

    handleSingleSetup(scores) {
        const topicId = scores[0].topicId;
        const topic = TaskStore.getTopicById(topicId);

        this.handleTaskSetup(topic);
    }

    handleTaskSetup(topic) {
        if(AccountStore.getTaskTopic() === '') {
            AccountStore.setTask(topic);
        }

        this.props.history.push('/learning')
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
