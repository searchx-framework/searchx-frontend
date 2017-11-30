import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log} from '../../../logger/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';

export default class PreTest extends React.Component {
    componentWillMount() {    
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }

    render() {  
        var data = TaskStore.getPreTest();
        var survey = new Survey.Model(data);
        
        survey.onComplete.add( function(result){
            //TODO send result.data to server
            console.log(result);

            //TODO set task details properly

            var topicId = TaskStore.getTopicFromResults(result.data);
            var userId = TaskStore.getUserIdFromResults(result.data);

            var type = 'search';
            var minutes = 5;

            AccountStore.setTask(topicId, type, minutes);
            AccountStore.setId(userId)


            var metaInfo = {
                results: result.data
            }
            log(LoggerEventTypes.SURVEY_PRE_TEST_RESULTS, metaInfo)
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
