Meteor.subscribe('files.titles.all');

Template.files.helpers({
  files: function () {
    return Titles.find();
  },
  parsed: function() {
  	return Session.get("parseResponse");
  },
  processing: function(){
  	return Session.get("processing");
  }
});
Template.files.onCreated(function () {
  Session.set("processing", "");
});
Template.files.events({
	'click #processPDF': function(event, template){
		pdfToPng(this);
	},
	'click #ocr': function(event, template){
		ocr(this);
	},
	'click #remove': function(event, template){
		event.preventDefault();
		console.log(this._id);
		Meteor.call("removeTitle", this._id);
	},
	'click #parse': function(event, template){
		parseTitle(this);
	},
	'click #save': function(event, template){
		saveFile(this);
	},
	'click #removeFiles': function(event, template){
		Meteor.call("removeTitles");
	},
	'click #removeRegistry': function(event, template){
		Meteor.call("removeRegistry");
	}
})
Template.file.helpers({
	hasLegalCoordinates: function(){
		console.log(this)
		return getLegalRating(this);
	},
	getLegalColor: function(){
		console.log(this)
		var score = getLegalRating(this);
		if(score > 90){
			return "green";
		}
		else if(score > 60){
			return "yellow";
		}
		else if(score > 30){
			return "orange";
		}
		else{
			return "red";
		}
	}
})