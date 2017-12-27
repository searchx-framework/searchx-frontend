import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log_and_go, log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import $ from 'jquery'
import Alert from 'react-s-alert';


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
                step : "pretest",
                hidden: document.hidden

            };
            log(LoggerEventTypes.CHANGE_VISIBILITY, metaInfo);
            if (document.hidden) {
                Alert.error('We have noticited that you have tried to change to a different window/tab.', {
                    position: 'top-right',
                    effect: 'scale',
                    beep: true,
                    timeout: "none",
                    offset: 100
                });

                Alert.error('Please, focus on completing the diagnostic test.', {
                    position: 'top-right',
                    effect: 'scale',
                    beep: true,
                    timeout: "none",
                    offset: 100
                });

                Alert.error('You may not get the payment if you continue changing to a different window/tab.', {
                    position: 'top-right',
                    effect: 'scale',
                    beep: true,
                    timeout: "none",
                    offset: 100
                });

            }
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
        this.props.history.push('/learning')
        this.setState(this.state);
    }
      ////

    render() {  
        const data = TaskStore.getPreTest();

        let survey = new Survey.Model(data);

        survey.requiredText = "";

        survey.onComplete.add(this.handleComplete);


        return (
            <div className="Survey" >

                <div className="Survey-form" onPaste={this.handleCutCopyPaste} onCut={this.handleCutCopyPaste} onCopy={this.handleCutCopyPaste} >
                    <Survey.Survey model={survey}/>
                </div>
                

            </div>    
        );
    }
}
