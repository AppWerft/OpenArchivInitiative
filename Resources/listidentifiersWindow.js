function getText(foo) {
	if ( typeof foo == "string") {
		return foo;
	} else if ( typeof foo == "object") {
		console.log("object");
		if (foo.list) {
			console.log("array");
			if ( typeof foo.list[0] == "string")
				return foo.list[0];
			else
				return foo.list[0].content;
		} else
			return foo.content;
	} else
		return "%%";
}

var HEIGHT = 50;
module.exports = function(e) {
	var requestId;
	function refreshList() {
		counter = 0;
		Provider && Provider.abort(requestId);

		$.Refresher.setRefreshing(true);
		function getTimestamp(foo) {
			var bar;
			switch (granularity) {
			case "YYYY-MM-DDThh:mm:ssZ":
				bar = foo.toISOString();
				break;
			case "YYYY-MM-DD":
				bar = foo.format("YYYY-MM-DD");
				break;
			}
			return bar;
		}

		var options = {
			set : setSpec,
			from : (fromButton.getTitle() != "From") ? Moment(fromButton.getTitle()).toISOString() : undefined,
			until : (untilButton.getTitle() != "Until") ? Moment(untilButton.getTitle()).toISOString() : undefined,
		};
		requestId = Provider.ListIdentifiers(options, onLoad, onError);
		listView.setSections([]);
	}

	var OAI = require("de.appwerft.oaipmh");
	var ab = require("com.alcoapps.actionbarextras");
	var from,
	    until = Moment().format("YYYY-MM-DD");
	var url = e.url;
	var id = e.id;
	var Provider = OAI.createProvider({
		url : url,
		timeout : 60000
	});
	var counter = 0;
	var id = id;
	var setSpec = e.setSpec;
	var $ = Ti.UI.createWindow({
		title : e.label
	});
	$.addEventListener("open", function() {
		$.activity.onCreateOptionsMenu = function(m) {
			m.menu.clear();
			var icon = Ti.Android.R.drawable.ic_menu_manage;
			if (icon > 0)
				searchMenuItem = m.menu.add({
					icon : icon,
					showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
				}).addEventListener("click", function() {
					$.Refresher.animate({
						top : HEIGHT
					});
					toolView.animate({
						top : 0
					});
				});
		};
		$.activity.actionBar.displayHomeAsUp = true;
		ab.setSubtitle("List of Identifiers");
		ab.setStatusbarColor("#003");

		$.activity.actionBar.onHomeIconItemSelected = function(_e) {
			$.close();
		};
		$.progressView = require("progressView")();
	});
	$.open();
	var toolView = Ti.UI.createView({
		height : HEIGHT,
		top : -HEIGHT
	});
	toolView.add(Ti.UI.createView({
		left : 0,
		top : 5,
		width : "50%"
	}));
	toolView.add(Ti.UI.createView({
		right : 0,
		top : 5,
		width : "50%"
	}));
	$.add(toolView);
	var fromButton = Ti.UI.createButton({
		title : "From",
		left : 5,
		width : Ti.UI.FILL,
		right : 5,
		top : 0,
		color : "white",
	});
	var untilButton = Ti.UI.createButton({
		title : "Until",
		right : 5,
		left : 5,
		top : 0,
		color : "white",
		width : Ti.UI.FILL
	});
	toolView.children[0].add(fromButton);
	toolView.children[1].add(untilButton);
	fromButton.addEventListener("click", require("onbuttonclick"));
	untilButton.addEventListener("click", require("onbuttonclick"));
	fromButton.addEventListener("change", refreshList);
	untilButton.addEventListener("change", refreshList);
	var url = e.url;
	$.Refresher = require("com.rkam.swiperefreshlayout").createSwipeRefresh({
		view : Ti.UI.createListView({
			backgroundColor : "#003",
			templates : {
				'idents' : require('TEMPLATES').idents,
				'deleted' : require('TEMPLATES').deleted,
			},
			defaultItemTemplate : 'idents',
			sections : [],
			searchAsChild : false
		}),
		top : 0
	});
	var listView = $.Refresher.view;
	$.Refresher.addEventListener("refreshing", function() {
		$.Refresher.setRefreshing(false);
	});
	$.add($.Refresher);
	$.Refresher.setRefreshing(true);
	$.addEventListener("close", function() {
		Provider.abort(requestId);
	});
	var onLoad = function(e) {
		counter++;
		$.Refresher.setRefreshing(false);
		var identifierList = e["OAI-PMH"].ListIdentifiers;
		if (identifierList) {
			var resumption = identifierList.resumptionToken;
			//  {"cursor":50,"content":"ISFvYWlfZGMhMTAw","completeListSize":12762}
			if (resumption) {
				ab.setSubtitle("List of Identifiers (" + resumption.cursor + "/" + resumption.completeListSize + ")");
			}
		}

		if (!identifierList) {
			Ti.UI.createNotification({
				message : e["OAI-PMH"].error.content
			}).show();
			return;
		}
		console.log(identifierList.header.list);
		var count = identifierList.header.list.length;
		listView.appendSection( sectionView = Ti.UI.createListSection({
			headerTitle : "Page: " + counter,
			items : identifierList.header.list.map(function(r) {
				return require("identifierrow")(r, url);
			})
		}));
	};
	var onError = function(err) {
		$.Refresher.setRefreshing(false);
		Ti.UI.createNotification({
			duration : 5000,
			message : err.message
		}).show();
	};
	refreshList();
	listView.addEventListener('click', function(e) {
		e.url = url;
		require("record")(e);
	});
	listView.addEventListener("itemclick", require("record"));

	//$.add($.progessView);
};
