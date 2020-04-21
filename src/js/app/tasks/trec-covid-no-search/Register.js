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
                    this.props.history.push('/covidnosearch/posttest');
                } else {
                    this.props.history.push('/covidnosearch/posttest');
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
        html: "<h2>STUDY DESCRIPTION</h2>"
    });

    elements.push({
        type: "html",
        name: "start",
        html: `
        <h3> <img src ="img/coronavirus.png" width="50" height="50"> Help us learn more about the novel coronavirus!  </h3>
        
        <hr/>
        <p> As researchers, clinicians, and policy makers are involved with the response to COVID-19 (the novel coronavirus), it is becoming increasingly necessary for them and for the rest of us to find reliable information about the disease. In this study, we require you to help us with a critical step of the process when searching for information on COVID-19 -- formulating queries that can be issued to a search engine.
        </p>
        
        <h3> <img src ="img/virus.png" width="50" height="50"> Searching the web  </h3>
        <p> We use the web on a regular basis to find various information we need. To do so, we often express our information need (e.g. ‘comparing prices of two smartphones’) by formulating a query (e.g. ‘iphone vs. samsung galaxy cost’ etc.) and type it in to a search engine. The search engine in turn provides us with a list of results that we analyse. If the query is not well formed or ambiguous, there is a chance that we won't be able to find what we are looking for. <p> 
        
        <h3> <img src ="img/experiment.png" width="50" height="50"> The experiment  </h3>
        <p>In this study, we will provide you with 10 information needs related to COVID-19 (e.g. ‘Looking for information on all possible ways to contract COVID-19 from people, animals and objects’). With each of these information needs, you have to provide us with the best query that represents that particular information need. There is no right answer here. If you were to imagine that you are searching the web for this particular information need, what we are after are the terms that you type into the search engine to get the documents/websites/links that will answer your information need.</p>
        <h3> <img src ="img/list.png" width="50" height="50"> Your role  </h3>
        <p> Imagine that you are searching the web with that particular information need. Provide us with the query that you would issue in the web to get documents or websites or links answering your information need. On the next page, we will ask you to enter some basic information regarding your demographics. Following that, we will provide you with the list of the ten information need related to COVID-19. For each of them, there will be space for you to provide the query that you would issue for that need. Please provide only <b>one</b> query per information need. Try to make sure there are no spelling mistakes before submitting your final query.</p>
        <h3> <img src ="img/error.png" width="50" height="50"> Keep in mind...  </h3>
        <p> We have a few important points: </p>
        <ol type="-">
            <li>
                <p>
                Only make use of the interface that we provide. Do not use another web search interface to dry run your queries.
                Do not switch browser tabs–-after two tab switches we will cancel your participation.
                </p>
            </li>
            <li> 
                <p>
                Keep your queries in line with the information need. 
                For example, if your information need is 'Look for information on all possible ways to contract COVID-19 from people, animals and objects', we would consider queries regarding tomorrow's weather, news on Brexit, or movie reviews (for example) as off-topic, and will cancel your participation.
                </p>
            </li>
        </ol>
        <hr/>
        Thank you for your contribution and time!
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
        visibleIf: "{degree} > 0 & {degree} < 7",
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
        name: "topic",
        html: 
        `<h3>Search as Learning</h3>
        <br/> People often search the web to learn about something---whether it is knowledge they require for work, their study or just for fun. For the next few questions, we want you to think about how often you use the web when learning something about a scientific topic (e.g. how does partial differentiation work? what is a qubit? how can you determine the water quality of a pond?).
        <br/>
        <br/>
        <div align="center">
        <img src ="img/journey_2.jpeg" width="450" height="250">
        </div>
        
        `
    });

 

    elements.push({
        title: "How often do you learn about a scientific topic (see the examples above) by searching the web?",
        name: "web-previous",
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

    elements.push({
        type: "html",
        html: "<b> Think about the most recent time you learned about a scientific topic by searching the web. </b>"
    });

    elements.push({
        title: "Describe what you were trying to learn.",
        name: "web-information-need",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

    elements.push({
        title: "What are your preferred online resources (like Wikipedia, Coursera, Youtube etc.) to learn about a scientific topic?",
        name: "web-online",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

        elements.push({
        title: "What are your preferred offline resources (can be books, people, institutions) to learn about a scientific topic?",
        name: "web-offline",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 1,
        isRequired: true
    });

    elements.push({
        title: "What is your preferred query formulation strategy (can be short keyword queries, long questions etc.) while learning about a scientific topic?",
        name: "query",
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


    ////

    return {
        pages: pages,
        requiredText: "",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Registering user...</h2>"
    }
};

export default Register;