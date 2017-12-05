import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import $ from 'jquery'

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

        window.onblur = function(){
            const metaInfo = {
                type: "blur",
                step : "posttest"

            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);

        };

        window.onfocus = function(){  
            const metaInfo = {
                type: "focus",
                step : "posttest"
            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
        }
    }

    render() {
        const topicId = AccountStore.getTopicId();
        if (topicId === '') {
            return <div/>;
        }

        ////

        const data = TaskStore.getPostTest(AccountStore.getId(), topicId);
        const survey = new Survey.Model(data);

        survey.requiredText = "";
        survey.onComplete.add(function(result){
            const metaInfo = {
                results: result.data
            };
            log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, metaInfo);

            AccountStore.clearTask();
        });

        return (
            <div className="Survey">
                <div className="Survey-form">
                    <Survey.Survey model={survey}/>
                </div>
            </div>            
        );
    }
}
