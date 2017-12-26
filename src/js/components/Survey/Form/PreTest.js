import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log_and_go, log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import $ from 'jquery'
import {Redirect} from 'react-router-dom';

export default class PreTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isComplete: false
        };
        this.handleComplete = this.handleComplete.bind(this);

        this.handleCutCopyPaste = this.handleCutCopyPaste.bind(this);
 
    }

    componentWillMount() {    
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }

    componentDidMount() {
        document.addEventListener('visibilitychange', function(){
            const metaInfo = {
                step : "pretest"

            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
            alert("We have noticited that you have tried to go to a different window. Please focus on completing the diagnostic test.");
            
        })
    }


    handleCutCopyPaste(e){
        e.preventDefault();
    }

    handleComplete (result) {
        
        const topicId = TaskStore.getTopicFromResults(result.data);
        
        const type = 'search';
        const minutes = 20;
        AccountStore.setTask(topicId, type, minutes);

        const metaInfo = {
            results: result.data
        };
        log(LoggerEventTypes.SURVEY_PRE_TEST_RESULTS, metaInfo);
        this.state.isComplete = true;
        this.setState(this.state);
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

        survey.onComplete.add(this.handleComplete);

        return (
            <div className="Survey" >
                {this.state.isComplete ?
                     <Redirect to='/learning'  />
                    : 
                <div className="Survey-form" onPaste={this.handleCutCopyPaste} onCut={this.handleCutCopyPaste} onCopy={this.handleCutCopyPaste} >
                    <Survey.Survey model={survey}/>
                </div>
                }
            </div>    
        );
    }
}
