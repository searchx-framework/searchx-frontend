const exports = {
    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    generateUUID: function() {
        // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        var d = new Date().getTime();//Timestamp
        var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : ( (r & 0x3) | 0x8)).toString(16);
        });
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
        return decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(window.location.search)||[null, ""])[1].replace(/\+/g, '%20')) || null;
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
    },

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    getId(result) {
        return result.id ? result.id : result.url;
    },
    
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
};

exports.getResultIds = function(results) {
    return results.map(result => exports.getId(result));
};

export default exports;