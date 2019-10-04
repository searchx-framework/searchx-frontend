import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";
import Helpers from "../../../utils/Helpers";
import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";

class PostTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: localStorage.getItem('posttest-finish') === 'true'
        };

        this.onComplete = this.onComplete.bind(this);
    }

    render() {
        const task = AccountStore.getTask();
        return <Form
            formData={formData(task.data.topic)}
            formValidation={formValidation}
            onComplete={this.onComplete}
            disableCopy={true}
        />
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, {
            data: data
        });

        localStorage.setItem('posttest-finish', true.toString());
        this.state.finished = true;
    }
}

const formValidation = function(sender, question) {
    if (question.name === 'summary') {
        const text = question.value;
        const c = text.split(" ").length;

        if (c < 50) {
            question.error = "You have written only " + c + " words, you need to write at least 50 words to complete the exercises.";
        }
    }
};

const formData = function(topic) {
    let pages = [];
    let elements = [];

    ////

    elements.push({
        type: "html",
        name: "topic",
        html: `<h2>Final Exercises</h2>` +
        `<h3>Let's see how much you've learned.</h3>` +
        `<h3>Answer these questions about <b>${topic.title}</b>:</h3>`
    });

    Helpers.shuffle(topic.terms).forEach((term, idx) => {
        const name = "Q-"+ topic.id +"-"+ term;

        elements.push({
            title: "How much do you know about \"" + term + "\"?",
            type: "radiogroup",
            isRequired: true,
            name: name,
            choices: constants.choices
        });

        elements.push({
            title: "In your own words, what do you think the meaning is?",
            visibleIf: "{" + name + "} > 2",
            name: "meaning-" + idx,
            type: "text",
            inputType: "text",
            width: 500,
            isRequired: true,
        });
    });

    pages.push({elements:  elements});

    ////

    elements = [];

    elements.push({
        type: "html",
        name: "outline-description",
        html: `
            <b> Based on what you have learned from the learning session, please write an outline for your paper. </b>
            <p> Tip: An outline is an organizational plan to help you draft a paper. Here is a simple template example: </p>
            
            <p> 1. Introduction</p>
            <p> 1.1. Main argument: ...</p>
            <p> 1.2 Purpose of the paper: ... </p>
            
            <p> 2. Body </p>
            <p> 2.1 Argument 1: ....</p>
            <p> 2.2 Argument 2: .... </p>
            
            <p> 3. Conclusions</p>
            <p> Summary: ....</p>
            `
    });

    elements.push({
        title: "Write your outline here:",
        name: "outline-paper",
        type: "comment",
        inputType: "text",
        description: "",
        rows: 6,
        isRequired: true
    });

    elements.push({
        title: "Please write what you have learned about this topic from the learning session. Use at least 50 words.",
        name: "summary",
        type: "comment",
        inputType: "text",
        rows: 6,
        isRequired: true
    });

    elements.push({
        type: "html",
        html: "<hr/>"
    });

    elements.push({
        title: "During your searches did you have difficulties finding information about something? If so, describe briefly what you were looking for.",
        name: "difficulties",
        type: "comment",
        inputType: "text",
        rows: 4,
        isRequired: true
    });

    elements.push({
        title: "Do you have any additional comments regarding the learning phase?",
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
        completedHtml: "<h2>Thank you for taking part in our study.</h2>",
    }
};

export default PostTest;