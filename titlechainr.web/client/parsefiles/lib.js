LOC_COORDS = ["sub", "lot", "block", "county", "state"];
RURAL_COORDS = ["state", "county", "ordinal", "range", "rangeDir", "section", "township", "townshipDir"]
/*process pdf to PNG on server */
pdfToPng = function(obj){
  Session.set("processing", "Processing PDF...");
  Meteor.call("pdfToPng", obj.path, function(err, res){
  		Session.set("processing", false);
	  	var numPages = res;
		Titles.update({_id: obj._id},{$set: {numPages: numPages}});
  })
}
/* run OCR command on server */
ocr = function(obj){
    Session.set("processing", "Object Character Recognition...");
	Meteor.call("ocr", obj.path, obj.numPages, function(err, res){
	  	Session.set("processing", false);
	});
}
parseTitle = function(obj){
    Session.set("processing", "Parse Content...");
	Meteor.call("parseTitle", obj.path, obj.numPages, function(err, res){
	  	Session.set("parseResponse", res);
	  	Session.set("processing", false);
		var newTitleInfo = JSON.parse(res.content);
		if(_.size(newTitleInfo) > 0){
			Titles.update({_id: obj._id},{$set: newTitleInfo});
		}
	});
}
saveFile = function(obj){
	//first we need to store the PDF in IPFS and attach that
	//hash to the blockchain
	if(getRating(obj) == 100){
		//test to make sure we have complete information
		//before saving the document in the blockchain
	    Session.set("processing", "Caching " + obj.name + " to IPFS");
	    Meteor.call("putPDF", obj, function(err, pdfHash){
	    	console.log(pdfHash);
			updateProcessingChip(obj.name + " stored in IPFS")
	    	Titles.update({_id: obj._id}, {$set: {pdfHash:pdfHash}});
		    Session.set("processing", "Saving Record in BlockChain...");
		    Meteor.call("saveFile", obj, pdfHash, function(err, res){
				successProcessingChip(obj.name + " processed and saved in Blockchain")
			  	Session.set("processing", false);
		    });
	    });
	}
	else{
		//report the error to the user
		errorProcessingChip("Missing location information, cannot store on Blockchain")
	  	Session.set("processing", false);
	}
}

getRating = function(obj){
	for(var i in obj['locations']){
		if(obj['locations'][i]['ordinal']){
			return getLegalRating(obj['locations'][i], RURAL_COORDS)
		}
		else{
			return getLegalRating(obj['locations'][i], LOC_COORDS)
		}
	}
}
//get rating based on legal location information available
getLegalRating = function(obj, coords){
	var totalLength = 0;
	var score = 0;
	for(var j in coords){
		if(obj[coords[j]]){
			score+=1;
		}
		totalLength += 1;
	}
	var numObj = (score/totalLength * 100);
	return numObj.toPrecision(3);
}

//pdfToPng, ocr, and parseTitle all in one for production/demo purposes
processPDF = function(obj){
  	var numPages;
  	Session.set("processing", "Processing PDF...");
  	Meteor.call("pdfToPng", obj.path, function(err, res){
		updateProcessingChip("PNG Generated " + res + " pages")
		numPages = res;
		Titles.update({_id: obj._id},{$set: {numPages: res}});
		Session.set("processing", "Object Character Recognition...");
		Meteor.call("ocr", obj.path, res, function(err, res){
			updateProcessingChip("Object Character Recognition")
	  	 	Session.set("processing", "Parse Content...");
			Meteor.call("parseTitle", obj.path, numPages, function(err, res){
		  		Session.set("processing", false);
	  			updateProcessingChip("Content Parsed on " + obj.name)
				Session.set("parseResponse", res);
				var newTitleInfo = JSON.parse(res.content);
				Titles.update({_id: obj._id},{$set: newTitleInfo});
				//manual update of object
				for(var i in newTitleInfo){
					obj[i] = newTitleInfo[i]
				}
				//var newTitle = Titles.findOne({_id: obj._id});
			    saveFile(obj);
			});
		});
  	});
}