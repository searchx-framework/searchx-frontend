import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";

class PostTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: localStorage.getItem('posttest-finish') === 'true',
            returnCode: Math.random().toString(36).substring(2, 10)
        };

        this.onComplete = this.onComplete.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    handleBeforeUnload(e) {
        if (!this.state.finished) {
            const dialogText = 'Leaving this page will quit the task, and cancel your payment. Are you sure?';
            e.returnValue = dialogText;
            return dialogText;
        }
    }

    render() {
        const task = AccountStore.getTask();
        return <Form
            formData={formData(this.state.returnCode)}
            onComplete={this.onComplete}
            disableCopy={false}
        />
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, {
            data: data,
            returnCode: this.state.returnCode
        });

        localStorage.setItem('posttest-finish', true.toString());
        this.state.finished = true;
    }
}

const formData = function(returnCode) {
    let pages = [];
    let elements = [];

    ////

    elements.push({
        type: "html",
        name: "topic",
        html: `<h2>Exit Questionnaire</h2>`
    });


    elements.push({
        type: "html",
        name: "collab-feedback-description",
        html: "<b> We would like you to describe your search experience. </b>"
    });
    


    elements.push({
        title: "How satisfied was your search experience?",
        name: "satisfaction",
        type: "rating",
        isRequired: true,
        minRateDescription: "Very unsatisfied",
        maxRateDescription: "Very satisfied"
    });


    elements.push({
        title: "How frustrated were you with this task?",
        name: "frustation",
        type: "rating",
        isRequired: true,
        minRateDescription: "Not frustated",
        maxRateDescription: "Very frustated"
    });


    elements.push({
        title: "How well did the system help you in this task?",
        name: "system-helpfuness",
        type: "rating",
        isRequired: true,
        minRateDescription: "Very badly",
        maxRateDescription: "Very well"
    });


    elements.push({
        title: "How well did you fulfill the goal of this task?",
        name: "goal-success",
        type: "rating",
        isRequired: true,
        minRateDescription: "Very badly",
        maxRateDescription: "Very well"
    });


    elements.push({
        title: "How much effort did this task take?",
        name: "effort",
        type: "rating",
        isRequired: true,
        minRateDescription: "Minimum",
        maxRateDescription: "A lot of"
    });


    elements.push({
        title: "How difficult was this task?",
        name: "difficult",
        type: "rating",
        isRequired: true,
        minRateDescription: "Very easy",
        maxRateDescription: "Very difficult"
    });



    elements.push({
        type: "html",
        name: "collab-feedback-description",
        html: "<b> We would also like you to describe your experience in collaborating with your partner. </b>"
    });

    elements.push({
        title: "Did you find the collaborative features useful?",
        name: "collab-rating",
        type: "matrix",
        isRequired: true,
        isAllRowRequired: true,

        columns: [
            {
                value: 1,
                text: "Strongly Disagree"
            }, {
                value: 2,
                text: "Disagree"
            }, {
                value: 3,
                text: "Neutral"
            }, {
                value: 4,
                text: "Agree"
            }, {
                value: 5,
                text: "Strongly Agree"
            }
        ],
        rows: [
            {
                value: "query-history",
                text: "Recent queries"
            }, {
                value: "bookmarks",
                text: "Saved documents"
            }
        ]
    });

    elements.push({
        title: "Do you have any additional comments regarding SearchX?",
        name: "additional-comment",
        type: "comment",
        inputType: "text",
        rows: 4,
        isRequired: true
    });


    pages.push({elements:  elements});

    ////
   
    return {
        pages: pages,
        requiredText: "",
        showProgressBar: "top",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Thank you for taking part in our study.</h2> <h3>Use this code on Amazon MTurk: " + returnCode + "</h3>",
    }
};

export default PostTest;