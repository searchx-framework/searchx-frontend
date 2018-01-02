import EventEmitter from 'events';
import io from 'socket.io-client';
import Account from "./AccountStore";

const env = require('env');
const socket = io(env.serverUrl + '/group');

////

if (Account.getId() !== '') {
    socket.emit('register', {
        userId: Account.getId()
    });
}

const SyncStore = Object.assign(EventEmitter.prototype, {

    submitPretestScore(scores, callback) {
        socket.on('groupTopic', (data) => {
            callback(data.topicId)
        });

        socket.emit('pretestScore', {
            userId: Account.getId(),
            scores: scores
        });
    },

    ////

    subscribeToSyncSearch(callback) {
        socket.on('syncSearch', (data) => {
            callback(data.userId, data.state);
        });
    },

    pushSearchState(state) {
        socket.emit('pushSearchState', {
            userId: Account.getId(),
            state: state
        });
    }
});

export default SyncStore;