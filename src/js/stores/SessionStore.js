import request from 'superagent';
import EventEmitter from 'events';
import AccountStore from "./AccountStore";
import Helpers from "../utils/Helpers";

const env = require('env');

////

let state = {
    group: {
        members: JSON.parse(localStorage.getItem("group-members")) || '',
    }
};

const SessionStore = Object.assign(EventEmitter.prototype, {
    initializeTask(task, params, callback) {
        let ok = false;
        _getUserTask(AccountStore.getUserId(), task, params, (data) => {
            if (data) {
                AccountStore.setTask(data.task, data.topic);
                AccountStore.setGroup(data._id, data.members);
                ok = true;
            }

            callback(ok);
        });

    },

    getMemberColor(userId) {
        if (state.group.members === '') {
            return 'Black';
        }

        if (userId in state.group.members) {
            return state.group.members[userId].color;
        }

        _getUserData(userId, AccountStore.getTaskId(), (data) => {
            if (data) {
                console.log(data);
                this.setNewGroupMember(data);
            }
        });

        return 'Gray';
    },

    ////

    setGroup(groupId, groupMembers) {
        let members = {};
        groupMembers.forEach(member => members[member.userId] = member);

        state.group.members = members;
        localStorage.setItem("group-members", JSON.stringify(members));

        AccountStore.setSessionId(groupId);
    },

    setNewGroupMember(userData) {
        state.group.members[userData.userId] = userData;
        localStorage.setItem("group-members", JSON.stringify(state.group.members));
    },

    clearGroup() {
        state.group.members = '';
        localStorage.removeItem("group-members");
    },
});

function _getUserTask(userId, task, params, callback) {
    console.log(`${env.serverUrl}/v1/users/${userId}/task/${task}/?${Helpers.generateQueryString(params)}`);
    request
        .get(`${env.serverUrl}/v1/users/${userId}/task/${task}/?${Helpers.generateQueryString(params)}`)
        .end((err, res) => {
            if(!err && res) {
                const data = res.body.results;
                callback(data);
            }

            callback(null);
        })
}

function _getUserData(userId, task, callback) {
    request
        .get(`${env.serverUrl}/v1/users/${userId}/task/${task}/data`)
        .end((err, res) => {
            if(!err && res) {
                const data = res.body.results;
                callback(data);
            }

            callback(null);
        })
}

export default SessionStore;