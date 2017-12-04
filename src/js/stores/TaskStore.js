import {dispatch, register} from '../dispatchers/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import EventEmitter from 'events';
import request from 'superagent';
import underscore from 'underscore';

import topics from '../../../dist/data/topics.json';
import codes from '../../../dist/data/codes.json';
import AccountStore from './AccountStore';

const CHANGE_EVENT = 'change_task';

var choices = [
    {value: 1, text: "I don't remember having seen this term/phrase before." }, 
    {value: 2, text: "I have seen this term/phrase before, but I don't think I know what it means."}, 
    {value: 3, text: "I have seen this term/phrase before, and I think I know what it means."},
    {value: 4, text: "I know this term/phrase."}
]

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

    getTopicTitle(topicId) {
        return topics[topicId]["title"];
    },

    getTopicTerms(topicId) {
        var terms = "";
        for (var idx in topics[topicId]["terms"]) {
            var term = topics[topicId]["terms"][idx];
            terms += term + ";  "
        }
        return terms;
    },

    getUserIdFromResults(results) {
        for (var result in results){
            if (result == "userId") {
                return results[result];
            }
        }
    },

    getTopicFromResults(results) {
        var topicResults = {};
        for (var result in results){
            var v = result.split("-");
            if (v[0] == "Q") {
                topicResults[v[1]] = 0;
            }
        }
        
        for (var result in results){
            var v = result.split("-");
            if (v[0] == "Q") {
                topicResults[v[1]] += parseInt(results[result]);
            }
        }

        var items = Object.keys(topicResults).map(function(key) {
            return [key, topicResults[key]];
        });
        
        // Sort the array based on the second element
        items.sort(function(first, second) {
            return first[1] - second[1];
        });
        
        return items[0][0];
    },

    ////

    getRegisterInfo() {

        var pages = [];
        var elements = [];

        elements.push({ 
            type: "html", 
            name: "topic",
            html: "<h2>Registration</h2>" +
                "<h3>Let's find out what you already know first.</h3>" +
                "<h3>First fill out this basic information about you.</h3>"
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
            title: "What is your highest academic degree so far?",
            name: "degree",
            type: "radiogroup",
            isRequired: true,
            name: "degree",
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

        pages.push({elements:  elements}) 

        return {
            pages: pages, 
            showQuestionNumbers: "off",
            completedHtml: "    "
        }
    }, 

    surveyValidateQuestion (s, options) {
        if (options.name == 'userId') {
            var userId = options.value;
            
            if(!codes[userId]) {
                options.error = "This User Code is not valid, please check if you have copied and pasted the code correctly'.";
            }
        }
    }, 


    getPreTest() {
        var sampledTopics = sample(Object.keys(topics), 3);
        var pages = [];
 
        for (var topic in sampledTopics) {
            var tid = sampledTopics[topic];
            var elements = [];

            elements.push({ 
                type: "html", 
                name: "topic",
                html: "<h2>Diagonistic Test</h2> " +
                    "<h3>Let's find out what you already know first.</h3>" +
                    "<h3>Answer these questions about <b>" + topics[tid]["title"] + "</b>:</h3>"
            });

            for (var idx in topics[tid]["terms"]) {
                var term = topics[tid]["terms"][idx];
                var name = "Q-"+ tid +"-"+ idx
                
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
            }
            pages.push({elements:  elements});
        }

        ////

        return {
            pages: pages, 
            showProgressBar: "top",
            showQuestionNumbers: "off",
            completedHtml: 
                "<div class='Survey-complete'>" +
                    "<h2>Thanks!</h2> " +
                    "<h3>Now, use our custom Web search system to learn about a given topic. </h3>" +
                    "<a href=\"/search\" class=\"btn btn-primary btn-lg\" role=\"button\">Start!</a></div>" +
                "</div>"
        }
    },

    getPostTest(userId, topicId) {
        var pages = [];
        var elements = [];

        elements.push({ 
            type: "html", 
            name: "topic",
            html: "<h2>Final Test</h2>" +
                "<h3>Let's see how much you've learned.</h3>" +
                "<h3>Answer these questions about <b>" + topics[topicId]["title"] + "</b>:</h3>"
        });

        for (var idx in topics[topicId]["terms"]) {
            var term = topics[topicId]["terms"][idx];
            var name = "Q-"+topicId + "-" +idx;

            elements.push({
                title: "How much do  you know about \"" + term + "\"?",
                type: "radiogroup",
                isRequired: true,
                name: name,
                choices: choices
            });

            elements.push({
                title: "In your own words, what do you think the meaning is?",
                visibleIf: "{"+ name +"} > 2",
                name : "meaning-"+topicId+ "-" + idx, 
                type :"text", 
                inputType:"text", 
                width: 500, 
                isRequired: true,
            });
        }
        pages.push({elements:  elements});

        ////
            
        return {
            pages: pages,
            showQuestionNumbers: "off", 
            completedHtml: 
                "<div class='Survey-complete'>" +
                    "<h2>Thanks!</h2> " +
                    "<h3>Please, copy and paste this code on CrowdFlower: "+ codes[userId] +"</h3>" +
                "</div>"
        }
    }
});

export default TaskStore;