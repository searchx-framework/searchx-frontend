import './Form.css'

import React from 'react';
import Alert from 'react-s-alert';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import config from '../../../config';

export default class PostTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isComplete: localStorage.getItem('finish') === 'true'
        };

        this.handleComplete = this.handleComplete.bind(this);
        this.handleCutCopyPaste = this.handleCutCopyPaste.bind(this);
    }

    ////

    componentWillMount() {
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }

    componentDidMount() {
        if (!this.state.isComplete) {
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
        }
    }

    componentDidUpdate() {
        if (this.state.isComplete) {
            document.addEventListener('visibilitychange', function(){
                const metaInfo = {
                    step : "posttest",
                    hidden: document.hidden
                };
                log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
            })
        }
    }

    ////

    handleComplete(result){
        const metaInfo = {
            results: result.data
        };
        log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, metaInfo);

        AccountStore.clearTask();
        localStorage.setItem('finish', true);

        this.setState({
            isComplete: true
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

    handleVisibilityChange(){
        const metaInfo = {
            step : "posttest",
            hidden: document.hidden

        };
        log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);

        ////

        if (document.hidden) {
            let switchTabs = 0;
            const finish = localStorage.getItem("finish");

            if (finish === null){
                if (localStorage.getItem("switch-tabs-posttest") !== null) {
                    switchTabs = localStorage.getItem("switch-tabs-posttest");
                }

                switchTabs++;
                localStorage.setItem("switch-tabs-posttest", switchTabs);

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
            }

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
                        <div className='Survey-complete' onCopy={this.handleCutCopyPasteDismute}>
                            <h2>Thanks for your participation!</h2>
                            <h3>Follow this <a href={config.completionURL}> link</a> back to Prolific Academic to confirm your participation.</h3>
                        </div>
                    </div>
                </div>
            );
        }

        ////

        const switchTabs = localStorage.getItem("switch-tabs-posttest") || 0;
        if (switchTabs >= 3) {
            return (
                <div className="Survey">
                    <div className="Survey-form">
                        <div className='Survey-complete'>
                            <h2>We are sorry!</h2>
                            <h3>You have changed to a different tab/windows more than three times, we have cancelled your participation.</h3>
                        </div>
                    </div>
                </div>
            );
        }

        ////

        if (AccountStore.getTaskTopic() === '') {
            return <div/>;
        }

        ////

        const data = TaskStore.getPostTest();
        const survey = new Survey.Model(data);

        survey.requiredText = "";
        survey.onComplete.add(this.handleComplete);

        return (
            <div className="Survey">
                <div className="Survey-form" onPaste={this.handleCutCopyPaste} onCut={this.handleCutCopyPaste} onCopy={this.handleCutCopyPaste}>
                    <Survey.Survey model={survey} onValidateQuestion={TaskStore.surveyValidateWordCount}/>
                </div>
            </div>
        );
    }
}
