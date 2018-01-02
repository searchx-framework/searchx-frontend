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
    finishCode: localStorage.getItem("code") || '',

    task: {
        topicId: localStorage.getItem("topic-id") || '',
        sessionId: localStorage.getItem("task-session-id") || '',
        type : localStorage.getItem("task-type") || '',
        duration: localStorage.getItem("task-duration")|| ''
    },

    group: {
        id: localStorage.getItem("group-id") || '',
        members: JSON.parse(localStorage.getItem("group-members")) || [],
    }
};

const AccountStore = Object.assign(EventEmitter.prototype, {

    getId() {
        return state.userId;
    },

    setId(userId) {
        const sessionId = generateUUID();

        localStorage.setItem("user-id", userId);
        localStorage.setItem("task-session-id", sessionId);

        state.userId = userId;
        state.task.sessionId = sessionId;
        return state.userId;
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

    ////

    getTopicId() {
        return state.task.topicId;
    },

    getTaskSessionId() {
        return state.task.sessionId;
    },

    getTaskType() {
        return state.task.type;
    },

    getTaskDuration() {
        return state.task.duration;
    },

    getFinishCode() {
        return state.finishCode;
    },

    ////

    setUserData(finishCode, groupId, groupMembers) {
        localStorage.setItem("code", finishCode);
        state.finishCode = finishCode;

        if (groupId) {
            localStorage.setItem("group-id", groupId);
            localStorage.setItem("group-members", JSON.stringify(groupMembers));

            state.group.id = groupId;
            state.group.members = groupMembers;
        }
    },

    setTask(topicId, type, minutes) {
        localStorage.setItem("topic-id", topicId);
        localStorage.setItem("task-type", type);
        localStorage.setItem("task-duration", minutes);

        state.task.topicId = topicId;
        state.task.type = type;
        state.task.duration = minutes;
        state.task.sessionId = localStorage.getItem('task-session-id');

        localStorage.removeItem("finish");
    },

    clearTask() {
        localStorage.removeItem("topic-id");
        localStorage.removeItem("task-type");
        localStorage.removeItem("task-duration");
        localStorage.removeItem("intro-done");
        localStorage.removeItem("counter-start");

        state.task = {};
        this.clearGroup();
    },

    clearGroup() {
        localStorage.removeItem("group-id");
        localStorage.removeItem("group-members");

        state.group = {}
    }
});

export default AccountStore;