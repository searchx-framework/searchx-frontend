import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

class PostTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: localStorage.getItem('posttest-finish') === 'true',
            returnCode: Math.random().toString(36).substring(2, 10)
        };

        this.onComplete = this.onComplete.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
        this.handlePopstate = this.handlePopstate.bind(this);
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('popstate', this.handlePopstate);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('popstate', this.handlePopstate);
    }

    handleBeforeUnload(e) {
        if (!this.state.finished) {
            const dialogText = 'Leaving this page will quit the task. Are you sure?';
            e.returnValue = dialogText;
            return dialogText;
        }
    }

    handlePopstate(e) {
        const dialogText = 'Leaving this page will quit the task. Please make sure you finished the post-test and copied your payment code.';
        e.returnValue = dialogText;
        return dialogText;
    }

    render() {

        if (localStorage.getItem("current-path") !== '/role-based/posttest') {
            this.props.history.replace({
                pathname: localStorage.getItem("current-path")
            });
        }

        if (localStorage.getItem("invalid-user") === "true") {
            this.props.history.replace({
                pathname: '/disq'
            });
        }

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

        this.setState( { finished : true});
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
        html: "<b><p>DO NOT PRESS THE BROWSER BACK BUTTON! This will invalidate your participation!</p> <p>We would like you to describe your search experience.</p></b>"
    });
    


    elements.push({
        title: "How many people did you just now collaborate with (not including yourself)?",
        name: "collaborate-number",
        type: "text",
        width: 600,
        inputType: "number",
        isRequired: true
    });


    elements.push({
        title: "The color coding of the query history and bookmarks made sense to me.",
        name: "color-coding",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });


    elements.push({
        title: "It was easy to understand why documents were retrieved in response to my queries.",
        name: "easy",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });


    elements.push({
        title: "I didn't notice any inconsistencies when I used the system.",
        name: "inconsistencies",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });


    elements.push({
        title: "It was easy to determine if a document was relevant to a task.",
        name: "relevance",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
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
        html: "<b>We would also like you to describe your experience in collaborating with your partner.</b>"
    });

    elements.push({
        title: "It was easy to understand what was my job in the task.",
        name: "role",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });

    elements.push({
        title: "I could communicate well with my partners.",
        name: "communicate",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });

    elements.push({
        title: "I could see what they others were searching and examining during the task.",
        name: "awareness",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });

    elements.push({
        title: "It was easy to share what I found useful during my searches with my partners.",
        name: "share",
        type: "rating",
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
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
            }, {
                value: "chat",
                text: "Chat tool"
            },
            {
                value: "hidden-results",
                text: "Hiding saved and excluded results"
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
        completedHtml: "<h2>Thank you for taking part in our study.</h2> <h3>Follow this <a href=" + constants.completionURL + "> link</a> back to Prolific Academic to confirm your participation.</h3>",
    }
};

export default PostTest;