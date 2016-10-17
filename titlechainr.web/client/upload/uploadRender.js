updateProcessingChip = function(text){
	var html = Blaze.toHTML(Blaze.With({text:text}, function() { return Template.uploadAlert; }));
	$('#processed').prepend(html);
}
errorProcessingChip = function(text){
	var html = Blaze.toHTML(Blaze.With({text:text}, function() { return Template.uploadError; }));
	$('#processed').prepend(html);
}
successProcessingChip = function(text){
	var html = Blaze.toHTML(Blaze.With({text:text}, function() { return Template.uploadSuccess; }));
	$('#processed').prepend(html);
}