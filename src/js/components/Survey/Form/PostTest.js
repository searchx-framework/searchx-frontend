import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log, flush} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import Alert from 'react-s-alert';

import config from '../../../config';


export default class PostTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            finish: false
        };

        this.handleComplete = this.handleComplete.bind(this);

        this.handleCutCopyPaste = this.handleCutCopyPaste.bind(this);

        this.handleCutCopyPasteDismute = this.handleCutCopyPasteDismute.bind(this);

        this.forceSetState = this.forceSetState.bind(this);
 
    }


    componentWillMount() {    
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }



    
    componentDidMount() {
        let finishedCode = localStorage.getItem("finishedCode");
        
        if (this.state.finish || finishedCode === null) {
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
        } 
    }

    handleVisibilityChange(){
        const metaInfo = {
            step : "posttest",
            hidden: document.hidden

        };
        log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
        if (document.hidden) {
            let finishedCode = localStorage.getItem("finishedCode");
            if (finishedCode === null) {

                var switchTabs = -1;
                if (localStorage.getItem("switchTabsPostTest") !== null) {
                    switchTabs = localStorage.getItem("switchTabsPostTest");
                }

                
                switchTabs++;
                localStorage.setItem("switchTabsPostTest", switchTabs);
                

                var times = '';
                if (switchTabs == 1) {
                    times = 'once.';
                } else if (switchTabs == 2) {
                    times = 'twice.';
                } else {
                    times = switchTabs + " times." 
                }
                Alert.error('We have noticited that you have tried to change to a different window/tab.', {
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

    componentDidUpdate() {
        let finishedCode = localStorage.getItem("finishedCode");
        
        if (this.state.finish || finishedCode !== null) {
            
            document.addEventListener('visibilitychange', function(){
                const metaInfo = {
                    step : "posttest",
                    hidden: document.hidden
    
                };
                log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
            })
        } 
    }


    forceSetState() {
        
        this.setState(this.state);
    }

    handleComplete(result){
        const metaInfo = {
            results: result.data
        };
        log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, metaInfo);

        AccountStore.clearTask();
        //localStorage.setItem("finishedCode", TaskStore.getFinishCode(AccountStore.getId()));
        localStorage.setItem("finishedCode", true);
        this.forceSetState();
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

    handleCutCopyPasteDismute(e){
        
    }



    render() {

        var switchTabs = localStorage.getItem("switchTabsPostTest") || 0;

        
        const userId = AccountStore.getId();
        let finishedCode = localStorage.getItem("finishedCode");
        if (this.state.finish || finishedCode !== null) {
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
        }  else if (switchTabs >= 3) {
            return (
                <div className="Survey">
                    <div className="Survey-form">
                        <div className='Survey-complete'>
                            <h2>We are sorry!</h2>
                            <h3>You have changed to a different tab/windows than three times, we have cancelled your participation.</h3>
                        </div>
                    </div>
                </div>
            );
        }
        
        
        else {

            const topicId = AccountStore.getTopicId();
        

            const data = TaskStore.getPostTest(userId, topicId);
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
}
