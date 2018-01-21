import './Form.css'

import React from 'react';
import * as Survey from 'survey-react';

import TaskStore from '../../../stores/TaskStore';
import AccountStore from '../../../stores/AccountStore';
import SyncStore from '../../../stores/SyncStore';

import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';

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
        AccountStore.clearUserData();

        const userId = TaskStore.getUserIdFromResults(result.data);
        AccountStore.setId(userId);
        SyncStore.registerSocket();

        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, {
            results: result.data
        });

        ////

        this.setState({
            isComplete: true
        });

        TaskStore.initializeTask((url) => {
            this.props.history.push(url);
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

        if (AccountStore.isOverSwitchTabsLimit()) {
            return (
                <div/>
            );
        }

        ////

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