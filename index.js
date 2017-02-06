var url = require('url');

var extend = require('extend');
var urljoin = require('url-join');

var undef = require('ifnotundef');
var qreq = require('qlik-request');

/**
 *
 * [![GitHub version](https://badge.fury.io/gh/pouc%2Fqlik-api-qps.svg)](https://badge.fury.io/gh/pouc%2Fqlik-api-qps)
 * [![npm version](https://badge.fury.io/js/qlik-api-qps.svg)](https://badge.fury.io/js/qlik-api-qps)
 * [![NPM monthly downloads](https://img.shields.io/npm/dm/qlik-api-qps.svg?style=flat)](https://npmjs.org/package/qlik-api-qps)
 * [![Build Status](https://travis-ci.org/pouc/qlik-api-qps.svg?branch=master)](https://travis-ci.org/pouc/qlik-api-qps)
 * [![Dependency Status](https://gemnasium.com/badges/github.com/pouc/qlik-api-qps.svg)](https://gemnasium.com/github.com/pouc/qlik-api-qps)
 * [![Coverage Status](https://coveralls.io/repos/github/pouc/qlik-api-qps/badge.svg?branch=master)](https://coveralls.io/github/pouc/qlik-api-qps?branch=master)
 *
 * nodejs wrapper for the Qlik Sense QPS API
 *
 * @module qlik-api-qps
 * @typicalname template
 * @author Lo&iuml;c Formont
 *
 * @license MIT Licensed
 *
 * @example
 * ```javascript
 * var qpsApi = require('qlik-api-qps')({
 *     restUri: 'https://localhost',
 *     prefix: 'test',
 *     pfx: pfx,
 *     UserId: 'qlikservice',
 *     UserDirectory: '2008R2-0'
 * });
 *
 * qpsApi.ticket.post(postParams).then(function(Ticket) {
 * 	console.log(Ticket)
 * })
 * ```
 */
module.exports = function(options) {

    var uriOpts = {
        protocol: 'https:',
        hostname: 'localhost',
        port: 4243,
        pathname: '/qps/',
    };

    if (undef.isnot(options, 'qpsRestUri')) {

        var parsedQpsRestUri = url.parse(options.qpsRestUri);

        uriOpts.protocol = parsedQpsRestUri.protocol;
        uriOpts.hostname = parsedQpsRestUri.hostname;
        uriOpts.port = parsedQpsRestUri.port;
        uriOpts.pathname = parsedQpsRestUri.pathname;

    } else if (undef.isnot(options, 'restUri')) {

        var parsedRestUri = url.parse(options.restUri);

        uriOpts.hostname = parsedRestUri.hostname;

    }

    uri = url.format(uriOpts);

    var addOpts = {
        headers:            undef.child(options, 'headers', undefined),

        ca:                 undef.child(options, 'ca', undefined),
        cert:               undef.child(options, 'cert', undefined),
        key:                undef.child(options, 'key', undefined),

        rejectUnauthorized: undef.child(options, 'rejectUnauthorized', true),
        agent:              undef.child(options, 'agent', false),
        method:             undef.child(options, 'method', 'GET')
    };

    function generateRestUri(path) {
        return undef.is(path) ? uri : urljoin(uri, path);
    }

    return {

        restUri: generateRestUri,

        registerOn: function(enigma) {
            var qps = new Qps();
            enigma.registerService('qps', qps.connect.bind(qps));
        },

        /**
         * @namespace
         * @memberOf Qlik.apis.qps
         */
        ticket: {
            /**
             * This returns a JSON object containing the same UserId and an authentication ticket (Ticket):
             *
             * /qps/{virtual proxy/}ticket
             *
             * @memberOf Qlik.apis.qps.ticket
             *
             * @example
             * ```javascript
             * qpsApi.ticket.post(postParams).then(function(Ticket) {
             * 	console.log(Ticket)
             * })
             * ```
             *
             * @param {Object} postParams the ticket definition to post
             * @returns {Promise.<Ticket>} a promise resolving to the ticket
             */
            post: function(postParams) {
                return qreq.request(extend(false, {}, addOpts, {
                    restUri: generateRestUri(`/ticket`),
                    method: 'POST'
                }), postParams);
            }
        },
        /**
         * @namespace
         * @memberOf Qlik.apis.qps
         */
        user: {
            /**
             * This returns all proxy sessions that a user (identified by {directory} and {id}) has.
             *
             * /qps/{virtual proxy/}user/{directory}/{id}
             *
             * @memberOf Qlik.apis.qps.user
             *
             * @example
             * ```javascript
             * qpsApi.user.get(directory, id).then(function(Sessions) {
             * 	console.log(Sessions)
             * })
             * ```
             *
             * @param {string} directory the user directory
             * @param {string} id the user id
             * @returns {Promise.<Array.<Session>>} a promise resolving to a list of sessions
             */
            get: function(directory, id) {
                return qreq.request(extend(false, {}, addOpts, {
                    restUri: generateRestUri(`/user/${directory}/${id}`)
                }));
            },
            /**
             * This is part of the Logout API. The directory and ID are the same UserDirectory and UserId as those that were sent in POST /qps/{virtual proxy/}ticket.
             *
             * A list of all proxy sessions that were connected to the deleted user is returned.
             *
             * /qps/{virtual proxy/}user/{directory}/{id}
             *
             * @memberOf Qlik.apis.qps.user
             *
             * @example
             * ```javascript
             * qpsApi.user.delete(directory, id).then(function(Sessions) {
             * 	console.log(Sessions)
             * })
             * ```
             *
             * @param {string} directory the user directory
             * @param {string} id the user id
             * @returns {Promise.<Array.<Session>>} a promise resolving to a list of disconnected sessions
             */
            delete: function(directory, id) {
                return qreq.request(extend(false, {}, addOpts, {
                    restUri: generateRestUri(`/user/${directory}/${id}`),
                    method: 'DELETE'
                }));
            }
        },
        /**
         * @namespace
         * @memberOf Qlik.apis.qps
         */
        session: {
            /**
             * This returns the proxy session identified by {id}.
             *
             * /qps/{virtual proxy/}session/{id}
             *
             * @memberOf Qlik.apis.qps.session
             *
             * @example
             * ```javascript
             * qpsApi.session.get(id).then(function(Session) {
             * 	console.log(Session)
             * })
             * ```
             *
             * @param {string} id the session id
             * @returns {Promise.<Session>} a promise resolving to a session
             */
            get: function(id) {
                return qreq.request(extend(false, {}, addOpts, {
                    restUri: generateRestUri(`/session/${id}`)
                }));
            },
            /**
             * This adds a new proxy session.
             *
             * /qps/{virtual proxy/}session
             *
             * @memberOf Qlik.apis.qps.session
             *
             * @example
             * ```javascript
             * qpsApi.session.post(postParams).then(function(Session) {
             * 	console.log(Session)
             * })
             * ```
             *
             * @param {Object} postParams the session to create
             * @returns {Promise.<Session>} a promise resolving to a session
             */
            post: function(postParams) {
                return qreq.request(extend(false, {}, addOpts, {
                    restUri: generateRestUri(`/session`),
                    method: 'POST'
                }), postParams);
            },
            /**
             * This deletes the proxy session identified by {id} and returns it as a session struct.
             *
             * /qps/{virtual proxy/}session/{id}
             *
             * @memberOf Qlik.apis.qps.session
             *
             * @example
             * ```javascript
             * qpsApi.session.delete(id).then(function(Session) {
             * 	console.log(Session)
             * })
             * ```
             *
             * @param {string} id the session id
             * @returns {Promise.<Session>} a promise resolving to the session that was deleted
             */
            delete: function(id) {
                return qreq.request(extend(false, {}, addOpts, {
                    restUri: generateRestUri(`/session/${id}`),
                    method: 'DELETE'
                }));
            }
        }
    };
};

class Qps {
    constructor() {}

    connect(config) {

        undef.try(config);

        var options = {
            restUri: url.format({
                protocol: (config.unsecure) ? 'http:' : 'https:',
                hostname: config.host,
                port: config.port
            }),
            ca: undef.child(config, ['certs', 'ca'], undefined),
            cert: undef.child(config, ['certs', 'cert'], undefined),
            key: undef.child(config, ['certs', 'key'], undefined),
        };

        var qpsApi = module.exports(options);
        var promise = undef.if(config.promise, global.Promise);

        return promise.resolve(qpsApi);
    }
}
