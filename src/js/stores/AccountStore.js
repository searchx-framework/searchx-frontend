import EventEmitter from 'events';
import Helpers from '../utils/Helpers'

let state = {
    userId: localStorage.getItem("user-id") || '',
    sessionId: localStorage.getItem("session-id") || '',
    groupId: localStorage.getItem("group-id") || '',
    task: {
        id: localStorage.getItem("task-id") || '',
        data: JSON.parse(localStorage.getItem("task-data") === undefined ? "{}" : localStorage.getItem("task-data")) || '',
    }
};

const AccountStore = Object.assign(EventEmitter.prototype, {
    getUserId() {
        return state.userId;
    },
    getSessionId() {
        return state.sessionId;
    },
    getGroupId() {
        return state.groupId;
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

    setGroupId(groupId) {
        state.groupId = groupId;
        localStorage.setItem("group-id", groupId);
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

if (!state.userId) {
    AccountStore.setUserId(Helpers.generateUUID());
}
if (!state.sessionId) {
    AccountStore.setSessionId('_default_session_');
}
if (!state.groupId) {
    AccountStore.setSessionId('_default_group_');
}

export default AccountStore;