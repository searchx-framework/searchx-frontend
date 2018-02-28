import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";
import Helpers from "../../../utils/Helpers";

import AccountStore from "../../../stores/AccountStore";

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

        AccountStore.clearUserData();
        AccountStore.setUserId(Helpers.generateUUID());

        this.props.history.push('/simple/session');
    }
}

const formData = function() {
    let pages = [];
    let elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>Registration</h2>" +
        `<h3>We want you to plan a travel itinerary. First let's see how much you already know about the destination.</h3>`
    });

    elements.push({
        title: `Have you visited "${constants.destination}" before?`,
        name: "visit",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 1, text: "Yes"},
            {value: 0, text: "No"},
        ]
    });

    elements.push({
        title: `How familiar are you with "${constants.destination}"?`,
        name: "familiarity",
        type: "rating",
        minRateDescription: "Not Familiar -",
        maxRateDescription: "- Very Familiar"
    });

    elements.push({
        title: `Please write a summary of what you already know regarding "${constants.destination}".`,
        name: "summary",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 10,
        isRequired: true
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