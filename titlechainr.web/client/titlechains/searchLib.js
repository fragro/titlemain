//scrape the search data from form and post errors if found
scrapeSearchData = function(){
	var valueListing = {};
	var options = ['state', 'county', 'city', 'section', 'township', 'townshipDir', 'range', 'rangeDir', 'sub', 'block', 'lot'];
	for(var i in options){
		var tempVal =  getSelectValue(options[i]);
		if(!tempVal){
			//one of the values is undefined, we need complete
			//information to search
			//Session.set('searchError', options[i] + " is not defined.")
		}
		else{
			valueListing[options[i]] = tempVal.toLowerCase();
		}
	}
	Session.set('searchOptions', valueListing);
	return valueListing;
}
//get the value from a select field
getSelectValue = function(id){
	var e = document.getElementById(id);
	if(!e){
		console.log(id);
	}
	if(e.selectedIndex){
		var value = e.options[e.selectedIndex].value;
		var text = e.options[e.selectedIndex].text;
	}
	else{
		return $('#' + id).val();
	}
	return text;
}

//get the data from the form, create the hash, and query the blockchain
searchChain = function(){
	var data = scrapeSearchData();
	//now send to server
	Meteor.call("search", data, function(err, res){
		Session.set("searchResults", res);
	    Session.set('loading', false);
	});
}