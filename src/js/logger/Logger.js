import AccountStore from '../stores/AccountStore';
import request from 'superagent';

var config = require('config');
var eventQueue = []

export function log(event, meta) {
    eventQueue.push({
        userId: AccountStore.getId() || '',
        date: new Date(),
        event: event || '',
        meta: meta || {},
        task: {
            topicId: AccountStore.getTopicId() || '',
            type: AccountStore.getTaskType() || '',
            duration: AccountStore.getTaskDuration() || '',
        }
    });
}

export function flush() {
    if (eventQueue.length == 0) {
        return;
    }

    request.post(config.serverUrl + '/v1/users/' + AccountStore.getId() + '/logs')
        .send({
            data: eventQueue
        })
        .end((err, res) => {
            //console.log(res.body);
        });

    eventQueue = [];
}