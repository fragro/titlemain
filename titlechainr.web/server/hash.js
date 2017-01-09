var crypto = require('crypto');

hashData = function(data){
	console.log('hashing...');
	console.log(data);
	var hash = crypto.createHash('sha256');
	hash.update(data);
	return hash.digest('hex');
}

Meteor.methods({
	hash: function(data){
		console.log(hashData(data));
	}
});