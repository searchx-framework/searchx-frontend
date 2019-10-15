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
        <h3>You will need approximately 55 minutes to complete the whole study.</h3>
        <h3>Requirements:</h3>
        <ol type="1">
            <li>
                <a href="https://www.whatismybrowser.com/" target="_blank">Check here</a> if the version of your browser meets our requirements:
                Google Chrome version 47 (or higher) and Mozilla Firefox version 44 (or higher).
            </li>
        </ol>
        
        <hr/>
        <h3>
            In this study, you are tasked with learning about a given topic by using our web search interface.
            This study is composed of four parts:
        </h3>
        <ol type="1">
            <li><b>Test 1 </b>
                <p>
                    This is a multiple-choice question test to find out what you already know about 3 topics.
                    Please answer honestly. Your payment is not affected by the number of correct or incorrect answers.
                </p>
            </li>
            <li><b>Learning Phase</b>
                <p>
                    We want you to use our custom web search system (we call it "SearchX") to learn about one given topic.
                    You are required to search for documents, read them and learn about that topic for atleast 20 minutes. It is only when 20 minutes have elapsed you can finish searching and go to the last step of this study by clicking the "To Final Test" button.
                     Henceforth, we will refer to this learing phase of 20 minutes (minimum) as search session. 
                </p>
                <p>
                    Please use only SearchX to learn about the given topic. You must open and read documents/web pages that you think are important about the given topic.
                    Do not use any other web search engine or search for an unrelated topic
                    (e.g. your topic is <i>computer science</i>, we consider searches for <i>tomorrow's weather</i>, <i>the latest news</i>, <i>movie reviews</i>, etc. as severely off-topic).
                    If you conduct such off-topic searches, we will cancel your participation.
                    Moreover, we would not allow you to change tabs more than three times during the search session.
                    Our document viewer might be unsatisfactory and fail to render all web pages perfectly. However, we ask you to not use any other page/search engine other than SearchX for our study. 
                </p>
                <p>
                    In order to learn and search, we provide you with:
                    a query history so that you can see all your previous queries,
                    and a  bookmarking list so that you can easily save all the Web pages, publications, and other online sources that are helpful for you to learn about the topic.
                </p>
            </li>
            <li> <b>Tests 2, 3 and 4 </b>
                <p>
                    We will give you these tests at regular intervals during your search session. These are multiple-choice question test similar to Test 1
                    to find out how much you have learnt about the topic while searching and reading documents.
                    Please answer honestly. Your payment is not affected by the number of correct or incorrect answers.
                </p>
            </li>
            <li><b>Test 5 </b>
                <p>
                After 20 minutes, if you are satisfied with what you have learned and would like to proceed to Test 5, you can click the "To Final Test" button.
                    In this test, we will give you a multiple-choice question test similar to the previous tests to assess your final knowledge on the topic.
                    We will also ask you to write a summary about what you have learned on the topic. 
                    When you write the summary you will have access to the web pages and documents that you bookmarked during the search session. 
                    Your payment is not affected by the number of correct or incorrect answers.
                    Note that your summry must exceed a minimum word count (100) and has to be on your assigned topic.
                    Finally, we will ask you to give some brief feedback about the task, your learning phase and our platform!
                </p>
            </li>
        </ol>
        <hr/>
        
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
        title: "Insert your assigned Prolific ID here",
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
            {value: 0, text: "High School or lower"},
            {value: 1, text: "Bachelor"},
            {value: 2, text: "Master"},
            {value: 3, text: "Doctorate"},
            {value: 4, text: "Other"}
        ]
    });

    elements.push({
        title: "For which subject areas do you have a {degree} degree(s)?",
        visibleIf: "{degree} > 0 & {degree} < 4",
        name : "background",
        type :"text",
        inputType:"text",
        width: 500,
        isRequired: true
    });
    elements.push({
        title: "What is your academic degree and for which subject areas do you have the degree ?",
        visibleIf: "{degree} == 4",
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
        html: "<p> Check <a href ='http://www.uefap.com/test/', target='_blank'>this chart </a> to determine your English level. </p>",
        name: "english-chart",
        type: "html",
        visibleIf: "{english} == 0"
    });
    elements.push({
        title: "What is your level of English? ",
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

    elements = [];

    elements.push({
        title: "Have you ever learnt about a particular topic by searching the Web?",
        name: "web-previous",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "No"},
            {value: 1, text: "Yes"},
        ]
    });

    elements.push({
        title: "How often do you engage in Web search?",
        visibleIf: "{collab-previous} == 1",
        name: "web-frequency",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "Daily"},
            {value: 1, text: "Weekly"},
            {value: 2, text: "Monthly"},
            {value: 3, text: "Less often"},
        ]
    });

    elements.push({
        type: "html",
        html: "<hr/>"
    });

    elements.push({
        type: "html",
        html: "<b> Think about the most recent time you leanred about a topic or gathered some information by searching the web. </b>"
    });

    elements.push({
        title: "Describe what were you trying to learn. (e.g. about a place for planning a trip, learning about a subject for a writing assignment like essays, comparing prices of products, etc.)",
        name: "collab-information-need",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

    elements.push({
        title: "What are your preferred online resources (like Wikipedia, Coursera etc.) to learn?",
        name: "collab-members",
        type: "text",
        width: 600,
        inputType: "number",
        isRequired: true
    });

        elements.push({
        title: "What are your preferred offline resources (like an encyclopedia, textbooks etc.) to learn?",
        name: "collab-members",
        type: "text",
        width: 600,
        inputType: "number",
        isRequired: true
    });

    elements.push({
        type: "html",
        html: "<hr/>"
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