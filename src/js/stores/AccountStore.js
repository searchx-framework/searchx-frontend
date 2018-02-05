import EventEmitter from 'events';
import config from '../config';

////

const generateUUID = function() {
    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
};

let state = {
    userId: localStorage.getItem("user-id") || '' ,
    sessionId: localStorage.getItem("session-id") || '',

    task: {
        topic: JSON.parse(localStorage.getItem("tasks-topic")) || '',
        type : localStorage.getItem("tasks-type") || '',
        duration: localStorage.getItem("tasks-duration")|| ''
    },

    group: {
        members: JSON.parse(localStorage.getItem("group-members")) || '',
    }
};

////

const AccountStore = Object.assign(EventEmitter.prototype, {
    setUserId(userId) {
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

    getUserId() {
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

    getMemberColor(userId) {
        if (state.group.members === '' || state.group.members[userId] === undefined) return 'Black';
        return state.group.members[userId].color;
    },

    ////

    setTask(topic) {
        const type = config.taskType;
        const minutes = config.taskDuration;

        state.task.topic = topic;
        state.task.type = type;
        state.task.duration = minutes;

        localStorage.setItem("tasks-topic", JSON.stringify(topic));
        localStorage.setItem("tasks-type", type);
        localStorage.setItem("tasks-duration", minutes);

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
        localStorage.setItem("tasks-type", type);
    },

    ////

    clearTask() {
        state.task = '';
        this.clearGroup();

        localStorage.removeItem("tasks-topic");
        localStorage.removeItem("tasks-type");
        localStorage.removeItem("tasks-duration");
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

if (state.userId === '') {
    AccountStore.setUserId("_anonymous_");
}

export default AccountStore;