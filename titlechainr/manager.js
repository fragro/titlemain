'use strict';
var contracts = require('eris-contracts');
var accounts = require('./accounts.json');
var chainUrl;

chainUrl = 'http://simplechain:1337/rpc';

// Instantiate the contract object manager using the chain URL and the account
// data.
exports.manager = contracts.newContractManagerDev(chainUrl,
  accounts.simplechain_full_000);