var contracts = require('eris-contracts');
var fs = require ('fs');
var chainUrl = 'http://simplechain:1337/rpc';
var accounts = require('./accounts.json');
var manager = contracts.newContractManagerDev(chainUrl,
  accounts.simplechain_full_000);

var contractAddress = require('./epm.json').getGSAddr;
var abi2 = JSON.parse(fs.readFileSync('./abi/ChainManager', 'utf8'));
var chainManager = manager.newContractFactory(abi2).at(contractAddress);

var titleChainABI = JSON.parse(fs.readFileSync('./abi/TitleChain', 'utf8'));
var titleABI = JSON.parse(fs.readFileSync('./abi/Title', 'utf8'));

exports.getTitleChainHead = function(req, res, next) {
  chainManager.head(function(err, result){
    var titleChain = manager.newContractFactory(titleChainABI).at(result);
    titleChain.description(function(err, description){
  	 res.send({description:description, address: result});
    })
  })
  next();
}

exports.getNextTitleChain = function(req, res, next) {
  chainManager.getNextTitleChain(req.params.address, function(err, result){
    var titleChain = manager.newContractFactory(titleChainABI).at(result);
    titleChain.description(function(err, description){
     res.send({description:description, address: result});
    })
  })
  next();

}
exports.initTitleChain = function(req, res, next) {
  chainManager.initTitleChain(req.params.description, function(err, result){
    res.send({address: result});
  })
  next();
}

exports.putTitle = function(req, res, next) {
  var titleChain = manager.newContractFactory(titleChainABI).at(req.params.titleChainAddress);
  titleChain.putTitle(req.params.description, function(err, result){
    res.send({address: result});
  })
  next();
}


exports.getPrevTitleChain = function(req, res, next) {
  chainManager.getPrevTitleChain(req.params.address, function(err, result){
    var titleChain = manager.newContractFactory(titleChainABI).at(result);
    titleChain.description(function(err, description){
     res.send({description:description, address: result});
    })
  })
  next();
}

exports.getTitleHead = function(req, res, next) {
  var titleChainAddress = req.params.titleChainAddress;
  var titleChain = manager.newContractFactory(titleChainABI).at(titleChainAddress);
  titleChain.head(function(err, result){
    var title = manager.newContractFactory(titleABI).at(result);
    title.description(function(err, description){
      res.send({address: result, description: description});
    })
  })
  next();
}

exports.getTitleNext = function(req, res, next) {
  var titleChainAddress = req.params.titleChainAddress;
  var titleChain = manager.newContractFactory(titleChainABI).at(titleChainAddress);
  titleChain.getNext(req.params.address, function(err, result){
    var title = manager.newContractFactory(titleABI).at(result);
    title.description(function(err, description){
      res.send({address: result, description: description});
    });
  })
  next();
}

exports.getTitlePrevious = function(req, res, next) {
  var titleChainAddress = req.params.titleChainAddress;
  var titleChain = manager.newContractFactory(titleChainABI).at(titleChainAddress);
  titleChain.getPrev(req.params.address, function(err, result){
    var title = manager.newContractFactory(titleABI).at(result);
    title.description(function(err, description){
      res.send({address: result, description: description});
    })
  })
  next();
}