String.prototype.unescapeEntities = function() {
	return this.replace(/&#([0-9]{1,4});/gi, function(match, numStr) {
		var num = parseInt(numStr, 10);
		return String.fromCharCode(num);
	});
};

var Moment = require("lib/moment");
var OAI = require("de.appwerft.oaipmh");

require("providersWindow")();

function getText(foo) {
	if ( typeof foo == "string") {
		return foo;
	} else if ( typeof foo == "object") {
		if (foo.list) {
			if ( typeof foo.list[0] == "string")
				return foo.list[0];
			else
				return foo.list[0].content;
		} else
			return foo.content;
	} else
		return "";
}