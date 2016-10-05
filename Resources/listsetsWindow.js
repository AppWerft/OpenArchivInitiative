var OAI = require("de.appwerft.oaipmh");

module.exports = function(e) {
	var url = e.url;
	var label = e.label;
	
	var $ = Ti.UI.createWindow({
		backgroundColor : "#000033",
	});
	$.addEventListener("open", function() {
		var abx = require("com.alcoapps.actionbarextras");
		$.activity.actionBar.displayHomeAsUp = true;
		abx.setStatusbarColor("#003");
		abx.setTitle(e.id);
		abx.setSubtitle("ListSets");
		$.activity.actionBar.onHomeIconItemSelected = function(_e) {
			$.close();
		};
	});
	$.add(Ti.UI.createTableView({
	}));
	var Provider = OAI.createProvider({
		url : url
	});
	Provider.ListSets(null, function(e) {
		var sets = e["OAI-PMH"].ListSets.set.list;
		$.children[0].data = sets.map(require("setrow"));
		/*$.children[0].add(Ti.UI.createLabel({
			top : 5,
			text : JSON.stringify(sets, null, 2),
			font : {
				fontFamily : "MonospaceTypewriter"
			}
		}));*/
	}, function(e) {
		Ti.UI.createNotification({
			message : e.message
		}).show();
		$.close();
	});
	$.children[0].addEventListener("click",function(e){
		e.url=url;
		e.label=label;
		require("listrecordsWindow")(e);
	});
	$.open();
};
