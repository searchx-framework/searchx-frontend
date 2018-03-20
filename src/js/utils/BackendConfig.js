import request from "superagent";
const env = require('env');

class BackendConfig {
    static get() {
        if (!this.promise) {
            this.promise = new Promise((resolve, reject) => {
                request
                    .get(env.serverUrl + '/v1/config')
                    .end((err, res) => {
                        if (!err) {
                            resolve(res.body);
                        }
                    });
            });
        }
        return this.promise;
    }
}

export default BackendConfig