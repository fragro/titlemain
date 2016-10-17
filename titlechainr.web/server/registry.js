/*

The Registry maps am unique location information to
an address in the IPTN.
*/


/*generates a registry skeleton for testing */ 
genRegistryItem = function(obj){
	var testReg = [];
	var testOrder = ['state', 'county', 'city', 'sub', 'block', 'lot']
	for(var i in testOrder){
		if(obj[testOrder[i]]){
			testReg.push([testOrder[i], obj[testOrder[i]]]);
		}
	}
	return testReg;
}

iterateRegistry = function(locationCoords){
	if(!locationCoords){
		return {error:'Must have location coordinates.'}
	}
	//var locationCoords = ["earth", "united-states", "oklahoma", "oklahoma county", "oklahoma city", "volz", "12", "6"];
	locationCoords = JSON.stringify(locationCoords)
	var urlAddr = BLOCKCHAIN_API + "/registry/iterate/" + encodeURIComponent(locationCoords);
	var regResult = Meteor.http.call("GET", urlAddr);
	return regResult;
}

setLeaf = function(nodeAddress, titleChainAddr){
	var urlAddr = BLOCKCHAIN_API + "/registry/setleaf/" + nodeAddress + "/" + titleChainAddr;
	var regResult = Meteor.http.call("GET", urlAddr);
	return regResult;
}

isLeaf = function(nodeAddress){
	var urlAddr = BLOCKCHAIN_API + "/registry/isleaf/" + nodeAddress;
	var regResult = Meteor.http.call("GET", urlAddr);
	return regResult;
}
/*Save reference to file in the blockchain under the appropriate space */
saveFile = function(obj, pdfHash){
	//lot can have multiple values we need to acknowledge that within our 
	//registry search
	var iterateLots = [];
	if(obj['lot']){
		if( Object.prototype.toString.call( obj['lot'] ) === '[object Array]' ) {
		    iterateLots = obj['lot'];
		}
		else{
			iterateLots = [{num: obj['lot']}];
		}
	}
	//for each unique lot
	for(var i in iterateLots){
		obj['lot'] = iterateLots[i].num;
		var testReg = genRegistryItem(obj);
		var dt = new Date();
		dt = dt.getUnixTime();
		var titleObj = JSON.stringify({date: dt, pdfHash:pdfHash});
		var nodeAddressData = iterateRegistry(testReg);
		console.log('nodeAddressData');
		console.log(nodeAddressData.data)
		var isLeafData = isLeaf(nodeAddressData.data.address);
		console.log(isLeafData.data);
		if(isLeafData.data.isLeaf){
			//put title on existing titlechain
			console.log('create new title')
			putNewTitle(isLeafData.data.titlechain, titleObj);
		}
		else{
			//create a new title chain
			console.log('create new titlechain')
			var addressData = createNewTitleChain(testReg);
			console.log(addressData.data)
			//set this node to a leaf and record the
			//titlechain address in leaf node
			console.log('setLeaf for ' + nodeAddressData.data.address  + " " + addressData.data.address );
			setLeaf(nodeAddressData.data.address, addressData.data.address);
			//now append a new title to the titlechain
			putNewTitle(addressData.data.address, titleObj);
		}
	}
}

Meteor.methods({
	iterateRegistry: function(locationCoords){
		//returns the address of the leaf node
		return iterateRegistry(locationCoords);
	},
	isLeaf: function(nodeAddress){
		return isLeaf(nodeAddress);
	},
	setLeaf: function(nodeAddress, titleChainAddr){
		return setLeaf(nodeAddress, titleChainAddr);
	},
  	saveFile: function(obj, pdfHash){
  		//saves file to the ipfs and then
  		saveFile(obj, pdfHash);
  	}
})