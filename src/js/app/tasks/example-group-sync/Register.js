import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SessionStore from "../../../stores/SessionStore";

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
            topicsSize: constants.topicsSize
        };

        SessionStore.initializeTask(constants.taskId, taskParams, (res) => {
            if (res) {
                
                if ('topic' in res.taskData) {
                    // console.log("register", res);
                    this.props.history.push('/sync/session');
                } else {
                    this.props.history.push('/sync/pretest');
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
            In this study, you are tasked with learning about a given topic in collaboration with a fellow user.
            This study is composed of three parts:
        </h3>
        <ol type="1">
            <li><b>Diagnostic Test (by yourself)</b>.
                <p>
                    This is a multiple-choice question test to find out what you already know.
                    Please answer honestly. Your payment is not affected by the number of correct or incorrect answers.
                </p>
                <p>
                    Since this is a collaborative task, after the Diagnostic test you will need to wait for a partner.
                    How much time that takes depends on how many other users are active right now.
                    We ask you to wait for ${constants.waitDuration} minutes. We will notify you when you have waited long enough.
                    Then, please follow the instructions for a partial payment.
                </p>
            </li>
            <li><b>Collaborative Learning Phase</b>.
                <p>
                    We want you, together with your assigned partner, to use our custom web search system (we call it "SearchX") to learn about a given topic.
                    You are given ${constants.taskDuration} minutes to search for documents about that topic.
                    You need to collect and save all the Web pages, publications, and other online sources that are helpful for you to learn about the topic.
                </p>
                <p>
                    Please use only SearchX to learn about the given topic.
                    Do not use any other web search engine or search for an unrelated topic
                    (e.g. your topic is <i>computer science</i>, we consider searches for <i>tomorrow's weather</i>, <i>the latest news</i>, <i>movie reviews</i>, etc. as severely off-topic).
                    If you conduct such off-topic searches, we will cancel your participation.
                </p>
                <p>
                    In order to learn and search together, we provide you with:
                    a chat window so that you can communicate with your partner (when asked for a chat name, choose any name you like),
                    a shared query history so that you can see what your partner is currently searching for
                    and a shared bookmarking list so that you can easily share worthwhile documents.
                </p>
            </li>
            <li><b>Final Test (by yourself)</b>.
                <p>
                    We will give you ${constants.topicsSize} exercises to complete to see how much you have learned through the learning phase;
                    those exercises include questions about the given topic and the writing of an outline for your paper about the given topic.
                    Please answer honestly. Your payment is not affected by the number of correct or incorrect answers.
                    Note that your answers must exceed a minimum word count and be on your assigned topic.
                </p>
            </li>
        </ol>

        <hr/>
        <h3>You will need approximately 55 minutes to complete the whole study.</h3>
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
        title: "Insert your assigned ID here",
        name : "userId",
        type :"text",
        inputType:"text",
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
            {value: 3, text: "Doctorate"}
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