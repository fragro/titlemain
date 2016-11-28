nullBlockChainAddress = function(addr){
	return (addr == null || addr === "0000000000000000000000000000000000000000");
}
toHTMLWithData = function (kind, data) {
    return UI.toHTML(kind.extend({data: function () { return data; }}));
};
FILE_DIR = "/home/fragro/Programming/titlemain/titlechainr.web/.meteor/local/build/programs/server/";
//fix for dates into UNIX
Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };