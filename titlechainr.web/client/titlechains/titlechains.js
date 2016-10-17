import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './titlechains.html';

Template.titlechains.onCreated(function titleChainsOnCreated() {
  // counter starts at 0
  this.chains = new ReactiveVar([]);
  this.loading = new ReactiveVar(false);

});

Template.titlechains.helpers({
  chains: function() {
  	return Session.get("mainchain");
    //return Template.instance().chains.get();
  },
  loading: function() {
    return Template.instance().loading.get();
  },
});

Template.titlechains.events({
  'click #get-title-chains': function(event, instance) {
    event.preventDefault();
    instance.loading.set(true);
    Meteor.call("getAllTitleChains", function(error, result){
    	console.log(result);
    	instance.chains.set(result.chains);
		instance.loading.set(false);
		Session.set("mainchain", result.chains);
    })
  }
});

Template.titles.onCreated(function titlesOnCreated() {
  // counter starts at 0
  this.titles = new ReactiveVar([]);
  this.loading = new ReactiveVar(false);
});

Template.titles.helpers({
  titles: function() {
    return Template.instance().titles.get();
  },
  loading: function() {
    return Template.instance().loading.get();
  },
  formatChain: function(chain){
    var chainItr = chain.split(',');
    var ret = [];
    var curKey;
    var curVal;
    for(var i in chainItr){
      if(i == 0 || i % 2 === 0){
        //this is a key
        curKey = chainItr[i];
      }
      else{
        curVal = chainItr[i];
        ret.push({key: curKey, val: curVal});
      }
    }
    console.log(ret);
    return ret;
  }
});
Template.titleRecord.helpers({
  titleLink: function(){
    var desc = JSON.parse(this.description);
    console.log(this);
    var t = Titles.findOne({pdfHash: desc.pdfHash});
    if(t){
      return t;
    }
    else{
      //we need to find this title record in the IPFS space and add it to
      //our local Titles file management system
    }
  },
  date: function(){
    var desc = JSON.parse(this.description);
    var unixTime = moment.unix(parseInt(desc.date));
    return unixTime.format('MMMM Do YYYY, h:mm:ss a');
  }
})
Template.titles.events({
  	'click #expand-title-chain': function(event, instance){
      event.preventDefault();
		  instance.loading.set(true);
		  Meteor.call("getAllTitles", this.titleChainAddr.address, function(error, result){
        console.log(result);
  			instance.titles.set(result.titles);
        for( var i in result.titles){
          var titleRecord = JSON.parse(result.titles[i].description);
          console.log(FILE_DIR + '/data/' + titleRecord.pdfHash + '.pdf');
          Meteor.call("getPDF", titleRecord.pdfHash, FILE_DIR + 'data/' + titleRecord.pdfHash + '.pdf', function(err, result){
            console.log(result);
          });
          //getPDF();
        }
		  	instance.loading.set(false);
  		})
	  }
});