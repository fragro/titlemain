'use strict';
var restify = require('restify');
var contracts = require('eris-contracts');
var fs = require('fs');
var bootstrap = require('./bootstrap.js');
var chainManagerFactory = require('./chainManager.js');
var registryFactory = require('./registryManager.js');
var managerWrapper = require('./manager.js');
var http = require('http');
var server;

var server = restify.createServer({
  name: 'titlechainr',
  version: '1.0.0'
});

function test(req, res, next) {
  var address = bootstrap.bootStrapTitleChainDemo(chainManager, res);
  next();
}

function op(func){
  console.log(this);
  func();
}

var server = restify.createServer();
server.get('/test', test);
server.get('/registry/iterate/:location', registryFactory.iterate);
server.get('/registry/setleaf/:nodeAddress/:titleChainAddr', registryFactory.setLeaf);
server.get('/registry/isleaf/:nodeAddress', registryFactory.isLeaf);
server.get('/titlechain/head', chainManagerFactory.getTitleChainHead);
server.get('/titlechain/put/:description', chainManagerFactory.initTitleChain);
server.get('/titlechain/next/:address', chainManagerFactory.getNextTitleChain);
server.get('/titlechain/prev/:address', chainManagerFactory.getPrevTitleChain);
server.get('/title/put/:titleChainAddress/:description', chainManagerFactory.putTitle);
server.get('/title/head/:titleChainAddress', chainManagerFactory.getTitleHead);
server.get('/title/next/:titleChainAddress/:address', chainManagerFactory.getTitleNext);
server.get('/title/prev/:titleChainAddress/:address', chainManagerFactory.getTitlePrevious);

server.listen(process.env.IDI_PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});