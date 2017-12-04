import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {flush, log} from '../../../logger/Logger';
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

        window.onblur = function(){
            const metaInfo = {
                type: "blur",
                step : "pretest"
            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
        };

        window.onfocus = function(){  
            const metaInfo = {
                type: "focus",
                step : "pretest"
            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
        }
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
            const minutes = 15;
            AccountStore.setTask(topicId, type, minutes);

            const metaInfo = {
                results: result.data
            };
            log(LoggerEventTypes.SURVEY_PRE_TEST_RESULTS, metaInfo);
            flush();

            sleep(1000);
            window.location = "/search"
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
