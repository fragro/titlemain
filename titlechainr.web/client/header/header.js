initPage = function(){

	$('.button-collapse').sideNav({
		menuWidth: 300, // Default is 240
		edge: 'right', // Choose the horizontal origin
		closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
	});
	//Initiat WOW JS
	new WOW().init();

	//init material elements
    $.material.init();
    $('.navbar').affix({offset: 140});

}
Template.header.onRendered(function(){
	initPage();
    //$('.navbar').appendClass('affix');
})
Template.landingHeader.onRendered(function(){
	initPage();
})
Template.offCanvasMenu.events = {
	'click [data-action="logout"]': function(){
		Meteor.logout(function(){
			//goto route
			FlowRouter.go('/');
		});
	}
}
Template.offCanvasMenu.helpers({
	userEmail: function(){
		var user = Meteor.user();
		if(user){
			return user.emails[0].address;
		}
	}
})