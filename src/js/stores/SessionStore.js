import request from 'superagent';
import EventEmitter from 'events';
import AccountStore from "./AccountStore";
import Helpers from "../utils/Helpers";

let state = {
    group: {
        members: JSON.parse(localStorage.getItem("group-members") === undefined ? "{}" : localStorage.getItem("group-members")) || '',
    }
};

const SessionStore = Object.assign(EventEmitter.prototype, {
    initializeTask(id, params, callback) {
        let res = null;
        _getUserTask(AccountStore.getUserId(), id, params, (data) => {
            if (data) {
                AccountStore.setGroup(data._id, data.members);
                AccountStore.setTask(data.taskId, data.taskData);
                res = data;
            }

            callback(res);
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

function _getUserTask(userId, taskId, params, callback) {
    request
        .get(`${process.env.REACT_APP_SERVER_URL}/v1/users/${userId}/task/${taskId}/?${Helpers.generateQueryString(params)}`)
        .end((err, res) => {
            if(!err && res) {
                const data = res.body.results;
                callback(data);
            }

            callback(null);
        })
}

function _getUserData(userId, taskId, callback) {
    request
        .get(`${process.env.REACT_APP_SERVER_URL}/v1/users/${userId}/task/${taskId}/data`)
        .end((err, res) => {
            if(!err && res) {
                const data = res.body.results;
                callback(data);
            }

            callback(null);
        })
}

export default SessionStore;