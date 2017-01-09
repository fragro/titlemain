Meteor.subscribe('files.titles.all');

Template.files.helpers({
  files: function () {
    return Titles.find();
  },
  parsed: function() {
  	var res = Session.get("parseResponse");
  	if(res){
	  	var ret = JSON.parse(res['content']);
	  	for(var i in ret['locations']){
			delete ret['locations'][i]['txt'];
	  	}
		return ret;
  	}
  },
  text: function() {
  	var res = Session.get("parseResponse");
  	if(res){
	  	var ret = JSON.parse(res['content']);
	  	for(var i in ret['locations']){
		  	ret['locations'][i]['txt'] = ret['locations'][i]['txt'].replace(/\n/g, '<br />');
		  	return ret['locations'][i]['txt']
	  	}
  	}
  },
  textMode: function(){
    return Template.instance().textMode.get();
  },
  processing: function(){
  	return Session.get("processing");
  },
  chains: function() {
  	return Session.get("mainchain");
    //return Template.instance().chains.get();
  },
  loading: function() {
    return Template.instance().loading.get();
  },
});
Template.files.onCreated(function () {
  Session.set("processing", "");
  this.loading = new ReactiveVar(false);
  this.textMode = new ReactiveVar(false);
});
Template.files.events({
	'click #processPDF': function(event, template){
		Materialize.toast('Processing PDF into PNG file!', 3000, 'rounded')
		pdfToPng(this);
	},
	'click #ocr': function(event, template){
		Materialize.toast('Calling OCR function!', 3000, 'rounded')
		ocr(this);
	},
	'click #remove': function(event, template){
		event.preventDefault();
		console.log(this._id);
		Meteor.call("removeTitle", this._id);
	},
	'click #parse': function(event, template){
		Materialize.toast('Parsing file into metadata!', 3000, 'rounded')
		Session.set('parseResponse', undefined);
		parseTitle(this);
	},
	'click #text': function(event, template){
		event.preventDefault();
		template.textMode.set(true);
	},
	'click #location': function(event, template){
		event.preventDefault();
		template.textMode.set(false);
	},
	'click #save': function(event, template){
		Materialize.toast('Saving file to Blockchain and IPFS', 3000, 'rounded')
		saveFile(this);
	},
	'click #removeFiles': function(event, template){
		Materialize.toast('Removing all titles!', 3000, 'rounded')
		Meteor.call("removeTitles");
	},
	'click #removeRegistry': function(event, template){
		Meteor.call("removeRegistry");
	},
  	'click #get-title-chains': function(event, instance) {
	    event.preventDefault();
	    instance.loading.set(true);
	    Meteor.call("getAllTitleChains", function(error, result){
			instance.loading.set(false);
			Session.set("mainchain", result.chains);
	    })
  	},
  	'click #cancel-chains': function(event, template){
		Session.set("mainchain", undefined);
	}
})
Template.file.helpers({
	hasLegalCoordinates: function(){
		console.log(this)
		return getRating(this);
	},
	getLegalColor: function(){
		console.log(this)
		var score = getRating(this);
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