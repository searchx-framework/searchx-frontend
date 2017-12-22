import {register} from '../utils/Dispatcher';
import EventEmitter from 'events';
import underscore from 'underscore';

import topics from '../../../dist/data/topics.json';
import codes from '../../../dist/data/codes.json';

const CHANGE_EVENT = 'change_task';

const choices = [
    {value: 1, text: "I don't remember having seen this term/phrase before." }, 
    {value: 2, text: "I have seen this term/phrase before, but I don't think I know what it means."}, 
    {value: 3, text: "I have seen this term/phrase before, and I think I know what it means."},
    {value: 4, text: "I know this term/phrase."}
];

function sample(a, n) {
    return underscore.take(underscore.shuffle(a), n);
}

////

const TaskStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    
    dispatcherIndex: register(action => {
        TaskStore.emitChange();
    }),

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback)
    },

    ////

    getTopicDescription(topicId) {
        return topics[topicId]["task"];
    },
    getTopicTitle(topicId) {
        return topics[topicId]["title"];
    },

    getTopicVideo(topicId) {
        const prefix = "https://www.youtube.com/watch?v=";
        return prefix + topics[topicId]["youtube"];
    },

    getTopicTerms(topicId) {
        let terms = "";
        topics[topicId]['terms'].forEach(term => {
            terms += term.toLowerCase() + ";  "
        });

        return terms;
    },

    getFinishCode(userId) {
        return codes[userId];
    },

    ////

    getUserIdFromResults(results) {
        return results["userId"];
    },

    getTopicFromResults(results) {
        let topicResults = {};

        for (let result in results) {
            const v = result.split("-");
            if (v[0] === "Q") {
                topicResults[v[1]] = 0;
            }
        }

        for (let result in results) {
            const v = result.split("-");
            if (v[0] === "Q") {
                topicResults[v[1]] += parseInt(results[result]);
            }
        }

        const items = Object.keys(topicResults).map(function(key) {
            return [key, topicResults[key]];
        });
        
        // Sort the array based on the second element
        items.sort(function(first, second) {
            return first[1] - second[1];
        });
   
        if (items[0][0] == "0") {
            return items[1][0];
        }
        
        return items[0][0];
    },

    ////

    getRegisterInfo() {
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
            title: "Copy and Past the User Code here", 
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
            ],
            isRequired: true
        });


        elements.push({ 
            title: "How often do you use Web search engine (e.g., Google, Bing, Yahoo) when you want to learn about something?",
            name: "search-frequency",
            type: "radiogroup",
            isRequired: true,
            choices: [
                {value: 0, text: "Never"},
                {value: 1, text: "Rarely"}, 
                {value: 2, text: "Occasionally"}, 
                {value: 3, text: "Generally"}, 
                {value: 4, text: "Always"}
            ]
        });

        elements.push({ 
            title: "How many queries do you think you try in a Web search engine when you want to learn about something?",
            name: "search-queries",
            type: "radiogroup",
            isRequired: true,
            choices: [
                {value: 1, text: "1 query"},
                {value: 2, text: "2 queries"}, 
                {value: 3, text: "3 queries"}, 
                {value: 4, text: "3 to 5 queries"}, 
                {value: 5, text: "More than 5 queries"}
            ]
        });

        pages.push({elements:  elements});

        return {
            pages: pages, 
            showQuestionNumbers: "off",
            completedHtml: "    "
        }
    }, 

    surveyValidateQuestion (s, options) {
        if (options.name === 'userId') {
            const userId = options.value;
            
            if(!codes[userId]) {
                options.error = "This User Code is not valid, please check if you have copied and pasted the code correctly.";
            }
        }
    }, 

    surveyValidateWordCount (s, options) {
        if (options.name === 'summary') {
            const text = options.value;
            var c = text.split(" ").length
            if (c < 50) {
                options.error = "You have written only " + c + " words, you need to write at least 50 words to complete the exercises.";
            }
        }
    }, 



    getPreTest() {
 
        let sampledTopics = sample(["1", "2","3","4","5", "6", "7","8","9", "10"], 4);
        
        sampledTopics[1] = "0";
        let pages = [];

        

        sampledTopics.forEach(topicId => {
            let elements = [];

            elements.push({
                type: "html",
                name: "topic",
                html: "<h2>Diagonistic Test</h2> " +
                "<h3>Let's find out what you already know first.</h3>" +
                "<h3>Answer these questions about <b>" + topics[topicId]["title"] + "</b>:</h3>"
            });

            topics[topicId]["terms"].forEach((term, idx) => {
                const name = "Q-"+ topicId +"-"+ idx;

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
                    visibleIf: "{"+ name +"} > 2",
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

        return {
            pages: pages, 
            showProgressBar: "top",
            showQuestionNumbers: "off",
            completedHtml: "<p> </p>  "
        }
    },

    getPostTest(userId, topicId) {
        let pages = [];
        let elements = [];

        elements.push({ 
            type: "html", 
            name: "topic",
            html: "<h2>Final Exercises</h2>" +
                "<h3>Let's see how much you've learned.</h3>" +
                "<h3>Answer these questions about <b>" + topics[topicId]["title"] + "</b>:</h3>"
        });

        topics[topicId]["terms"].forEach((term, idx) => {
            const name = "Q-"+topicId +"-"+ idx;

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
                visibleIf: "{"+ name +"} > 2",
                name : "meaning-"+ topicId +"-"+ idx,
                type :"text",
                inputType:"text",
                width: 500,
                isRequired: true,
            });
        });

        elements.push({ 
            title: "Based on what you have learned from your searches, please write an outline for your paper.",
            name : "outline-paper", 
            type :"comment", 
            inputType:"text", 
            description: "An outline is an organizational plan to help you draft a paper. Writing an outline before beginning a paper is a way to organize your thoughts. An outline breaks down the parts of your thesis in a clear, hierarchical manner to help you see the overall format of your paper.",
            width: 600, 
            height: 1000,
            isRequired: true
        });

        elements.push({ 
            title: "Please write what you learned about this topic from your searches. Use at least 50 words.",
            name : "summary", 
            type :"comment", 
            inputType:"text", 
            width: 600, 
            height: 1000,
            isRequired: true
        });

        elements.push({ 
            title: "During your searches did you have difficulties finding information about something? If so, describe briefly what you were looking for.",
            name : "difficulties", 
            type :"comment",  
            inputType:"text", 
            width: 600, 
            height: 300,
            isRequired: true
        });

        pages.push({elements:  elements});

        ////
            
        return {
            pages: pages,
            showQuestionNumbers: "off", 
            completedHtml: 
                "<div class='Survey-complete'>" +
                    "<h2>Thanks!</h2> " +
                    "<h3>Please, copy and paste this code on CrowdFlower: "+ this.getFinishCode(userId) +"</h3>" +
                "</div>"
        }
    }
});



export default TaskStore;