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

    listenToTopicId(callback) {
        socket.on('groupTopic', (data) => {
            callback(data.topicId)
        });
    },

    emitPretestScore(scores) {
        socket.emit('pushPretestScores', {
            userId: Account.getId(),
            scores: scores
        });
    },

    emitGroupTimeout() {
        socket.emit('pushGroupTimeout', {});
    },

    ////

    listenToSearchState(callback) {
        socket.on('searchState', (data) => {
            callback(data.userId, data.state);
        });
    },

    emitSearchState(state) {
        socket.emit('pushSearchState', {
            userId: Account.getId(),
            state: state
        });
    }
});

export default SyncStore;