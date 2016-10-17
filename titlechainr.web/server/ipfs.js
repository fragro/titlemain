
/* must have eris installed and ipfs service running */
putPDF = function(obj){
	//take the pdfPath
	exec = Npm.require('child_process').exec;
	cmd = Meteor.wrapAsync(exec);
	var dir, res;
	var processDir = FILE_DIR + obj.path;
	var hashAddress = cmd("eris files put " + processDir);
	if(hashAddress){
		return fixPdfHash(hashAddress);
	}
}

/* must have eris installed and ipfs service running */
cachePDF = function(hash){
	//take the pdfPath
	exec = Npm.require('child_process').exec;
	cmd = Meteor.wrapAsync(exec);
	var dir, res;
	var hashAddress = cmd("eris files cache " + hash);
	return hashAddress;
}

/* must have eris installed and ipfs service running */
getPDF = function(hash, name){
	//take the pdfPath
	exec = Npm.require('child_process').exec;
	cmd = Meteor.wrapAsync(exec);
	var dir, res;
	var hashAddress = cmd("eris files get " + hash + " " + name);
	return hashAddress;
}
//fix the pdfHash from eris files output
fixPdfHash = function(hsh){
	hsh = hsh.split('/ipfs/');
	hsh = hsh[1];
	hsh = hsh.trim();
	return hsh;
}

Meteor.methods({
  	putPDF: function(obj){
  		return putPDF(obj);
  	},
  	getPDF: function(hash, name){
  		return getPDF(hash, name);
  	}
})