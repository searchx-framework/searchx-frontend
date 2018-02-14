import './Forms.pcss'

import React from 'react';
import * as Survey from 'survey-react';

import AccountStore from '../../../../stores/AccountStore';
import SyncStore from '../../../../stores/SyncStore';
import SessionStore from "../../../../stores/SessionStore";

import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../utils/LoggerEventTypes';
import Helpers from "../../../../utils/Helpers";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isComplete: false,
            isFull: false
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
        AccountStore.setUserId(Helpers.generateUUID());
        SyncStore.registerSocket();

        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, {
            results: result.data
        });

        this.setState({
            isComplete: true
        });

        SessionStore.initializeTask("lecture-puzzle", (ok) => {
            if (ok) {
                Helpers.sleep(500).then(() => {
                    this.props.history.push('/session');
                });
            } else {
                this.setState({
                    isFull: true
                })
            }
        });
    }

    ////

    render() {
        if (this.state.isComplete) {
            return (
                <div className="Survey">
                    <div className="Survey-form">
                        <div className='Survey-complete'>
                            {this.state.isFull ?
                                <h2>Sorry the session is already full.</h2>
                                :
                                <h2>Starting session...</h2>
                            }
                        </div>
                    </div>
                </div>
            );
        }

        ////

        let survey = new Survey.Model(page());
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

const page = function() {
    let pages = [];
    let elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>Registration</h2>" +
        "<h3>First fill out this basic information about you.</h3>"
    });

    elements.push({
        type: "html",
        html: "<hr/>"
    });

    elements.push({
        title: "How often do you use Web search engine (e.g., Google, Bing, Yahoo) when you want to learn about something?",
        name: "search-frequency",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "More than 10 times a day"},
            {value: 1, text: "1-10 times a day"},
            {value: 2, text: "Once a day"},
            {value: 3, text: "Every few days"},
            {value: 4, text: "Never"}
        ]
    });

    elements.push({
        title: "Have you ever collaborated with other people to search the Web?",
        name: "collab-previous",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "No"},
            {value: 1, text: "Yes"},
        ]
    });

    elements.push({
        title: "How often do you engage in collaborative Web search?",
        visibleIf: "{collab-previous} == 1",
        name: "collab-frequency",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "Daily"},
            {value: 1, text: "Weekly"},
            {value: 2, text: "Monthly"},
            {value: 3, text: "Less often"},
        ]
    });

    ////

    pages.push({elements:  elements});
    return {
        pages: pages,
        showQuestionNumbers: "off",
        completedHtml: "    "
    }
};