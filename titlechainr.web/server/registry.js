/*

The Registry maps am unique location information to
an address in the IPTN.
*/

TEST_ORDER = ['state', 'county', 'city', 'section', 'township', 'townshipDir', 'range', 'rangeDir', 'sub', 'block', 'lot']
ADDITIONAL_FIELDS = ['ordinal']

/* iterates through registry with given location information
	and returns corresponding title chain */
searchTitleChain = function(data){
	console.log(data);
	var reg = genRegistryItem(data);
	console.log(reg);
	var nodeAddress = iterateRegistry(reg);
	var leafData = isLeaf(nodeAddress.data.address);
	console.log(leafData.data);
	if(leafData.data.isLeaf){
		//hit!
		return retrieveTitles(leafData.data.titlechain);
	}
	else{
		return {err:true, msg:"Titles Not Found."}
	}
}
/*generates a registry skeleton for testing */ 
genTitleChainItem = function(obj, regItem){
	var testReg = [];
	for(var i in TEST_ORDER){
		if(obj[TEST_ORDER[i]]){
			testReg.push([TEST_ORDER[i], obj[TEST_ORDER[i]]])
		}
	}
	testReg.push(regItem[1])
	return testReg;
}

/*generates total location information */ 
genLocationItem = function(obj){
	var testReg = {};
	for(var i in TEST_ORDER){
		if(obj[TEST_ORDER[i]]){
			testReg[TEST_ORDER[i]] = encodeURIComponent(obj[TEST_ORDER[i]])
		}
	}
	for(var i in ADDITIONAL_FIELDS){
		if(obj[ADDITIONAL_FIELDS[i]]){
			testReg[ADDITIONAL_FIELDS[i]] = encodeURIComponent(obj[ADDITIONAL_FIELDS[i]])
		}
	}
	return testReg;
}
/*generates a registry skeleton for testing */ 
genRegistryItem = function(obj){
	var testReg = "";
	for(var i in TEST_ORDER){
		if(obj[TEST_ORDER[i]]){
			testReg += TEST_ORDER[i] + ":" + obj[TEST_ORDER[i]] + ';';
		}
	}
	//geterating registry item
	console.log(testReg);
	var hsh = hashData(testReg);
	return [['root', 0], ['hash', hsh]];
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

getLeaf = function(nodeAddress){
	var urlAddr = BLOCKCHAIN_API + "/registry/getleaf/" + nodeAddress;
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
saveFile = function(obj, pdfHash, cls){
	console.log('save file');
	console.log(obj);
	//lot can have multiple values we need to acknowledge that within our 
	//registry search
	var iterator = [];
	if(obj['lot']){
		if( Object.prototype.toString.call( obj['lot'] ) === '[object Array]' ) {
		    iterator = obj['lot'];
		}
		else{
			iterator = [{num: obj['lot']}];
		}
		MOD = 'lot';
	}
	else if(obj['ordinal']){
	    iterator = obj['ordinal'];
		MOD = 'ordinal';
	}
	console.log(iterator);
	//for each unique lot
	for(var i in iterator){
		if(MOD == 'lot'){
			obj[MOD] = iterator[i].num;
		}
		else{
			obj[MOD] = iterator[i];
		}
		var testReg = genRegistryItem(obj);
		var titlechainObj = genTitleChainItem(obj, testReg);
		var dt = new Date();
		dt = dt.getUnixTime();
		var titleObj = JSON.stringify({date: dt, pdfHash:pdfHash, location: genLocationItem(obj), titleClass:cls});
		console.log('saving...')
		console.log(testReg);
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
			console.log(titlechainObj)
			var addressData = createNewTitleChain(titlechainObj);
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
	search: function(data){
		return searchTitleChain(data);
	},
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
  		console.log('calling save locations!');
  		//saves file to the ipfs and then
  		console.log(obj);
  		for(var i in obj['locations']){
  			saveFile(obj['locations'][i], pdfHash, obj['class']);
  		}
  	}
})