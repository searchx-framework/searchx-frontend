import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log} from '../../../logger/Logger';
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

        var data = TaskStore.getPostTest(AccountStore.getId(), AccountStore.getTopicId());
        var survey = new Survey.Model(data);

        survey.requiredText = "";

        survey.onComplete.add( function(result){

            var metaInfo = {
                results: result.data
            }
            log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, metaInfo)
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
