import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log,log_and_go} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';
import  { Redirect } from 'react-router-dom'

import VisibilitySensor from 'react-visibility-sensor';


export default class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isComplete: false
        };
        this.handleComplete = this.handleComplete.bind(this);
    }

    componentWillMount() {    
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }

    componentDidMount(){
        localStorage.clear();
    }


    handleComplete(result) {
        const userId = TaskStore.getUserIdFromResults(result.data);
        AccountStore.setId(userId);

        const metaInfo = {
            results: result.data
        };

        
        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, metaInfo);

        this.state.isComplete = true;
        this.props.history.push('/pretest');
        this.setState(this.state);

    }

    ////

    render() {  
        const data = TaskStore.getRegisterInfo();
        let survey = new Survey.Model(data);

        survey.requiredText = "";

        survey.onComplete.add(this.handleComplete);

        return (
            <div className="Survey">
                <div className="Survey-form">

                    <Survey.Survey model={survey}   onValidateQuestion={TaskStore.surveyValidateQuestion} />
                    
                </div>
            </div>    
        );
    }
}