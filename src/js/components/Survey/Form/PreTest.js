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
 
        this.handleForfeitPayment = this.handleForfeitPayment.bind(this);
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

                var switchTabs = -1;
                if (localStorage.getItem("switchTabsPreTest") !== null) {
                    switchTabs = localStorage.getItem("switchTabsPreTest");
                }
                switchTabs++;
                localStorage.setItem("switchTabsPreTest", switchTabs);
                
                
                if (switchTabs >= 3) {
                    window.location.reload();
                }

            }

            
        })
    }


    handleCutCopyPaste(e){
        Alert.warning('You cannot copy and paste in this step.', {
            position: 'top-right',
            effect: 'scale',
            beep: true,
            timeout: "none",
            offset: 100
        });

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
        
    }

    handleForfeitPayment(){
        this.setState(this.state);
    }
      ////

    render() {  
        
        var switchTabs = localStorage.getItem("switchTabsPreTest") || 0;

        if (switchTabs >= 3) {
            return (
                <div className="Survey">
                    <div className="Survey-form">
                        <div className='Survey-complete'>
                            <h2>Sorry!</h2>
                            <h3>You have changed to a different tab/windows than three times, we have cancelled your participation, will not pay you.</h3>
                        </div>
                    </div>
                </div>
            );
        }
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
