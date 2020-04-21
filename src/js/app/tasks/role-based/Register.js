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
                localStorage.setItem("current-topic", 0);
                if ('topics' in res.taskData) {
                    SyncStore.emitUserJoinGroup(true);
                    this.props.history.replace('/role-based/description');
                } else {
                    SyncStore.emitUserJoinGroup(false);
                    this.props.history.replace('/role-based/wait');
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
                We have automatically detected if your browser is compatible. Still, you can also <a href="https://www.whatismybrowser.com/" target="_blank">check here</a> if the version of your browser meets our requirements:
                Google Chrome version 47 (or higher) and Mozilla Firefox version 44 (or higher).
            </li>
            <li>You will need approximately 60 minutes to complete the whole study.</li>
            <li>We will detect if you were active in our study to decide if we will give your contribution.</li>
            <li>This is a collaborative study: this means you will be interacting with other participants during the experiment. </li>
        
        </ol>
        
        <hr/>

        
        In this study, you are tasked with searching for a number of documents in a collection of news articles with fellow users. The experiment has four main parts:
            <ol type="-">
            <li><strong>Pre-questionnaire</strong>: we will ask about your experience searching the Web with other users before.</li>
            <li><strong>Waiting phase</strong>: we will try to find a group of participants, and you will start the next phase (at least 10 minutes). You can play Tetris while you wait.</li>
            <li><strong>Collaborative search phase</strong>: you and your fellow participants will be given three different topics to work together on, and each takes about 15 minutes to complete. </li>
            <li><strong>Post-questionnaire</strong>: we will ask about how was your overall experience with our experiment.
            </ol>
        


        <hr/>
        <h3>Good luck and thank you for participating.</h3>
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
        title: "Insert your Prolific participant ID here (needed to pay you)",
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
            {value: 0, text: "High School or lower"},
            {value: 1, text: "Associate's degree(s) (e.g., AA AE, AFA, AS, ASN)"},
            {value: 2, text: "Bachelor's degree(s) (e.g., BA, BBA, BFA, BS)"},
            {value: 3, text: "Master's degree(s) (e.g., MA, MBA, MFA, MS, MSW)"},
            {value: 4, text: "Specialist degree(s) (e.g., EdS)"},
            {value: 5, text: "Applied or professional doctorate degree(s) (e.g., MD, DDC, DDS, JD, PharmD)"},
            {value: 6, text: "Doctorate degree(s) (e.g., EdD, PhD)"},
            {value: 7, text: "Other"}
        ]
    });
    
    elements.push({
        title: "For which subject areas do you have a {degree}?",
        visibleIf: " {degree} > 0 and {degree} < 7",
        name : "background",
        type :"text",
        inputType:"text",
        width: 500,
        isRequired: true
    });

    elements.push({
        title: "What is your academic degree and for which subject areas do you have the degree ?",
        visibleIf: "{degree} == 7",
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
            type: "html",
                html: `
        <b> Collaborative search is when users work together to complete a search task. </b>
        <br/>
        Collaborating with other people can take many forms, a few examples are shown here: 
        two people searching together on a single machine, several people searching towards a common goal on separate machines either in the same location or in different locations. 
        <br/><br/>
        <div align="center">
            <div style="height: 220px; width: 220px; display: inline-block; background-image: url('img/collab_1.jpg'); background-size: cover; background-position: center center;"></div>
            <div style="height: 220px; width: 220px; display: inline-block; background-image: url('img/collab_2.jpg'); background-size: cover; background-position: center center;"></div>
            <div style="height: 220px; width: 220px; display: inline-block; background-image: url('img/collab_3.jpg'); background-size: cover; background-position: center center;"></div>
        </div>
                `
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

        elements.push({
            type: "html",
            html: "<hr/>"
        });

        elements.push({
            type: "html",
            html: "<h5> Think about the most recent time you collaborated with others to search the web. </h5>"
        });

        elements.push({
            title: "Describe what you were looking for. As an example, you may be a husband and wife planning a trip for your family, a group of students working on a writing assignment and sharing search results/findings, or a couple shopping for a new sofa.",
            name: "collab-information-need",
            type: "comment",
            inputType: "text",
            width: 600,
            rows: 1,
            isRequired: true
        });

        elements.push({
            title: "How many others did you collaborate with (not including yourself)?",
            name: "collab-members",
            type: "text",
            width: 600,
            inputType: "number",
            isRequired: true
        });

        elements.push({
            title: "Given the example scenario you provided above, describe how you and your partner/friend/colleague performed the search activity. As examples of what we are interested in, did one person perform all the exploratory searching, with another examining the findings in detail? Or did each person involved look after individual components of the search activity (e.g. when booking a holiday, did one person focus on booking flights, with another looking at a hotel)?",
            name: "collab-information-setting",
            type: "comment",
            inputType: "text",
            width: 600,
            rows: 1,
            isRequired: true
        });

        elements.push({
            title: "When performing the example scenario you provided, how did you communicate with others you were performing the search activity with?",
            name: "collab-information-communication",
            type: "comment",
            inputType: "text",
            width: 600,
            rows: 1,
            isRequired: true
        });

        elements.push({
            type: "html",
            html: "<hr/>"
        });

        pages.push({elements:  elements});

    return {
        pages: pages,
        requiredText: "",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Registering user...</h2>"
    }
};

export default Register;