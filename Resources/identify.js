var OAI = require("de.appwerft.oaipmh");

module.exports = function(e) {
	var $ = Ti.UI.createWindow({
		backgroundColor : "#000033",
	});
	$.addEventListener("open", function() {
		var abx = require("com.alcoapps.actionbarextras");
		$.activity.actionBar.displayHomeAsUp = true;
		abx.setStatusbarColor("#003");
		abx.setTitle(e.id);
		abx.setSubtitle(e.label);
		
		$.activity.actionBar.onHomeIconItemSelected = function(_e) {
			$.close();
		};
	});
	$.add(Ti.UI.createScrollView({
		scrollType : "vertical"
	}));
	var Provider = OAI.createProvider({
		url : e.url
	});
	Provider.Identify(null, function(e) {
		var ident = e["OAI-PMH"].Identify;
		$.children[0].add(Ti.UI.createLabel({
			top : 5,
			text : JSON.stringify(ident, null, 2),
			font : {
				fontFamily : "MonospaceTypewriter"
			}
		}));
	}, function(e) {
		Ti.UI.createNotification({
			message : e.message
		}).show();
		$.close();
	});
	$.open();
};
