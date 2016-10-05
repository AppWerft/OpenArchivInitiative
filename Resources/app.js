String.prototype.unescapeEntities = function() {
	return this.replace(/&#([0-9]{1,4});/gi, function(match, numStr) {
		var num = parseInt(numStr, 10);
		return String.fromCharCode(num);
	});
};

var Moment = require("lib/moment");
var OAI = require("de.appwerft.oaipmh");

require("providers")();
