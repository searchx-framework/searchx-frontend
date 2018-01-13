import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';

import {log,log_and_go} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../constants/LoggerEventTypes';

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

    ////

    handleComplete(result) {
        const userId = TaskStore.getUserIdFromResults(result.data);
        AccountStore.setId(userId);

        const metaInfo = {
            results: result.data
        };
        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, metaInfo);

        ////

        this.setState({
            isComplete: true
        });

        TaskStore.initializeTask((url) => {
            this.props.history.push(url);
            this.props.history.go();
        });
    }

    ////

    render() {
        if (this.state.isComplete) {
            return (
                <div className="Survey">
                    <div className="Survey-form">
                        <div className='Survey-complete'>
                            <h2>Registering user...</h2>
                        </div>
                    </div>
                </div>
            );
        }

        ////

        const switchTabsPreTest = localStorage.getItem("switch-tabs-pretest");
        const switchTabsPostTest = localStorage.getItem("switch-tabs-posttest");
        const switchTabsVideo = localStorage.getItem("switch-tabs-video");

        if (switchTabsPreTest >= 3 || switchTabsPostTest >=3 || switchTabsVideo >=3) {
            return (
                <div/>
            );
        }

        ////

        localStorage.clear();
        const data = TaskStore.getRegisterInfo();
        let survey = new Survey.Model(data);

        survey.requiredText = "";
        survey.onComplete.add(this.handleComplete);

        return (
            <div className="Survey">
                <div className="Survey-form">
                    <Survey.Survey model={survey}/>
                </div>
            </div>    
        );
    }
}