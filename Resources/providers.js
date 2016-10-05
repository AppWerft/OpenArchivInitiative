module.exports = function() {
	var win = Ti.UI.createWindow({
		title : "Open Archives Initiative"
	});
	var searchView = Ti.UI.Android.createSearchView({
		hintText : "Provider Filter"
	});
	var listView = Ti.UI.createListView({
		searchView : searchView,
		top : 10,
		templates : {
			'main' : require('TEMPLATES').main,
		},
		defaultItemTemplate : 'main',
		sections : [Ti.UI.createListSection()],
		searchAsChild : false
	});
	listView.addEventListener("clickitem", function(e) {
		require("menudialog")(e);
	});
	var searchMenuItem = null;
	win.add(listView);
	searchView.addEventListener('submit', function(_e) {
		searchMenuItem.collapseActionView();
		searchView.blur();
	});

	var abx = require("com.alcoapps.actionbarextras");
	win.addEventListener("open", function(e) {
		abx.setTitle("Open Archives Initiative");
		abx.setSubtitle("List of OAI providers");
		abx.setStatusbarColor("#003");
		abx.setSearchView({
			searchView : searchView,
			textColor : "white",
			hintColor : "silver",
		});
		e.source.activity.onCreateOptionsMenu = function(m) {
			m.menu.clear();
			searchMenuItem = m.menu.add({
				title : 'Search',
				icon : Ti.Android.R.drawable.ic_menu_search,
				actionView : searchView,
				showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM,
			});
		};
		var providers = require("model/providers");
		listView.sections[0].setItems(Object.getOwnPropertyNames(providers).map(function(p, ndx) {
			var id = p.replace("http://", "").replace(/\/.*/g, "").replace(/\:.*/g, "");
			return {
				properties : {
					searchableText : providers[p],
					itemId : JSON.stringify({
						url : p,
						label : providers[p],
						id : id
					})
				},
				title : {
					text : providers[p]
				},
				subtitle : {
					text : id
				}
			};
		}));
		listView.addEventListener("itemclick", require("menudialog"));
	});
	win.open();
};
