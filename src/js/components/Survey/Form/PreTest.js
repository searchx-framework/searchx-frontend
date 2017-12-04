import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log} from '../../../logger/Logger';
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
        var data = TaskStore.getPreTest();
        var survey = new Survey.Model(data);

        survey.requiredText = "";
        
        survey.onComplete.add(function(result) {
            var topicId = TaskStore.getTopicFromResults(result.data);
            var userId = TaskStore.getUserIdFromResults(result.data);

            //TODO set task details properly
            var type = 'search';
            var minutes = 15;

            AccountStore.setTask(topicId, type, minutes);

            var metaInfo = {
                results: result.data
            }
            log(LoggerEventTypes.SURVEY_PRE_TEST_RESULTS, metaInfo)

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
