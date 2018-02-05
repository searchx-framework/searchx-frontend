const choices = [
    {value: 1, text: "I don't remember having seen this term/phrase before." },
    {value: 2, text: "I have seen this term/phrase before, but I don't think I know what it means."},
    {value: 3, text: "I have seen this term/phrase before, and I think I know what it means."},
    {value: 4, text: "I know this term/phrase."}
];

const registerPage = function() {
    let pages = [];
    let elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>Registration</h2>" +
        "<h3>Let's find out what you already know first.</h3>" +
        "<h3>First fill out this basic information about you.</h3>"
    });

    elements.push({
        type: "html",
        html: "<hr/>"
    });

    elements.push({
            title: "Insert your Prolific ID here",
            name : "userId",
            type :"text",
            inputType:"text",
            width: 300,
            isRequired: true
        }
    );

    elements.push({
        type: "html",
        html: "<hr/>"
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
        title: "Which subject areas you have university degree(s)?",
        visibleIf: "{degree} > 0",
        name : "background",
        type :"text",
        inputType:"text",
        width: 500,
        isRequired: true
    });

    elements.push({
        type: "html",
        html: "<hr/>"
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

    elements.push({
        type: "html",
        html: "<hr/>"
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

    pages.push({elements:  elements});
    return {
        pages: pages,
        showQuestionNumbers: "off",
        completedHtml: "    "
    }
};

const preTestPage = function(topics, collaborative) {
    let pages = [];
    let elements = [];

    topics.forEach(topic => {
        elements = [];

        elements.push({
            type: "html",
            name: "topic",
            html: "<h2>Diagnostic Test</h2> " +
            "<h3>Let's find out what you already know first.</h3>" +
            "<h3>Answer these questions about <b>" + topic.title + "</b>:</h3>"
        });

        topic.terms.forEach((term, idx) => {
            const name = "Q-"+ topic.id +"-"+ idx;

            elements.push({
                type: "html",
                html: "<hr/>"
            });

            elements.push({
                title: "How much do you know about \"" + term + "\"?",
                type: "radiogroup",
                isRequired: true,
                name: name,
                choices: choices
            });

            elements.push({
                title: "In your own words, what do you think the meaning is?",
                visibleIf: "{" + name + "} > 2",
                name: "meaning-" + name,
                type: "text",
                inputType: "text",
                width: 500,
                isRequired: true
            });
        });

        pages.push({elements:  elements});
    });

    ////

    if (collaborative) {
        elements = [];

        elements.push({
            type: "html",
            html: `
                <b> Collaborative search is when participants work together to complete a search task. </b>
                
                <br/>
                
                Collaborating with other people can take many forms, a few examples are shown here: 
                two people searching together on a single machine, 
                several people searching towards a common goal on separate machines either in the same location or in different locations.
                
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
            html: "<b> Think about the most recent time you collaborated with others to search the web. </b>"
        });

        elements.push({
            title: "Describe the nature of the information need that prompted this collaborative search episode. " +
            "(e.g. husband and wife planning a trip for the family, a group of students working on a writing assignment and sharing search results/findings, a couple shopping for a new sofa, etc.)",
            name: "collab-information-need",
            type: "comment",
            inputType: "text",
            width: 600,
            rows: 4,
            isRequired: true
        });

        elements.push({
            title: "Which tools did you use to communicate with your collaborators" +
            "(e.g. email, chat, Skype, Whatsapp, talking on the phone, etc)?",
            name: "collab-tools",
            type: "comment",
            inputType: "text",
            width: 600,
            rows: 4,
            isRequired: true
        });

        elements.push({
            title: "With how many others did you collaborate with (i.e. not counting yourself)?",
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

        elements.push({
            title: "How satisfied were you with the quality of the answer(s)?",
            name: "collab-answer-satisfaction",
            type: "rating",
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied"
        });

        elements.push({
            title: "How satisfied were you with the ease of working collaboratively?",
            name: "collab-ease-satisfaction",
            type: "rating",
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied"
        });

        pages.push({elements:  elements});
    }

    ////

    return {
        pages: pages,
        showProgressBar: "top",
        showQuestionNumbers: "off",
        completedHtml: "<p> </p>  "
    }
};

const postTestPage = function(topic, collaborative, type) {
    let pages = [];
    let elements = [];

    ////

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>Final Exercises</h2>" +
        "<h3>Let's see how much you've learned.</h3>" +
        "<h3>Answer these questions about <b>" + topic.title + "</b>:</h3>"
    });

    topic.terms.forEach((term, idx) => {
        const name = "Q-"+ topic.id +"-"+ idx;

        elements.push({
            type: "html",
            html: "<hr/>"
        });

        elements.push({
            title: "How much do you know about \"" + term + "\"?",
            type: "radiogroup",
            isRequired: true,
            name: name,
            choices: choices
        });

        elements.push({
            title: "In your own words, what do you think the meaning is?",
            visibleIf: "{" + name + "} > 2",
            name: "meaning-" + idx,
            type: "text",
            inputType: "text",
            width: 500,
            isRequired: true,
        });
    });

    pages.push({elements:  elements});

    ////

    elements = [];

    elements.push({
        type: "html",
        name: "outline-description",
        html: `
            <b> Based on what you have learned from the learning session, please write an outline for your paper. </b>
            <p> Tip: An outline is an organizational plan to help you draft a paper. Here is a simple template example: </p>
            
            <p> 1. Introduction</p>
            <p> 1.1. Main argument: ...</p>
            <p> 1.2 Purpose of the paper: ... </p>
            
            <p> 2. Body </p>
            <p> 2.1 Argument 1: ....</p>
            <p> 2.2 Argument 2: .... </p>
            
            <p> 3. Conclusions</p>
            <p> Summary: ....</p>
            `
    });

    elements.push({
        title: "Write your outline here:",
        name: "outline-paper",
        type: "comment",
        inputType: "text",
        description: "",
        width: 600,
        rows: 6,
        isRequired: true
    });

    elements.push({
        title: "Please write what you have learned about this topic from the learning session. Use at least 50 words.",
        name: "summary",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 6,
        isRequired: true
    });

    elements.push({
        type: "html",
        html: "<hr/>"
    });

    if (type === "search") {
        elements.push({
            title: "During your searches did you have difficulties finding information about something? If so, describe briefly what you were looking for.",
            name: "difficulties",
            type: "comment",
            inputType: "text",
            width: 600,
            rows: 4,
            isRequired: true
        });
    }

    elements.push({
        title: "Do you have any additional comments regarding the learning phase?",
        name: "additional-comment",
        type: "comment",
        inputType: "text",
        width: 600,
        rows: 4,
        isRequired: true
    });

    pages.push({elements:  elements});

    ////

    if (collaborative) {
        elements = [];

        elements.push({
            type: "html",
            name: "collab-feedback-description",
            html: "<b> We would also like you to describe your experience in collaborating with your partner. </b>"
        });

        elements.push({
            title: "Did you find the collaborative features useful?",
            name: "collab-rating",
            type: "matrix",
            isRequired: true,
            isAllRowRequired: true,

            columns: [
                {
                    value: 1,
                    text: "Strongly Disagree"
                }, {
                    value: 2,
                    text: "Disagree"
                }, {
                    value: 3,
                    text: "Neutral"
                }, {
                    value: 4,
                    text: "Agree"
                }, {
                    value: 5,
                    text: "Strongly Agree"
                }
            ],
            rows: [
                {
                    value: "query-history",
                    text: "Shared Query History"
                }, {
                    value: "bookmarks",
                    text: "Shared Bookmarks"
                }, {
                    value: "chat",
                    text: "Group Chat"
                }
            ]
        });

        elements.push({
            title: "How did you make use of the collaborative features and the information from your partner to help in doing your tasks?",
            name: "collab-usage",
            type: "comment",
            inputType: "text",
            width: 600,
            rows: 4,
            isRequired: true
        });

        elements.push({
            title: "Do you have any additional comments regarding collaborating with your partner?",
            name: "collab-comments",
            type: "comment",
            inputType: "text",
            width: 600,
            rows: 4,
            isRequired: true
        });

        pages.push({elements:  elements});
    }

    ////

    return {
        pages: pages,
        showProgressBar: "top",
        showQuestionNumbers: "off",
        completedHtml: "<p> </p>"
    }
};

export default {
    registerPage: registerPage,
    preTestPage: preTestPage,
    postTestPage: postTestPage
};