import request from 'superagent';
import EventEmitter from 'events';

import AccountStore from "../../../stores/AccountStore";
import LearningPages from "./LearningPages";

const env = require('env');

////

let state = {
    topics: JSON.parse(localStorage.getItem("topics")) || ''
};

const LearningStore = Object.assign(EventEmitter.prototype, {
    initializeTask(callback) {
        let url = '/pretest';

        request
            .get(env.serverUrl + '/v1/users/' + AccountStore.getUserId() + '/task/?collaborative=' + AccountStore.isCollaborative())
            .end((err, res) => {
                if(err) {
                    callback('/register');
                }

                if(res) {
                    const data = res.body;
                    this.setTopics(data.topics);

                    if(data.topic) {
                        AccountStore.setTask(data.topic);
                        AccountStore.setGroup(data._id, data.members);
                        url = '/learning';
                    }
                }

                callback(url);
            })
    },

    setTopics(topics) {
        localStorage.setItem("topics", JSON.stringify(topics));
        state.topics = topics;
    },

    clearTopics() {
        localStorage.removeItem("topics");
        state.topics = '';
    },

    isTopicsPresent() {
        return state.topics !== '';
    },

    ////

    getTopicDescription(topic) {
        return topic.task;
    },

    getTopicVideo(topic) {
        const prefix = "https://www.youtube.com/watch?v=";
        return prefix + topic.youtube;
    },

    getTopicById(topicId) {
        const topic = state.topics.filter(x => x.id === topicId);
        if (topic.length > 0) return topic[0];
        return null;
    },

    ////

    isOverSwitchTabsLimit() {
        const switchTabsPreTest = localStorage.getItem("switch-tabs-posttest");
        const switchTabsPostTest = localStorage.getItem("switch-tabs-posttest");
        const switchTabsVideo = localStorage.getItem("switch-tabs-video");

        return switchTabsPreTest >= 3 || switchTabsPostTest >= 3 || switchTabsVideo >= 3;
    },

    ////

    getUserIdFromResults(results) {
        return results["userId"].replace(/\s/g, '');
    },

    getScoresFromResults(results) {
        let scores = {};
        Object.keys(results).forEach((result) => {
            const v = result.split("-");
            if (v[0] === "Q") {
                if(!scores[v[1]]) scores[v[1]] = 0;
                scores[v[1]] += parseInt(results[result]);
            }
        });

        return this.formatScores(scores);
    },

    formatScores(scores) {
        return Object.keys(scores)
            .filter((key) => key !== '0')
            .map(key => {
                return {
                    topicId: key,
                    score: scores[key]
                };
            })
            .sort((a,b) => a.score - b.score);
    },

    ////

    getRegisterInfo() {
        return LearningPages.registerPage();
    },

    getPreTest() {
        return LearningPages.preTestPage(state.topics, AccountStore.isCollaborative());
    },

    getPostTest() {
        return LearningPages.postTestPage(AccountStore.getTaskTopic(), AccountStore.isCollaborative(), AccountStore.getTaskType());
    },

    ////

    surveyValidateWordCount (s, options) {
        if (options.name === 'summary') {
            const text = options.value;
            const c = text.split(" ").length;

            if (c < 50) {
                options.error = "You have written only " + c + " words, you need to write at least 50 words to complete the exercises.";
            }
        }
    }
});

export default LearningStore;