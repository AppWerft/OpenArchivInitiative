var OAI = require("de.appwerft.oaipmh");

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
		return "…";

}

module.exports = function(e) {
	var id = e.id;
	var url = e.url;
	var $ = Ti.UI.createWindow({
		title : Ti.App.Properties.hasProperty(id) ? Ti.App.Properties.getString(id) : id
	});
	$.addEventListener("open", function() {
		var ab = require("com.alcoapps.actionbarextras");
		$.activity.actionBar.displayHomeAsUp = true;
		ab.setStatusbarColor("#003");
		ab.setSubtitle("List of identifiers");
		$.activity.actionBar.onHomeIconItemSelected = function(_e) {
			$.close();
		};
	});
	$.Refresher = require("com.rkam.swiperefreshlayout").createSwipeRefresh({
		view : Ti.UI.createTableView()
	});
	$.add($.Refresher);
	$.Refresher.setRefreshing(true);
	var Provider = OAI.createProvider({
		url : url
	});
	Provider.ListIdentifiers({
		metadataPrefix : "oai_dc"
	}, function(e) {
		var list = e["OAI-PMH"].ListIdentifiers;
		var ab = require("com.alcoapps.actionbarextras");
		$.Refresher.setRefreshing(false);
		if (!list) {
			Ti.UI.createNotification({
				message : e["OAI-PMH"].error.content
			}).show();
			$.Refresher.setRefreshing(false);
			return;
		}
		if (!list.header) {
			$.Refresher.setRefreshing(false);
			return;
		};
		var count = list.header.list.length;
		ab.setSubtitle("List of identifiers (" + count + ")");
		var rows = list.header.list.map(function(ident) {
			var row = Ti.UI.createTableViewRow({
				backgroundColor : "#003",
				height : 45,
				hasChild : true,
				identifier : ident.identifier
			});
			row.add(Ti.UI.createLabel({
				textAlign : 'left',
				width : Ti.UI.FILL,
				touchEnabled : false,
				pubbleParent : true,
				left : 5,
				color : "white",
				font : {
					fontSize : 20
				},
				text : ident.identifier
			}));
			return row;
		});
		$.Refresher.view.setData(rows);
	}, function(err) {
		$.Refresher.setRefreshing(false);
		Ti.UI.createNotification({
			duration : 5000,
			message : err.message
		}).show();
	});
	$.Refresher.view.addEventListener('click', function(e) {
		e.url=url;
		require("record")(e);
	});
	$.open();
};
