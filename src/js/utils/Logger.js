import AccountStore from '../stores/AccountStore';
import request from 'superagent';

const env = require('env');

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

function sendLog(log, errorCallback) {
    request.post(env.serverUrl + '/v1/users/' + AccountStore.getUserId() + '/logs')
        .send({
            data: [log]
        })
        // retry sending event 3 times if it fails due to errors that could be network-related
        .retry(3)
        .end((err, res) => {
        });
}
