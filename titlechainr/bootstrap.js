var contracts = require('eris-contracts');
var fs = require ('fs');
var chainUrl = 'http://simplechain:1337/rpc';
var accounts = require('./accounts.json');
var manager = contracts.newContractManagerDev(chainUrl,
  accounts.simplechain_full_000);

creatTitleChain1 = function(titleChain){
	var titleNumber = Math.floor(Math.random() * 7) + 1;
	for(var i=0;i<=titleNumber;i++){
		var description = 'newTitle' + i;
		titleChain.putTitle(description, function(error, result){
			if(!result){
				console.log('ERR: Bootstraping ' + description);
			}
		});
	}
}

exports.bootStrapTitleChainDemo = function(chainManager, res){
	//create a new titleChain
	var lotNumber = Math.floor(Math.random() * 1000); 
	var description = "LOT_" + lotNumber;
	chainManager.initTitleChain(description, function(error, address){
		//bootstrap titleChain data
		var tcabi = JSON.parse(fs.readFileSync('./abi/TitleChain', 'utf8'));
		var titleChain = manager.newContractFactory(tcabi).at(address);
		creatTitleChain1(titleChain);
		res.send(address);
	});
}