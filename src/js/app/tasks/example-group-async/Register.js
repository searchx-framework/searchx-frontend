import React from "react";
import Form from "../components/form/Form";
import FormContainer from "../components/form/FormContainer";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";
import Helpers from "../../../utils/Helpers";

import AccountStore from "../../../stores/AccountStore";
import SessionStore from "../../../stores/SessionStore";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFull: false
        };

        this.onComplete = this.onComplete.bind(this);
    }

    render() {
        return <div>
            {this.state.isFull ?
                <FormContainer>
                    <div className='message'>
                        <h2>Sorry, the room is full.</h2>
                    </div>
                </FormContainer>
                :
                <Form
                    formData={formData()}
                    onComplete={this.onComplete}
                />
            }
        </div>
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, {
            data: data
        });

        AccountStore.clearUserData();
        AccountStore.setUserId(Helpers.generateUUID());

        SessionStore.initializeTask(constants.taskId, {}, (res) => {
            if (res) {
                this.props.history.push('/async/session');
            } else {
                this.setState({
                    isFull: true
                })
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
        html: "<h2>Registration</h2>" +
        "<h3>First fill out this basic information about you.</h3>"
    });

    elements.push({
        title: "How often do you use Web search engine (e.g., Google, Bing, Yahoo) when you want to learn about something?",
        name: "search-frequency",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "More than 10 times a day"},
            {value: 1, text: "1-10 times a day"},
            {value: 2, text: "Once a day"},
            {value: 3, text: "Every few days"},
            {value: 4, text: "Never"}
        ]
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

    ////

    pages.push({elements:  elements});
    return {
        pages: pages,
        showQuestionNumbers: "off",
        requiredText: "",
        completedHtml: "<h2>Registering user...</h2>"
    }
};

export default Register;