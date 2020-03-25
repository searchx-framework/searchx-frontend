import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

class Submit extends React.Component {

    render() {
        return <Form
            formData={formData()}
            onComplete={this.onComplete}
        />
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_POST_TEST_RESULTS, {
            data: data
        });
    }
}

const formData = function() {
    let pages = [];
    let elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>Submit Itinerary</h2>" +
        `<h3>Please write down your itinerary for your planned trip to:</h3>` +
        `<h3><b>${constants.destination}</b></h3>`
    });

    elements.push({
        title: `Which locations are you planning to visit on your trip to "${constants.destination}"?`,
        name: "locations",
        type: "comment",
        inputType: "text",
        rows: 6,
        isRequired: true
    });

    elements.push({
        title: `How did you plan your budget for your trip to "${constants.destination}"?`,
        name: "budget",
        type: "comment",
        inputType: "text",
        rows: 12,
        isRequired: true
    });

    ////

    pages.push({elements:  elements});
    return {
        pages: pages,
        showQuestionNumbers: "off",
        requiredText: "",
        completedHtml: "<h2>We have recorded your submission.</h2>"
    }
};

export default Submit;