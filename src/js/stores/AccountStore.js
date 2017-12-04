import {register} from '../utils/Dispatcher';
import EventEmitter from 'events';


/*****************************/


const CHANGE_EVENT = 'change_account';

const getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");

    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
};


/*****************************/


let state = {

    userId: localStorage.getItem("userId") || '' ,
    taskType : localStorage.getItem("taskType") || '',
    taskDuration: localStorage.getItem("taskDuration")|| '',
    topicId: localStorage.getItem('topicId') || ''
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
        if (state.userId === '') {
            //TODO: should create a new user id and maintain in session cookie
            return '20fdf0sd032';
        }
        return state.userId;
    },

    setId(userId) {
        localStorage.setItem("userId", userId);
        state.userId = userId;
        return state.userId;
    },

    getTopicId() {
        return state.topicId;
    },

    getTaskType() {
        return state.taskType;
    },

    getTaskDuration() {
        return state.taskDuration;
    },

    setTask(topicId, type, minutes) {
        localStorage.setItem("topicId", topicId);
        localStorage.setItem("taskType", type);
        localStorage.setItem("taskDuration", minutes);

        state.topicId = topicId;
        state.taskType = type;
        state.taskDuration = minutes;
    }
});

export default AccountStore;