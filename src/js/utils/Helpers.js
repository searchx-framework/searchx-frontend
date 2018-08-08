'use strict';

export default {
    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    generateUUID: function() {
        // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    },

    generateQueryString: function(object) {
        let parts = [];
        Object.entries(object).forEach(pair => {
            const param = encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]);
            parts.push(param);
        });

        return parts.join('&');
    },

    getURLParameter: function(name) {
        // http://stackoverflow.com/a/11582513/3300831
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.search)||[,""])[1].replace(/\+/g, '%20')) || null;
    },

    capitalizeFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    // Not using the Math.random().toString(36) trick, since that may generate an empty string and is not properly random.
    // Not using an uuid since this needs to be easy to copy (e.g. for a group name).
    // Use 30 characters for entropy similar to a uuid.
    // Based on: https://stackoverflow.com/a/27747377
    generateId (len) {
        const dec2hex = function(dec) {
            return ('0' + dec.toString(16)).substr(-2)
        };

        let arr = new Uint8Array((len || 30) / 2);
        window.crypto.getRandomValues(arr);
        return Array.from(arr, dec2hex).join('')
    }
}