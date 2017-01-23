<a name="module_qlik-api-qps"></a>

## qlik-api-qps
[![GitHub version](https://badge.fury.io/gh/pouc%2Fqlik-api-qps.svg)](https://badge.fury.io/gh/pouc%2Fqlik-api-qps)[![npm version](https://badge.fury.io/js/qlik-api-qps.svg)](https://badge.fury.io/js/qlik-api-qps)[![NPM monthly downloads](https://img.shields.io/npm/dm/qlik-api-qps.svg?style=flat)](https://npmjs.org/package/qlik-api-qps)[![Build Status](https://travis-ci.org/pouc/qlik-api-qps.svg?branch=master)](https://travis-ci.org/pouc/qlik-api-qps)[![Dependency Status](https://gemnasium.com/badges/github.com/pouc/qlik-api-qps.svg)](https://gemnasium.com/github.com/pouc/qlik-api-qps)[![Coverage Status](https://coveralls.io/repos/github/pouc/qlik-api-qps/badge.svg?branch=master)](https://coveralls.io/github/pouc/qlik-api-qps?branch=master)nodejs wrapper for the Qlik Sense QPS API

**Author:** Lo&iuml;c Formont  
**License**: MIT Licensed  
**Example**  
```javascriptvar qpsApi = require('qlik-api-qps')({    restUri: 'https://localhost',    prefix: 'test',    pfx: pfx,    UserId: 'qlikservice',    UserDirectory: '2008R2-0'});qpsApi.ticket.post(postParams).then(function(Ticket) {	console.log(Ticket)})```
