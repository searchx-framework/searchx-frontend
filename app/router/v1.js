'use strict';

var website = require('../controllers/website');

module.exports = function(router) {
    router.get('/', website.home);
    router.get('/auth', website.auth);
    router.get('/logout', website.logout);

    router.get('/:handle', website.home);
    router.get('/:handle/:slug', website.home);
};