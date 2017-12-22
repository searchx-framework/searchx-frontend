import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log_and_go, log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import $ from 'jquery'

export default class PreTest extends React.Component {

    constructor(props) {
        super(props);
      }

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
                step : "pretest"

            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
            alert("We have noticited that you have tried to go to a different window. Please focus on completing the diagnostic test.");
            
        })
    }

    ////

    render() {  
        const data = TaskStore.getPreTest();
        let survey = new Survey.Model(data);

        const sleep = function(milliseconds) {
            const start = new Date().getTime();
            for (let i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds){
                    break;
                }
            }
        };

        survey.requiredText = "";

        survey.onComplete.add(function(result) {
            //TODO set task details properly
            const topicId = TaskStore.getTopicFromResults(result.data);
            const type = 'search';
            const minutes = 20;
            AccountStore.setTask(topicId, type, minutes);

            const metaInfo = {
                results: result.data
            };
            log_and_go(LoggerEventTypes.SURVEY_PRE_TEST_RESULTS, metaInfo,"/learning/?q=search%20while%20learning&v=web&p=1");
           

            sleep(1000);
           
        });

        return (
            <div className="Survey">
                <div className="Survey-form" >
                    <Survey.Survey model={survey}/>
                </div>
            </div>    
        );
    }
}
