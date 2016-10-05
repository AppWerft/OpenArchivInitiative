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
		requestId =Provider.ListRecords(options, onLoad, onError);
		var options = {
			set : setSpec,
			from : (fromButton.getTitle() != "From") ? Moment(fromButton.getTitle()).format("YYYY-MM-DD") : undefined,
			until : (untilButton.getTitle() != "Until") ? Moment(untilButton.getTitle()).format("YYYY-MM-DD") : undefined,
		};
		Provider.ListRecords(options, onLoad, onError);
		listView.setSections([]);
	}

	var granularity;
	function onIdentifyLoad(e) {
		granularity = e["OAI-PMH"].Identify.granularity;
	}

	function onIdentifyError() {
	}

	var OAI = require("de.appwerft.oaipmh");
	var ab = require("com.alcoapps.actionbarextras");
	var from,
	    until = Moment().format("YYYY-MM-DD");
	var url = e.url;
	var id = e.id;
	var Provider = OAI.createProvider({
		url : url,
		timeout : 30000
	});
	Provider.Identify(null, onIdentifyLoad, onIdentifyError);

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
		ab.setSubtitle("List of Records");
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
				'main' : require('TEMPLATES').main,
				'deleted' : require('TEMPLATES').deleted,
			},
			defaultItemTemplate : 'main',
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
	$.addEventListener("blur", function() {
		console.log("⬇︎⬇︎⬇︎");
		Provider.abort(requestId);
		onLoad = null;
	});
	var onLoad = function(e) {
		counter++;
		$.Refresher.setRefreshing(false);
		var recordList = e["OAI-PMH"].ListRecords;
		if (!recordList) {
			Ti.UI.createNotification({
				message : e["OAI-PMH"].error.content
			}).show();
			return;
		}
		var count = recordList.record.list.length;
		//	ab.setSubtitle("List of Records (" + count + ")");
		listView.appendSection( sectionView = Ti.UI.createListSection({
			headerTitle : "Page: " + counter,
			items : recordList.record.list.map(function(r) {
				return require("recordrow")(r, url);
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
