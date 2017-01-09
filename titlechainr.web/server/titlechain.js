BLOCKCHAIN_API = "http://localhost:8082";


/*retrieve a single title chain*/
getTitleChainAddr = function(nodeAddress){
	//given a node address we grab the title chain
}
/* Expensive recursive function to aggregate all TitleChains stored in the blockchain */
getAllTitleChain = function(addr, data, itr){
	console.log('gettin ' + addr);
	var prevTitleChain = Meteor.http.call("GET", BLOCKCHAIN_API + "/titlechain/prev/" + addr);
	//base case return
	if(nullBlockChainAddress(prevTitleChain.data.address)){
		//data.push(prevTitleChain);
		return data;
	}
	else{
		data.push(prevTitleChain.data);
		itr+=1;
		if(itr > 100){
			//hard limit
			return data;
		}
		return getAllTitleChain(prevTitleChain.data.address, data, itr);
	}
}
/* Get all titles from a given titleChainAddr */
getAllTitles = function(chainAddr, addr, data, itr){
	console.log("gettin " + chainAddr + ":" + addr);
	var prevTitleChain = Meteor.http.call("GET", BLOCKCHAIN_API + "/title/prev/" + chainAddr + "/" + addr);
	//base case return
	console.log(prevTitleChain.data)
	if(nullBlockChainAddress(prevTitleChain.data.address)){
		//data.push(prevTitleChain);
		return data;
	}
	else{
		data.push(prevTitleChain.data);
		itr+=1;
		if(itr > 100){
			//hard limit
			return data;
		}
		return getAllTitles(chainAddr, prevTitleChain.data.address, data);
	}
}
createNewTitleChain = function(obj_str){
	obj_str = encodeURIComponent(obj_str)
	var titleChainAddress = Meteor.http.call("GET", BLOCKCHAIN_API + "/titlechain/put/" + obj_str);
	return titleChainAddress;
}
putNewTitle = function(titleChainAddress, title_str){
	console.log(titleChainAddress)
	console.log(title_str)
	var titleChainAddress = Meteor.http.call("GET", BLOCKCHAIN_API + "/title/put/" + titleChainAddress + "/" + title_str);
	return titleChainAddress;	
}
/*Save reference to file in the blockchain under the appropriate space */
/*saveFile2 = function(obj, pdfHash){
	//fix pdfHash, might as well do it here
	pdfHash = fixPdfHash(pdfHash)
	console.log(pdfHash);
	var registryObj = checkRegistry(obj);
	var dt = new Date();
	dt = dt.getUnixTime();
	var titleObj = JSON.stringify({date: dt, pdfHash:pdfHash});
	if(registryObj){
		console.log('exists')
		putNewTitle(registryObj.address, titleObj);
		//title location already exists in registry
		//appendToBlockChain(address, obj);
	}
	else{
		//doesnt exist yet create new titlechain
		var regItem = genRegistryItem(obj);
		regItem = JSON.stringify(regItem);
		var addressData = createNewTitleChain(regItem);
		var rId = putRegistry(obj);
		//now update the registry item with the Titlechain addreess!
		if(!addressData.address){
			console.log('ERROR: no blockchain address!');
		}
		updateRegistry(rId, addressData.address);
		putNewTitle(addressData.address, titleObj);
		console.log(addressData);
		console.log(rId);
		//stringify the obj
		//appendToBlockChain(addressData.address, obj);
	}
}*/
retrieveTitles = function(titleChainAddress){
	var titleHeadAddress = Meteor.http.call("GET", BLOCKCHAIN_API + "/title/head/" + titleChainAddress);
	console.log(titleHeadAddress);
	var titles = getAllTitles(titleChainAddress, titleHeadAddress.data.address, [titleHeadAddress.data], 0);
	return {address: titleHeadAddress.data, titles: titles };
}
Meteor.methods({
	getAllTitleChains: function(){
		var titleChainAddress = Meteor.http.call("GET", BLOCKCHAIN_API + "/titlechain/head");
		var titleChains = getAllTitleChain(titleChainAddress.data.address, [titleChainAddress.data], 0);
		return {address: titleChainAddress.data, chains: titleChains };
	},
	getAllTitles: function(titleChainAddress){
		return retrieveTitles(titleChainAddress);
	},
	bootstrapTitleChain: function () {
		var titleChainAddress = Meteor.http.call("GET", BLOCKCHAIN_API + "/test");
		return {address: titleChainAddress.data };
	},
});