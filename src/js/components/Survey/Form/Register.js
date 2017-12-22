import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log,flush_and_go} from '../../../utils/Logger';
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
            
        })

    }

    ////

    render() {  
        const data = TaskStore.getRegisterInfo();
        let survey = new Survey.Model(data);

        survey.requiredText = "";

        const sleep = function(milliseconds) {
            const start = new Date().getTime();
            for (let i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds){
                    break;
                }
            }
        };

        survey.onComplete.add(function(result) {
            const userId = TaskStore.getUserIdFromResults(result.data);
            AccountStore.setId(userId);

            const metaInfo = {
                results: result.data
            };
            log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, metaInfo);
            flush_and_go("/pretest");
            sleep(1000);
            console.log("Log sent");
            //window.location = "/pretest"
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