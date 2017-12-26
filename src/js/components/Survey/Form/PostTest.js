import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log, flush} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import $ from 'jquery'

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
        

        let finishedCode = localStorage.getItem("finishedCode") || '';
       
        if (this.state.finish || finishedCode === '') {
            
            document.addEventListener('visibilitychange', function(){
                const metaInfo = {
                    step : "posttest"

                };
                log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
                alert("We have noticited that you have tried to go to a different window. Please focus on completing the exercises.");
                
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
        this.setState({finish: true});
    }
        
        
    handleCutCopyPaste(e){
        e.preventDefault();
    }



    render() {
        const userId = AccountStore.getId();
        let finishedCode = localStorage.getItem("finishedCode") || '';
        if (this.state.finish || finishedCode) {
           
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
        } else {

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
