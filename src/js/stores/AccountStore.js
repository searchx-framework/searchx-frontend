import EventEmitter from 'events';
import Helpers from '../utils/Helpers'

let state = {
    userId: localStorage.getItem("user-id") || '' ,
    sessionId: localStorage.getItem("session-id") || '',
    task: {
        id: localStorage.getItem("task-id") || '',
        data: JSON.parse(localStorage.getItem("task-data")) || '',
    }
};

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
    getTaskData() {
        return state.task.data;
    },

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

    setTask(id, data) {
        state.task.id = id;
        state.task.data = data;
        localStorage.setItem("task-id", id);
        localStorage.setItem("task-data", JSON.stringify(data));
    },

    clearTask() {
        state.task = '';
        localStorage.removeItem("task-id");
        localStorage.removeItem("task-data");
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