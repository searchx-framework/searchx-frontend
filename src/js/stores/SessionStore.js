import request from 'superagent';
import EventEmitter from 'events';
import AccountStore from "./AccountStore";
import Helpers from "../utils/Helpers";
import randomcolor from 'randomcolor';

let state = {
    group: {
        members: JSON.parse(localStorage.getItem("group-members") === undefined ? "{}" : localStorage.getItem("group-members")) || '',
    }
};

const SessionStore = Object.assign(EventEmitter.prototype, {
    initializeTask(id, params, callback) {
        let res = null;
        _getUserTask(AccountStore.getUserId(), id, params, (data) => {
            // console.log("id", id)
            // console.log("params", params)
            // console.log("data", data)
            if (data) {
                AccountStore.setGroup(data._id, data.members);
                AccountStore.setTask(data.taskId, data.taskData);
                res = data;
            }
            callback(res);
        });
    },
    
    updateTask(id, qdata, callback) {
        let res = null;
        _postUserTask(AccountStore.getUserId(), id, qdata, (data) => {
            console.log("id", id)
            // console.log("params", params)
            console.log("question ", qdata)
            console.log("data", data)
            if (data) {
                console.log("update task set task")
                AccountStore.setGroup(data._id, data.members);
                AccountStore.setTask(data.taskId, data.taskData);
                res = data;
            }
            callback(res);
        });
    },

    getMemberColor(userId) {
        if (state.group.members === '') {
            let memberColors = JSON.parse(localStorage.getItem('visited-urls'));
            if (memberColors) {
                if (!memberColors[userId]) {
                    memberColors[userId] = randomcolor({luminosity: 'dark'});
                    localStorage.setItem('visited-urls', JSON.stringify(memberColors));
                }
            } else {
                memberColors = {};
                memberColors[userId] = randomcolor({luminosity: 'dark'});
                localStorage.setItem('visited-urls', JSON.stringify(memberColors));
            }
            return memberColors[userId];
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
        AccountStore.setGroupId(groupId);
        // initially sessionId === groupId, when task includes multiple topics sessionId may change later
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
            } else {
                callback(null);
            }
        })
}
function _postUserTask(userId, taskId, qdata, callback) {
    request
        .post(`${process.env.REACT_APP_SERVER_URL}/v1/users/${userId}/task/${taskId}/topic`)
        .send({
            data: qdata
        })
        .end((err, res) => {
            if(!err && res) {
                const data = res.body.results;
                callback(data);
            } else {
                callback(null);
            }
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