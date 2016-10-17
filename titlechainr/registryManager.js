var contracts = require('eris-contracts');
var fs = require ('fs');
var chainUrl = 'http://simplechain:1337/rpc';
var accounts = require('./accounts.json');
var manager = contracts.newContractManagerDev(chainUrl,
  accounts.simplechain_full_000);

var registryContractAddress = require('./epm.json').getRAddr;
var nodeFactoryContractAddress = require('./epm.json').getNFAddr;

var rootNodeAbi = JSON.parse(fs.readFileSync('./abi/Registry', 'utf8'));
var root = manager.newContractFactory(rootNodeAbi).at(registryContractAddress);

var nodeFactoryABI = JSON.parse(fs.readFileSync('./abi/NodeFactory', 'utf8'));
var nodeFactory = manager.newContractFactory(nodeFactoryABI).at(nodeFactoryContractAddress);

var nodeABI = JSON.parse(fs.readFileSync('./abi/Node', 'utf8'));

/*iterate tree 
	res = response
	locL = [planet, nation, state, county, city, subdivision, block, lot]
	currentNode = rootnode/currentNode for recursive function
	["earth", "united-states", "oklahoma", "oklahoma county", "oklahoma city", "volz", "12", "6"]
*/
function iterateTree(res, locL, currentNode){
	//pop first item off of the list
	var currentLocation = locL[0];
	var currentLocationType = currentLocation[0];
	var currentLocationString = currentLocation[1];
	locL.shift();
	console.log(currentLocationString);
	currentNode.getChild(currentLocationString, function(err, result){
		console.log(result)
		if(result == "0000000000000000000000000000000000000000"){
			//we need to create the child node
			nodeFactory.createNode(currentLocationString, currentLocationType, function(err, nodeAddress){
				console.log(nodeAddress);
				//now set the new node as the currentNode's child
				currentNode.putChild(currentLocationString, nodeAddress, function(err, result){
					if(locL.length == 0){
						//this is a leaf node, send this nodeAddress
						res.send({status:0, address: nodeAddress});
					}
					else{
						//iterate with new node
						currentNode = manager.newContractFactory(nodeABI).at(nodeAddress);
						iterateTree(res, locL, currentNode);
					}
				});
			});
			//then iterate again with the new node
		}
		else{
			//node already exists, we need to get that node
			if(locL.length == 0){
				//this is a leaf node, send this nodeAddress
				res.send({status:1, address: result});
			}
			else{
				currentNode = manager.newContractFactory(nodeABI).at(result);
				iterateTree(res, locL, currentNode);
			}
		}
	});
	//from root iterate, if node doesn't exists create one
}

//create a new leaf at this nodeAddress with titleChain Addr
function setLeaf(res, nodeAddress, titleChainAddr){
	console.log('setLeaf')
	console.log(nodeAddress);
	console.log(titleChainAddr);
	var currentNode = manager.newContractFactory(nodeABI).at(nodeAddress);
	currentNode.setLeaf(titleChainAddr, function(err, result){
		res.send({status: "success"});
	});
}

//create a new leaf at this nodeAddress with titleChain Addr
function isLeaf(res, nodeAddress){
	console.log('isLeaf');
	console.log(nodeAddress);
	var currentNode = manager.newContractFactory(nodeABI).at(nodeAddress);
	currentNode.isLeaf(function(err, result){
		console.log(result);
		if(result){
			currentNode.titlechain(function(err, titlechainAddr){
				res.send({isLeaf: true, titlechain: titlechainAddr});
			})
		}
		else{
			res.send({isLeaf: false});
		}
	});
}


exports.iterate = function(req, res, next){
	var coords = req.params.location;
	if(coords){
		coords = decodeURIComponent(coords);
		var coordsFix = JSON.parse(coords);
		console.log(coordsFix);
		iterateTree(res, coordsFix, root);
	}
	else{
		console.log('no coords')
		console.log(req.params);
	}
	next();
}

exports.setLeaf = function(req, res, next){
	var nodeAddress = req.params.nodeAddress;
	var titleChainAddr = req.params.titleChainAddr;
	setLeaf(res, nodeAddress, titleChainAddr);
	next();
}

exports.isLeaf = function(req, res, next){
	var nodeAddress = req.params.nodeAddress;
	isLeaf(res, nodeAddress);
	next();
}