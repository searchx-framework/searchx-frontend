import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import $ from 'jquery'
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class PostTest extends React.Component {

    componentWillMount() {    
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }

    componentDidMount() {
        
        $(document).ready(function () {
            $('body').bind('cut copy paste', function (e) {
                e.preventDefault();
            });

            //Disable mouse right click
            $("body").on("contextmenu",function(e){
                return false;
            });
        });


        document.addEventListener('visibilitychange', function(){
            const metaInfo = {
                step : "posttest"

            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
            alert("We have noticited that you have tried to go to a different window. Please focus on completing the exercises.");
            
        })

    }

    render() {
        const topicId = AccountStore.getTopicId();
        const userId = AccountStore.getId();

        if (topicId === '') {
            const finishCode = localStorage.getItem("finish-code") || '';
            if (finishCode === '') {
                return <div/>;
            }

            return (
                <div className="Survey">
                    <div className="Survey-form">
                        <div className='Survey-complete'>
                            <h2>Thanks!</h2>
                            <h3>Please, copy and paste this code on CrowdFlower: {finishCode}</h3>
                        </div>
                    </div>
                </div>
            );
        }

        ////

        const data = TaskStore.getPostTest(userId, topicId);
        const survey = new Survey.Model(data);

        survey.requiredText = "";
        survey.onComplete.add(function(result){
            const metaInfo = {
                results: result.data
            };
            log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, metaInfo);

            AccountStore.clearTask();
            localStorage.setItem("finish-code", TaskStore.getFinishCode(AccountStore.getId()));
            document.addEventListener('visibilitychange', function(){
            });

        });

        return (
            <div className="Survey">
                <div className="Survey-form">
                    <Survey.Survey model={survey} onValidateQuestion={TaskStore.surveyValidateWordCount}/>
                </div>
            </div>            
        );
    }
}
