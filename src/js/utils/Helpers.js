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
    }
}