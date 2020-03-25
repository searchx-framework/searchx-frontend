import React from "react";
import Form from "../components/form/Form";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

class Feedback extends React.Component {


    render() {
        return <Form
            formData={formData()}
            onComplete={this.onComplete}
            disableCopy={true}
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
        html: "<h2>Feedback</h2>" +
        "<h3>All feedbacks are welcome :)</h3>"
    });

    elements.push({
        title: "How did you make use of the collaborative features and the information from your collaborators to help in doing your tasks?",
        name: "collab-usage",
        type: "comment",
        inputType: "text",
        rows: 4,
        isRequired: false
    });

    elements.push({
        title: "Do you have any feedbacks in using SearchX?",
        name: "feedback",
        type: "comment",
        inputType: "text",
        rows: 4,
        isRequired: false
    });

    ////

    pages.push({elements:  elements});
    return {
        pages: pages,
        showQuestionNumbers: "off",
        completedHtml: "<h2>Thank you for the feedback :)</h2>"
    }
};

export default Feedback;