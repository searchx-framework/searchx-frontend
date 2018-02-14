import './Forms.pcss'

import React from 'react';
import * as Survey from 'survey-react';

import {log} from '../../../../utils/Logger';
import {LoggerEventTypes} from '../../../../utils/LoggerEventTypes';
import Alert from "react-s-alert";

export default class Feedback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isComplete: localStorage.getItem('finish') === 'true'
        };

        this.handleComplete = this.handleComplete.bind(this);
        this.handleCutCopyPaste = this.handleCutCopyPaste.bind(this);
    }

    componentWillMount() {
        Survey.Survey.cssType = "bootstrap";
        Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    }

    ////

    handleComplete(result) {
        log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, {
            results: result.data
        });

        localStorage.setItem('finish', true);
        this.setState({
            isComplete: true
        });
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

    ////

    render() {
        if (this.state.isComplete) {
            return (
                <div className="Survey">
                    <div className="Survey-form">
                        <div className='Survey-complete'>
                            <h2>Thank you for the feedback :)</h2>
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
                <div className="Survey-form" onPaste={this.handleCutCopyPaste} onCut={this.handleCutCopyPaste} onCopy={this.handleCutCopyPaste}>
                    <Survey.Survey model={survey} />
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
        html: "<h2>Feedback</h2>" +
        "<h3>All feedbacks are welcome :)</h3>"
    });

    elements.push({
        type: "html",
        html: "<hr/>"
    });

    elements.push({
        title: "How did you make use of the collaborative features and the information from your collaborators to help in doing your tasks?",
        name: "collab-usage",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 4,
        isRequired: false
    });

    elements.push({
        title: "Do you have any feedbacks in using SearchX?",
        name: "feedback",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 4,
        isRequired: false
    });

    ////

    pages.push({elements:  elements});
    return {
        pages: pages,
        showQuestionNumbers: "off",
        completedHtml: "    "
    }
};