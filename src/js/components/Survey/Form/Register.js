import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log} from '../../../logger/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import $ from 'jquery'

export default class Register extends React.Component {


    constructor(props) {
        super(props);
      }

    componentWillMount() {    
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }

    componentDidMount(){
        window.onblur = function(){   

            var metaInfo = {
                type: "blur",
                step : "search"

            }
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo)

        }  
        window.onfocus = function(){  
            var metaInfo = {
                type: "focus",
                step : "search"

            }
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo)
        }
    }


    render() {  
        var data = TaskStore.getRegisterInfo();
        var survey = new Survey.Model(data);

        survey.requiredText = "";
        
        survey.onComplete.add(function(result) {

            var userId = TaskStore.getUserIdFromResults(result.data);

            AccountStore.setId(userId)
            var metaInfo = {
                results: result.data
            }
            log(LoggerEventTypes.SURVEY_PRE_TEST_RESULTS, metaInfo)

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