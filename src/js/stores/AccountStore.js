import {register} from '../utils/Dispatcher';
import EventEmitter from 'events';


/*****************************/


const CHANGE_EVENT = 'change_account';

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


/*****************************/


let state = {
    userId: localStorage.getItem("userId") || '' ,
    task: {
        topicId: localStorage.getItem('topicId') || '',
        sessionId: localStorage.getItem('taskSessionId') || '',
        type : localStorage.getItem("taskType") || '',
        duration: localStorage.getItem("taskDuration")|| ''
    }
};

const AccountStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    
    dispatcherIndex: register(action => {
        AccountStore.emitChange();
    }),

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback)
    },

    ////

    getId() {
        return state.userId;
    },

    setId(userId) {
        

        localStorage.setItem("userId", userId);

        const sessionId = generateUUID();
        localStorage.setItem("taskSessionId", sessionId);
        

        state.userId = userId;
        state.task.sessionId = sessionId;
        return state.userId;
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

    ////

    setTask(topicId, type, minutes) {
        

        localStorage.setItem("topicId", topicId);
       
        localStorage.setItem("taskType", type);
        localStorage.setItem("taskDuration", minutes);

        state.task.topicId = topicId;
        state.task.type = type;
        state.task.duration = minutes;
        state.task.sessionId = localStorage.getItem('taskSessionId');

        localStorage.removeItem("finish-code");
    },

    clearTask() {
        localStorage.removeItem("topicId");

        localStorage.removeItem("taskType");
        localStorage.removeItem("taskDuration");

        localStorage.removeItem("intro-done");
        localStorage.removeItem("counter-start");

        state.task = {};
    }
});

export default AccountStore;