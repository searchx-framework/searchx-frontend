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
        topic: JSON.parse(localStorage.getItem("task-topic")) || '',
        type : localStorage.getItem("task-type") || '',
        duration: localStorage.getItem("task-duration")|| ''
    },

    group: {
        members: JSON.parse(localStorage.getItem("group-members")) || '',
    }
};

const AccountStore = Object.assign(EventEmitter.prototype, {
    setId(userId) {
        state.userId = userId;
        localStorage.setItem("user-id", userId);

        const sessionId = generateUUID();
        this.setSessionId(sessionId);
    },

    setSessionId(sessionId) {
        state.sessionId = sessionId;
        localStorage.setItem("session-id", sessionId);
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

    getTaskTopic() {
        return state.task.topic;
    },

    getTaskType() {
        return state.task.type;
    },

    getTaskDuration() {
        return state.task.duration;
    },

    ////

    isCollaborative() {
        if (!config.collaborative) return false;
        if (state.task.topic === '') return true;
        return state.group.members !== '';
    },

    getMemberName(userId) {
        if (state.group.members === '' || state.group.members[userId] === undefined) return 'Anonymous';
        return state.group.members[userId].name;
    },

    getMemberColor(userId) {
        if (state.group.members === '' || state.group.members[userId] === undefined) return 'LightSlateGray';
        return state.group.members[userId].color;
    },

    ////

    setTask(topic) {
        const type = config.taskType;
        const minutes = config.taskDuration;

        state.task.topic = topic;
        state.task.type = type;
        state.task.duration = minutes;

        localStorage.setItem("task-topic", JSON.stringify(topic));
        localStorage.setItem("task-type", type);
        localStorage.setItem("task-duration", minutes);

        localStorage.removeItem("counter-start-search");
        localStorage.removeItem("finish");
    },

    setGroup(groupId, groupMembers) {
        let members = {};
        groupMembers.forEach(member => members[member.userId] = member);

        state.group.members = members;
        localStorage.setItem("group-members", JSON.stringify(members));

        this.setSessionId(groupId);
    },

    setTaskType(type) {
        state.task.type = type;
        localStorage.setItem("task-type", type);
    },

    ////

    clearTask() {
        state.task = '';
        this.clearGroup();

        localStorage.removeItem("task-topic");
        localStorage.removeItem("task-type");
        localStorage.removeItem("task-duration");
        localStorage.removeItem("counter-start-search");
    },

    clearGroup() {
        state.group.members = '';
        localStorage.removeItem("group-members");
    },

    clearUserData() {
        state.userId = '';
        state.sessionId = '';
        localStorage.clear();
    }
});

export default AccountStore;