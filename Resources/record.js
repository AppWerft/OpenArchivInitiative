var OAI = require("de.appwerft.oaipmh");
var abx = require("com.alcoapps.actionbarextras");

function getText(foo) {
	if (foo == null) return "";
	if ( typeof foo == "string") {
		return foo.unescapeEntities();
	} else if ( typeof foo == "object") {
		if (foo.list) {
			if ( typeof foo.list[0] == "string")
				return foo.list[0];
			else
				return foo.list[0].content;
		} else
			return (foo.content) ? foo.content.unescapeEntities() : "";
	} else
		return "";

}

module.exports = function(e) {
	var url = JSON.parse(e.itemId).url;
	var id = JSON.parse(e.itemId).id;
	console.log(JSON.parse(e.itemId));
	var $ = Ti.UI.createTabGroup({
		scrollable : false,
		title : Ti.App.Properties.hasProperty(id) ? Ti.App.Properties.getString(id) : id,
		tabs : [Ti.UI.createTab({
			title : "metadata",
			window : Ti.UI.createWindow()
		}), Ti.UI.createTab({
			title : "header",
			window : Ti.UI.createWindow()
		})]
	});
	var metadataWindow = $.tabs[0].window;
	var headerWindow = $.tabs[1].window;
	$.open();
	$.addEventListener("open", function() {
		$.activity.actionBar.displayHomeAsUp = true;
		abx.setStatusbarColor("#003");
		$.activity.actionBar.onHomeIconItemSelected = function(_e) {
			$.close();
		};
	});
	var Provider = OAI.createProvider({
		url : url
	});
	Provider.GetRecord({
		metadataPrefix : "oai_dc",
		identifier : id
	}, function(e) {
		var metadata = e["OAI-PMH"].GetRecord.record.metadata["oai_dc:dc"];
		var headerdata = e["OAI-PMH"].GetRecord.record.header;
		var sections = [];
		abx.setTitle(getText(metadata["dc:publisher"]));
		abx.setSubtitle(getText(metadata["dc:title"]));
		var keys = Object.getOwnPropertyNames(metadata);
		keys.forEach(function(key) {
			if (metadata[key] != undefined) {
				var section = Ti.UI.createTableViewSection({
					headerTitle : key
				});
				var row = Ti.UI.createTableViewRow({
					height : Ti.UI.SIZE,
					backgroundColor : "#003"
				});
				var text = getText(metadata[key]);
				row.add(Ti.UI.createLabel({
					text : text,
					left : 5,
					top : 5,
					right : 5,
					bottom : 10,
					color : "white",
					font : {
						fontSize : 18
					}
				}));
				section.add(row);
				sections.push(section);
			}
		});
		metadataWindow.add(Ti.UI.createTableView({
			data : sections
		}));
	}, function(err) {
		Ti.UI.createNotification({
			duration : 5000,
			message : err.message
		}).show();
	});
	$.open();
};
