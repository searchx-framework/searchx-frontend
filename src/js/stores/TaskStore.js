import {dispatch, register} from '../dispatchers/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import EventEmitter from 'events';
import request from 'superagent';
import underscore from 'underscore';

import topics from '../../../dist/data/topics.json';

import AccountStore from './AccountStore';

var choices = [{ value: 1, text: "I don't remember having seen this term/phrase before." }, 
{value: 2, text: "I have seen this term/phrase before, but I don't think I know what it means."}, 
{value: 3 , text : "I have seen this term/phrase before, and I think I know what it means."},
{value : 4, text: "I know this term/phrase."}]

const CHANGE_EVENT = 'change_task';

function sample(a, n) {
    return underscore.take(underscore.shuffle(a), n);
}

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

    getTopicTitle(topicId) {
        return topics[topicId]["title"];
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

    getPreTest() {
        var sampledTopics = sample(Object.keys(topics), 5);
        var pages = [];
        elements = [];
        elements.push(
            { name : "crowdflowerId", type :"text", inputType:"text", width: 500,
            title: "Your CrowdFlower Id", isRequired: true
           }

        );

        elements.push(
            { name : "code", type :"text", inputType:"text", width: 500, 
            title: "Your Code Here", isRequired: true
           }
        );


        elements.push( {
            type: "radiogroup",
                isRequired: true,
                name: "degree",
                choices: [{value: 0, text:  "High School"}, { value:1 , text: "Bachelor"}, 
                        {value :2, text: "Master"}, {value: 3 , text:  "Doctorate"}],
                title: "Highest degree so far"
            }
        );

        elements.push(
            { name : "background", type :"text", inputType:"text", width: 500, isRequired: true,
            title: "University degree(s) in which subject areas", "visibleIf": "{degree} > 0"  
           }
        );

        pages.push({elements:  elements}) 

        for (var topic in sampledTopics){
            var tid = sampledTopics[topic];
            var elements = [];
            elements.push(
                { type: "html", name: "topic",
                    html:" <h2>Diagonistic Test</h2><h4>This is a multiple-choice question test to find out what you already know." 
                    + "Please answer honestly." 
                    + "Your payment is not be affected by the number of correct or incorrect answers.</h4>"
                    + "<h3>Answer the questions about <b>" + topics[tid]["title"] + "</b>:</h3>"
                });
            for (var idx in topics[tid]["terms"]) {
                var term = topics[tid]["terms"][idx];
                elements.push(
                    {
                        type: "radiogroup",
                        isRequired: true,
                        name: "Q-"+tid+"-"+idx,
                        choices: choices,
                        title: "How much do you know about " + term + "?"
                      }
                )
                elements.push(
                    { name : "meaning-"+tid+"-"+idx, type :"text", inputType:"text", width: 500, isRequired: true,
                     title: "In your own words, what do you think the meaning is?", "visibleIf": "{" + tid+"-"+idx+ "} > 2" 
                    }
                )
            }
            pages.push({elements:  elements});
            

        }
        return {pages: pages, "showProgressBar": "top","showQuestionNumbers": "off",
                completedHtml: "<h2>Thanks!</h2> <h3> Now, go to the learning phase. </h3>" +
                "<a href=\"/search\" class=\"btn btn-primary btn-lg\" role=\"button\">Start!</a></div>"
        }
    },

    getPostTest(topicId) {
        var pages = [];

        var elements = [];


        elements.push(
            { type: "html", name: "topic",
                html:" <h2>Final Test</h2><h4>This is another multiple-choice question test to see how much you've learned." 
                + "Please answer honestly." 
                + "Your payment is not be affected by the number of correct or incorrect answers.</h4>"
                + "<h3>Answer the questions about <b>" + topics[topicId]["title"] + "</b>:</h3>"
            });

        for (var idx in topics[topicId]["terms"]) {
            var term = topics[topicId]["terms"][idx];
            elements.push(
                {
                    type: "radiogroup",
                    isRequired: true,
                    name: topicId + "-" +idx,
                    choices: choices,
                    title: "How much do you know about " + term + "?"
                }
            )
            elements.push(
                { name : "meaning-"+topicId+ "-" + idx, type :"text", inputType:"text", width: 500, isRequired: true,
                    title: "In your own words, what do you think the meaning is?", "visibleIf": "{" + topicId+"-"+idx + "} > 2" 
                }
            )
        }
        pages.push({elements:  elements});
            
        return {pages: pages, "showQuestionNumbers": "off",   completedHtml: "<h2>Thanks!</h2> <h3> Your code is: </h3>"}
    }
    }
);

export default TaskStore;