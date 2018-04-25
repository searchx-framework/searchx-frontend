import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import AccountStore from "../../../stores/AccountStore";
import SessionStore from "../../../stores/SessionStore";
import SyncStore from "../../../stores/SyncStore";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";
import {log} from "../../../utils/Logger";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.onComplete = this.onComplete.bind(this);
    }

    render() {
        return <Form
            formData={formData()}
            onComplete={this.onComplete}
        />
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, {
            data: data
        });

        const userId = data['userId'].trim();
        AccountStore.clearUserData();
        AccountStore.setUserId(userId);

        const taskParams = {
            groupSize: constants.groupSize,
        };

        SessionStore.initializeTask(constants.taskId, taskParams, (res) => {
            if (res) {
                if ('topic' in res.taskData) {
                    this.props.history.push('/pilot/session');
                    // emit sync submit to trigger update of task data for other group members
                    SyncStore.emitSyncSubmit({});
                } else {
                    this.props.history.push('/pilot/wait');
                }
            }
        });
    }
}

const formData = function() {
    let pages = [];
    let elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2 class='text-center'>STUDY DESCRIPTION</h2>"
    });

    elements.push({
        type: "html",
        name: "start",
        html: `
        <h3>Requirements:</h3>
        <ol type="1">
            <li>
                <a href="https://www.whatismybrowser.com/" target="_blank">Check here</a> if the version of your browser meets our requirements:
                Google Chrome version 47 (or higher) and Mozilla Firefox version 44 (or higher).
            </li>
        </ol>
        
        <hr/>

        <h3>
            In this study, you are tasked with searching a collection of news articles with a fellow user.
            This study is composed of two parts:
        </h3>

        <ol type="1">
            <li><b>Collaborative Searching Phase (with other worker)</b>.
                <p>
                    We want you, together with your assigned partner, to use our custom web search system (we call it "SearchX") to search about a given topic.
                    You are given ${constants.taskDuration} minutes to search for news articles about that topic.
                    You need to collect and save all the articles that are helpful for you to write about the topic.
                </p>
            </li>
            <li><b>Exit Questionnaire (by yourself)</b>.
                <p>
                    We will ask 10 questions about your search experienece.
                    Note that your answers must exceed a minimum word count and be on your assigned topic.
                </p>
            </li>
        </ol>

        <hr/>
        <h3>You will need approximately 20 minutes to complete the whole study.</h3>
        `
    });

    pages.push({elements:  elements});

    ////

    elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>Registration</h2>" +
        "<h3>First fill out this basic information about you.</h3>"
    });

    elements.push({
        title: "Insert your MTurk Worker ID here (needed to pay you)",
        name : "userId",
        type : "text",
        inputType: "text",
        width: 300,
        isRequired: true
    });

    elements.push({
        title: "What is your highest academic degree so far?",
        name: "degree",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "High School"},
            {value: 1, text: "Bachelor"},
            {value: 2, text: "Master"},
            {value: 3, text: "Doctorate"},
            {value: 4, text: "Other"}
        ]
    });

    elements.push({
        title: "For which subject areas do you have a university degree(s)?",
        visibleIf: "{degree} > 0",
        name : "background",
        type :"text",
        inputType:"text",
        width: 500,
        isRequired: true
    });

    elements.push({
        title: "Are you an English native speaker?",
        name: "english",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "No"},
            {value: 1, text: "Yes"},
        ]
    });

    elements.push({
        title: "What is your level of English?",
        visibleIf: "{english} == 0",
        name : "english-level",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "Beginner"},
            {value: 1, text: "Elementary"},
            {value: 2, text: "Intermediate"},
            {value: 3, text: "Upper-intermediate"},
            {value: 4, text: "Advanced"},
            {value: 5, text: "Proficiency"}
        ]
    });

    pages.push({elements:  elements});

    ////

    return {
        pages: pages,
        requiredText: "",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Registering user...</h2>"
    }
};

export default Register;