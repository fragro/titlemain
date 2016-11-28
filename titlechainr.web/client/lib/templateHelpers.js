Template.registerHelper('arrayify',function(obj){
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});
Template.registerHelper('isList',function(obj){
    return Array.isArray(obj);
});
Template.registerHelper('upperCase',function(obj){
    return obj.toUpperCase();
});
Template.registerHelper('capitalize',function(obj){
    return obj[0].toUpperCase() + obj.slice(1,obj.length);
});
Template.registerHelper('formatDirection',function(obj){
	return obj[0].toUpperCase();
});