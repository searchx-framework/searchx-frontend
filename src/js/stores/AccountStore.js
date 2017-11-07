import {dispatch, register} from '../dispatchers/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import EventEmitter from 'events';

import request from 'superagent';

const CHANGE_EVENT = 'change_account';

var getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

var courseList = ["CTB3365STx", "CTB3365DWx","SBD101X"];

var courseId = function(){
    var url = (window.location != window.parent.location)
            ? document.referrer
            : document.location.href;
    for (let i = 0; i < courseList.length; i++) {
        var re = new RegExp(courseList[i]);
        if (re.test(url)){
            return courseList[i];
        }
    }
    return "outer";
}

var getAorB = function(userId){
    var num = 1;
    for (let i = 0 ; i < userId.length; i++ ){
        num += userId.charCodeAt(i);
    }
    return ( (num % 2) == 0);
}
        


var state = {
    userId: getParameterByName('anonId') || '',
    courseId : courseId(),
    AorB: getAorB(getParameterByName('anonId')||'')
};

const AccountStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback)
    },
    getId() {
        if (state.userId == '') {
            //TODO: should create a new user id and maintain in session cookie
            return '20fdf0sd032';
        }
        return state.userId;
    },
    dispatcherIndex: register(action => {
        AccountStore.emitChange();
    }),

    getCourseId() {
        return state.courseId;
    },
    
    getAorB(){
        return state.AorB;
    }
});

export default AccountStore;