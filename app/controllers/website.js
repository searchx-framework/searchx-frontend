'use strict';

var request = require('request');

exports.home = function(req, res) {
    res.render('layout', {
        userId: req.session.userId || ''
    });
};

exports.auth = function(req, res) {
    var code = req.query.code;

    var options = {
        uri: 'http://127.0.0.1:3001/v1/oauth2/token',
        method: 'POST',
        json: {
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:8080/index2.html/auth'
        }
    };
    request.post(options, function(error, response, body) {
        // TODO: handle unsuccessful login attempts
        var userId = body.access_token.user;
        req.session.userId = userId;
        res.redirect('/');
    }).auth('56b118f1b04b463200dbaef1', 'QAUsSB5YpKKprZVqpCzfBNh6gA2dPvfg5kxCkAdR5CL8q528', true);
};

exports.logout = function(req, res) {
    req.session.userId = null;
    res.redirect('/');
};