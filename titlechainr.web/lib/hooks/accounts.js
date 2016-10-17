postSignUp = function(userId, info){
	//if no other users exist make this an admin account
	if(Meteor.users.find({}).count() == 1){
		console.log('adding user to role');
		Roles.addUsersToRoles(userId, ['superuser'])
	}
}