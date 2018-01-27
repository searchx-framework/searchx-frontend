import AccountStore from '../stores/AccountStore';
import request from 'superagent';

const env = require('env');
let eventQueue = [];

export function log(event, meta) {
    let task = {};
    const topic = AccountStore.getTaskTopic();
    if (topic !== '') {
        task = {
            topicId: topic.id,
            type: AccountStore.getTaskType() || '',
            duration: AccountStore.getTaskDuration() || '',
        }
    }

    eventQueue.push({
        userId: AccountStore.getId() || '',
        sessionId: AccountStore.getSessionId() || '',
        task: task,
        event: event || '',
        meta: meta || {}
    });
    
    flush();
}

export function flush() {
    if (eventQueue.length === 0) {
        return;
    }

    request.post(env.serverUrl + '/v1/users/' + AccountStore.getId() + '/logs')
        .send({
            data: eventQueue
        })
        .end((err, res) => {});

    eventQueue = [];
}

