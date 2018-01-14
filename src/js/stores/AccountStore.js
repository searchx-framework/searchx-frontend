import EventEmitter from 'events';
import config from '../config';

////

const getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");

    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const generateUUID = function() {
    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
};

////

let state = {
    userId: localStorage.getItem("user-id") || '' ,
    sessionId: localStorage.getItem("session-id") || '',

    task: {
        topicId: localStorage.getItem("topic-id") || '',
        type : localStorage.getItem("task-type") || '',
        duration: localStorage.getItem("task-duration")|| ''
    },

    group: {
        members: JSON.parse(localStorage.getItem("group-members")) || [],
    }
};

const AccountStore = Object.assign(EventEmitter.prototype, {

    setId(userId) {
        const sessionId = generateUUID();
        this.setSessionId(sessionId);

        localStorage.setItem("user-id", userId);
        state.userId = userId;
    },

    setSessionId(sessionId) {
        localStorage.setItem("session-id", sessionId);
        state.task.sessionId = sessionId;
    },

    ////

    isCollaborative() {
        if (!config.collaborative) return false;
        if (state.task.topicId === '') return true;
        return state.group.id !== '';
    },

    getGroup() {
        return state.group;
    },

    getMemberName(userId) {
        return state.group.members[userId].name;
    },

    getMemberColor(userId) {
        return state.group.members[userId].color;
    },

    ////

    getId() {
        return state.userId;
    },

    getSessionId() {
        return state.sessionId;
    },

    ////

    getTask() {
        return state.task;
    },

    getTopicId() {
        return state.task.topicId;
    },

    getTaskType() {
        return state.task.type;
    },

    getTaskDuration() {
        return state.task.duration;
    },

    ////

    setTask(topicId) {
        const type = 'search';
        const minutes = 20;

        localStorage.setItem("topic-id", topicId);
        localStorage.setItem("task-type", type);
        localStorage.setItem("task-duration", minutes);

        state.task.topicId = topicId;
        state.task.type = type;
        state.task.duration = minutes;
        state.task.sessionId = localStorage.getItem('session-id');

        localStorage.removeItem("finish");
    },

    setGroup(groupId, groupMembers) {
        localStorage.setItem("group-members", JSON.stringify(groupMembers));
        state.group.members = groupMembers;

        this.setSessionId(groupId);
    },

    setTaskType(type) {
        localStorage.setItem("task-type", type);
        state.task.type = type;
    },

    clearTask() {
        localStorage.removeItem("topic-id");
        localStorage.removeItem("task-type");
        localStorage.removeItem("task-duration");

        localStorage.removeItem("intro-done-video");
        localStorage.removeItem("intro-done-search");
        localStorage.removeItem("counter-start-search");

        state.task = {};
        this.clearGroup();
    },

    clearGroup() {
        localStorage.removeItem("group-members");
        state.group = {}
    }
});

export default AccountStore;