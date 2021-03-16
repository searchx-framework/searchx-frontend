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

        // if (localStorage.getItem("current-path") !== '/role-based/posttest') {
        //     this.props.history.replace({
        //         pathname: localStorage.getItem("current-path")
        //     });
        // }

        // if (localStorage.getItem("invalid-user") === "true") {
        //     this.props.history.replace({
        //         pathname: '/disq'
        //     });
        // }

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
        html: "<b><p>DO NOT PRESS THE BROWSER BACK BUTTON! This will invalidate your participation!</p> <h3>We would like you to describe your search experience.</h3></b>"
    });


    elements.push({
        title: "It was easy to understand why products were retrieved in response to my queries.",
        name: "easy",
        type: "rating",
        isRequired: true,
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });


    elements.push({
        title: "I didn't notice any inconsistencies when I used the system.",
        name: "inconsistencies",
        type: "rating",
        isRequired: true,
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });


    elements.push({
        title: "It was easy to determine if a product was relevant to the task.",
        name: "relevance",
        type: "rating",
        isRequired: true,
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });


    elements.push({
        title: "How difficult was this task?",
        name: "difficult",
        type: "rating",
        isRequired: true,
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Very easy",
        maxRateDescription: "Very difficult"
    });
    pages.push({elements:  elements});

    elements = [];


    elements.push({
        type: "html",
        name: "collab-feedback-description",
        html: "<h3>Now, we would also like you to describe your experience in collaborating with your partner.</h3>"
    });



    elements.push({
        title: "Were you satisfied with the decisions that you group have made?",
        name: "decision-satisfaction",
        type: "rating",
        isRequired: true,
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Very unsatisfied",
        maxRateDescription: "Very satisfied"
    });

    elements.push({
        title: "Did you search products well enough to make a decision?",
        name: "accomplishment",
        type: "rating",
        isRequired: true,
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Very insufficient",
        maxRateDescription: "Very sufficient"
    });

    elements.push({
        title: "Did you discuss with others well enough to make a decision?",
        name: "opinion-expression",
        type: "rating",
        isRequired: true,
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Very insufficient",
        maxRateDescription: "Very sufficient"
    });

    elements.push({
        title: "Did you express your opinions well enough in the discussion?",
        name: "opinion-epression",
        type: "rating",
        isRequired: true,
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Very insufficient",
        maxRateDescription: "Very sufficient"
    });

    elements.push({
        title: "Do you think the decisions were reflected by your opinion?",
        name: "opinion-reflection",
        type: "rating",
        isRequired: true,
        rateMin: 1,
        rateMax: 7,
        minRateDescription: "Tottally disagree",
        maxRateDescription: "Totally agreee"
    });



    elements.push({
        title: "Which contribution do you think you had during the task?",
        name: "role-description",
        type: "comment",
        inputType: "text",
        rows: 4,
        isRequired: true
    });


    pages.push({elements:  elements});

    elements = [];


    elements.push({
        title: "I could see what they others were searching and examining during the task.",
        name: "awareness",
        type: "rating",
        rateMin: 1,
        rateMax: 7,
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });

    elements.push({
        title: "It was easy to share what I found useful during my searches with my partners.",
        name: "share",
        type: "rating",
        rateMin: 1,
        rateMax: 7,
        isRequired: true,
        minRateDescription: "Disagree",
        maxRateDescription: "Agree"
    });

    elements.push({
        title: "Did you find the collaborative features useful? From 1 being not useful and 7 very useful.",
        name: "collab-rating",
        type: "matrix",
        isRequired: true,
        isAllRowRequired: true,

        columns: [
            {
                value: 1,
                text: "1"
            }, {
                value: 2,
                text: "2"
            }, {
                value: 3,
                text: "3"
            }, {
                value: 4,
                text: "4"
            }, {
                value: 5,
                text: "5"
            },
            {
                value: 6,
                text: "6"
            },
            {
                value: 7,
                text: "7"
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
        title: "Do you have any additional comments regarding the study?",
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