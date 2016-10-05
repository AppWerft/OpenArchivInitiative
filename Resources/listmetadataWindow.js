var OAI = require("de.appwerft.oaipmh");

module.exports = function(e) {
	var id = e.id;
	var $ = Ti.UI.createWindow({
		title : Ti.App.Properties.hasProperty(id) ? Ti.App.Properties.getString(id) : id
	});
	$.addEventListener("open", function() {
		$.activity.actionBar.displayHomeAsUp = true;
		var abx = require("com.alcoapps.actionbarextras");
		abx.setStatusbarColor("#003");
		abx.setSubtitle("List of MetaDataFormats");
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
	Provider.ListMetadataFormats(null, function(e) {
		try {
			var list = e["OAI-PMH"].ListMetadataFormats.metadataFormat.list;
			$.table = Ti.UI.createTableView({
				data : list.map(function(m) {
					return require("metarow")(m.metadataPrefix, m.metadataNamespace);
				})
			});
			$.add($.table);
		} catch(E) {
			console.log(E);
		}
	}, function(error) {
		Ti.UI.createNotification({
			message : error.message
		}).show();
	});
	$.open();
};
