import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log, flush} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import Alert from 'react-s-alert';


export default class PostTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            finish: false
        };
        this.handleComplete = this.handleComplete.bind(this);

        this.handleCutCopyPaste = this.handleCutCopyPaste.bind(this);
 
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
            if (finishedCode === null) {
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

                Alert.error('You may not get the payment if you continue changing to a different window/tab.', {
                    position: 'top-right',
                    effect: 'scale',
                    beep: true,
                    timeout: "none",
                    offset: 100
                });
            }

            var switchTabs = -1;
            if (localStorage.getItem("switchTabsPostTest") !== null) {
                switchTabs = localStorage.getItem("switchTabsPostTest");
            }
            let finishedCode = localStorage.getItem("finishedCode");
            
            if (finishedCode === null) {
                switchTabs++;
                localStorage.setItem("switchTabsPostTest", switchTabs);
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


    handleComplete(result){
        const metaInfo = {
            results: result.data
        };
        log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, metaInfo);

        AccountStore.clearTask();
        localStorage.setItem("finishedCode", TaskStore.getFinishCode(AccountStore.getId()));
    }
        
        
    handleCutCopyPaste(e){
        e.preventDefault();
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
                        <div className='Survey-complete'>
                            <h2>Thanks!</h2>
                            <h3>Please, copy and paste this code on CrowdFlower: {TaskStore.getFinishCode(AccountStore.getId())}</h3>
                        </div>
                    </div>
                </div>
            );
        }  else if (switchTabs >= 3) {
            return (
                <div className="Survey">
                    <div className="Survey-form">
                        <div className='Survey-complete'>
                            <h2>Sorry!</h2>
                            <h3>You have switched this experiment tab or experiment window more than three times, you have forfeited your payment.</h3>
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
