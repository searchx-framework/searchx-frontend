import EventEmitter from 'events';
import Helpers from '../utils/Helpers'

let state = {
    userId: localStorage.getItem("user-id") || '',
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
    },

    setSessionId(sessionId) {
        state.sessionId = sessionId;
        localStorage.setItem("session-id", sessionId);
    },

    setTask(id, data) {
        console.log("I have received the task data", data);
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

if (!state.userId) {
    AccountStore.setUserId(Helpers.generateUUID());
}
if (!state.sessionId) {
    AccountStore.setSessionId('_default_session_');
}

export default AccountStore;