import EventEmitter from 'events';
import openSocket from 'socket.io-client';
import Account from "./AccountStore";

const socket = openSocket('http://localhost:4443'); //TODO : change to api server in config

function subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

////

const SyncStore = Object.assign(EventEmitter.prototype, {

    subscribeToSyncSearch(callback) {
        socket.on('syncSearch', (data) => {
            callback(data.userId, data.state);
        });

        socket.emit('subscribeToSyncSearch', {
            userId : Account.getId()
        });
    },

    pushSearchState(state) {
        socket.emit('pushSearchState', {
            userId : Account.getId(),
            state : state
        });
    }
});

export default SyncStore;