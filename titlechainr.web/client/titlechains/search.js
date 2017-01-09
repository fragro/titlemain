Template.searchTitles.helpers({
	titles: function(){
		var searchResults = Session.get("searchResults");
		if(searchResults){
			if(searchResults.err){
				Session.set('searchError', searchResults.msg);
				return;
			}
			else{
				return searchResults.titles;
			}
		}
	}
})

Template.searchTitle.helpers({
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
    console.log(desc)
    var unixTime = moment.unix(parseInt(desc.date));
    return unixTime.format('MMMM Do YYYY, h:mm:ss a');
  },
  location: function(){
      var desc = JSON.parse(this.description);
      delete desc.location.state;
      delete desc.location.county;
      return desc.location;
  },
  titleClass: function(){
      var desc = JSON.parse(this.description);
      return desc.titleClass;
  }
});
Template.search.onCreated(function titleChainsOnCreated() {
  // counter starts at 0
  this.chains = new ReactiveVar([]);
  this.loading = new ReactiveVar(false);

});
Template.search.onRendered(function () {
  $('select').material_select();
  $('span.caret').html("");
   Session.set("searchError", undefined);
})
Template.search.helpers({
  chains: function() {
  	return Session.get("mainchain");
    //return Template.instance().chains.get();
  },
  loading: function() {
    return Session.get('loading');
  },
  error: function(){
    return Session.get("searchError");
  },
  searchOptions: function(){
    var searchOptions = Session.get("searchOptions");
    return searchOptions;
  }
});

Template.search.events({
  'click #search': function(event, template){
    Session.set('loading', true);
    var results = searchChain();
  }
});