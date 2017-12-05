import AccountStore from '../stores/AccountStore';
import request from 'superagent';

const config = require('config');
let eventQueue = [];

export function log(event, meta) {
    let task = {};
    const topicId = AccountStore.getTopicId() || '';

    if (topicId !== '') {
        task = {
            topicId: topicId,
            sessionId: AccountStore.getTaskSessionId() || '',
            type: AccountStore.getTaskType() || '',
            duration: AccountStore.getTaskDuration() || ''
        }
    }

    eventQueue.push({
        userId: AccountStore.getId() || '',
        date: new Date().toLocaleString("en-US", {timeZone: "Europe/Amsterdam"}),
        event: event || '',
        meta: meta || {},
        task: task
    });
}

export function flush() {
    if (eventQueue.length === 0) {
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