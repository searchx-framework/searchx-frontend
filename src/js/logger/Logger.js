import AccountStore from '../stores/AccountStore';
import request from 'superagent';

var config = require('config');
var eventQueue = []

export function log(event, meta) {
    eventQueue.push({
                userId: AccountStore.getId() || '',
                courseId: AccountStore.getCourseId() || '',
                event: event || '',
                meta: meta || {},
                date: new Date()
            });
}

export function flush() {
    if (eventQueue.length == 0) {
        return;
    }
    request
    .post( config.serverUrl + '/v1/users/' + AccountStore.getId() + '/logs')
    .send({
        data: eventQueue
    })
    .end((err, res) => {
        //console.log(res.body);
    });
    eventQueue = [];
}