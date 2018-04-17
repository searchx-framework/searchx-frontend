import AccountStore from '../stores/AccountStore';
import request from 'superagent';

let eventQueue = [];

export function log(event, meta) {
    eventQueue.push({
        event: event || '',
        userId: AccountStore.getUserId() || '',
        sessionId: AccountStore.getSessionId() || '',
        task: AccountStore.getTask() || '',
        meta: meta || {}
    });

    flush(); // TODO: remove and change back to periodic flush, but make sure data flushed at app exit
}

export function flush() {
    if (eventQueue.length === 0) {
        return;
    }

    request.post(`${process.env.REACT_APP_SERVER_URL}/v1/users/${AccountStore.getUserId()}/logs`)
        .send({
            data: eventQueue
        })
        .end((err, res) => {
            if (!err && !res.error) {
                eventQueue = [];
            }
        });
}

