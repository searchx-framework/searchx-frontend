import EventEmitter from 'events';
import Helpers from '../utils/Helpers'
import config from '../config';

////

let state = {
    userId: localStorage.getItem("user-id") || '' ,
    sessionId: localStorage.getItem("session-id") || '',

    task: {
        id: localStorage.getItem("tasks-id") || '',
        topic: JSON.parse(localStorage.getItem("tasks-topic")) || '',
        type : localStorage.getItem("tasks-type") || '',
        duration: localStorage.getItem("tasks-duration")|| ''
    },
};

////

const AccountStore = Object.assign(EventEmitter.prototype, {
    getUserId() {
        return state.userId;
    },
    getSessionId() {
        return state.sessionId;
    },

    getTask() {
        return state.task;
    },
    getTaskId() {
        return state.task.id;
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

    isCollaborative() {
        return config.collaborative;
    },

    ////

    setUserId(userId) {
        state.userId = userId;
        localStorage.setItem("user-id", userId);

        const sessionId = Helpers.generateUUID();
        this.setSessionId(sessionId);
    },

    setSessionId(sessionId) {
        state.sessionId = sessionId;
        localStorage.setItem("session-id", sessionId);
    },

    setTask(id, topic) {
        const type = config.taskType;
        const minutes = config.taskDuration;

        state.task.id = id;
        state.task.topic = topic;
        state.task.type = type;
        state.task.duration = minutes;

        localStorage.setItem("tasks-id", id);
        localStorage.setItem("tasks-topic", JSON.stringify(topic));
        localStorage.setItem("tasks-type", type);
        localStorage.setItem("tasks-duration", minutes);
    },

    setTaskType(type) {
        state.task.type = type;
        localStorage.setItem("tasks-type", type);
    },

    ////

    clearTask() {
        state.task = '';

        localStorage.removeItem("tasks-topic");
        localStorage.removeItem("tasks-type");
        localStorage.removeItem("tasks-duration");
        localStorage.removeItem("counter-start-search");
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