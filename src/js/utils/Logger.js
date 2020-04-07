import AccountStore from '../stores/AccountStore';
import request from 'superagent';

export function log(event, meta) {
    const log = {
        event: event || '',
        userId: AccountStore.getUserId() || '',
        sessionId: AccountStore.getSessionId() || '',
        task: AccountStore.getTask() || '',
        meta: meta || {}
    };

    sendLog(log)
}

function sendLog(log) {
    request.post(`${process.env.REACT_APP_SERVER_URL}/v1/users/${AccountStore.getUserId()}/logs`)
        .send({
            data: [log]
        })
        // retry sending event 3 times if it fails due to errors that could be network-related
        .retry(3)
        .end((err, res) => {
        });
}
