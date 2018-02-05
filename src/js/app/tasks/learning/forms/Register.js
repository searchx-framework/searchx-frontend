import './Forms.pcss'

import React from 'react';
import * as Survey from 'survey-react';

import LearningStore from '../LearningStore';
import AccountStore from '../../../../stores/AccountStore';
import SyncStore from '../../../../stores/SyncStore';

import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../utils/LoggerEventTypes';
import Helpers from "../../../../utils/Helpers";

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

        const userId = LearningStore.getUserIdFromResults(result.data);
        AccountStore.setUserId(userId);
        SyncStore.registerSocket();

        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, {
            results: result.data
        });

        ////

        this.setState({
            isComplete: true
        });

        LearningStore.initializeTask((url) => {
            Helpers.sleep(500).then(() => {
                this.props.history.push(url);
            });
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

        const data = LearningStore.getRegisterInfo();
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