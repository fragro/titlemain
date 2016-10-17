Template.loginHeader.events = {
	'click [data-action="logout"]': function(){
		Meteor.logout(function(){
			//goto route
			FlowRouter.go('/');
		});
	}
}