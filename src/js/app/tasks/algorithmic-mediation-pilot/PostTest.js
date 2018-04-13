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
        `<h3>Add post test here.</h3>` +
        `<h3>Answer these questions about <b>${topic.title}</b>:</h3>`
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