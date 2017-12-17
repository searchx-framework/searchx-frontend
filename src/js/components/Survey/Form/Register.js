import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';

export default class Register extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {    
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }

    componentDidMount(){

        document.addEventListener('visibilitychange', function(){
            const metaInfo = {
                step : "register"

            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
            alert("We have noticited that you try to move to a new tab. Please focus on your task.");
            
        })

    }

    ////

    render() {  
        const data = TaskStore.getRegisterInfo();
        let survey = new Survey.Model(data);

        survey.requiredText = "";

        survey.onComplete.add(function(result) {
            const userId = TaskStore.getUserIdFromResults(result.data);
            AccountStore.setId(userId);

            const metaInfo = {
                results: result.data
            };
            log(LoggerEventTypes.SURVEY_PRE_TEST_RESULTS, metaInfo);

            window.location = "/pretest"
        });

        return (
            <div className="Survey">
                <div className="Survey-form">
                    <Survey.Survey model={survey}   onValidateQuestion={TaskStore.surveyValidateQuestion} />
                </div>
            </div>    
        );
    }
}