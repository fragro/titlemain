import { FilesCollection } from 'meteor/ostrio:files';
var fileExists = require('file-exists');

OCR_API = process.env.OCR_API;

Meteor.publish('files.titles.all', function () {
	return Titles.find().cursor;
});

/*transform number into three digit string format */
getIntr = function(numRange, i){
	if(numRange[i] <= 9){
		intr = '-00';
	}
	else if(numRange[i] <= 99){
		intr = '-0';
	} 
	else{
		intr = '-';
	}
	return intr + numRange[i];
}
/*
Takes filePath of a pdf and output a number of PNGs
*/
pdfToPng = function(filePath){
	exec = Npm.require('child_process').exec;
	cmd = Meteor.wrapAsync(exec);
	var dir, res;
	processDir = filePath;
	pngDir = filePath;
	console.log(pngDir);
	cmd("pdfimages -png " + processDir + " " + pngDir);
	//res = cmd("pdftoppm -rx 300 -ry 300 -png " + processDir + "-no-text " + pngDir);
	//lets see how many files we generated exactly
	var numRange = _.range(99);
	var numPages = 0;
	var keepGoing = false;
	var filePathTest = "";
	var intr = '-';
	for(var i in numRange){
		intr = getIntr(numRange, i);
		filePathTest = filePath + intr + '.png';
		keepGoing = fileExists(filePathTest)
		if(!keepGoing){
			numPages = numRange[i];
			break;
		}
	}
	return numPages;
}
/*
Takes filePath of a pdf assuming PNG is generated an
output the directory of the txt with the character information
*/
ocr = function(filePath, numPages){
	exec = Npm.require('child_process').exec;
	cmd = Meteor.wrapAsync(exec);
	var dir, res;
	var numRange = _.range(numPages);
	var txtDir = filePath;
	for(var i in numRange){
		var intr = getIntr(numRange, i);
		var processDir = filePath + intr + '.png';
		var ret = cmd("tesseract " + processDir + " " + txtDir + intr);
	}
	return txtDir;
}
/*
Access Python parsing service to pull metadata from document
txt that has been through OCR process
*/
parseTitle = function(filePath, numPages){
	console.log(filePath);
	var numRange = _.range(numPages);
    var fs = Npm.require('fs');
    var data = "";
    console.log(numPages)
    // file originally saved as public/data/taxa.csv
	for(var i in numRange){
		var intr = getIntr(numRange, i);
	    var datapath = filePath + intr + '.txt';
	    console.log(datapath)
	    var dataAppend = fs.readFileSync(datapath, 'utf8');
	    console.log(dataAppend.length);
	    data = data + "\n" + dataAppend;
	}
	console.log('calling ocr API')
    var response = Meteor.http.call("POST", OCR_API + '/ocr', {data:{text:data}});
    console.log(response);
    return response;
}

Meteor.methods({
	pdfToPng: function(filePath) {
		return pdfToPng(filePath)
	},
	ocr: function(filePath, numPages) {
		return ocr(filePath, numPages)
	},
	removeTitles: function(){
		//TODO: need to delete the files associated with this...
		Titles.remove({});
	},
	removeTitle: function(id){
		//TODO: need to delete the files associated with this...
		Titles.remove(id);
	},
	parseTitle: function (filePath, numPages){
		return parseTitle(filePath, numPages);
  	}
});