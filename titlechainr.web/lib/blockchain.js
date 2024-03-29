nullBlockChainAddress = function(addr){
	return (addr == null || addr === "0000000000000000000000000000000000000000");
}
toHTMLWithData = function (kind, data) {
    return UI.toHTML(kind.extend({data: function () { return data; }}));
};
LOC_COORDS = ["sub", "lot", "block", "county", "state"];
FILE_DIR = process.env.FILE_DIR;
//fix for dates into UNIX
Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };