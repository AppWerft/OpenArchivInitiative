var H = 60;

module.exports = function(event) {
	Ti.Media.vibrate([40,0]);
	var itemId = JSON.parse(event.itemId);
	console.log(itemId);
	console.log(typeof itemId);
	var id = itemId.id;
	var url = itemId.url;
	var title = itemId.label;
	console.log("⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩⟩ "+itemId.label);
	
	var $ = Ti.UI.createOptionDialog({
		options : ["Identify", "ListMetadataFormats", "ListIdentifiers", "ListSets", "ListRecords"],
		selectedIndex : 4,
		title : title
	});

	$.addEventListener("click", function(dialogevent) {
		if (dialogevent.index >= 0) {
			switch (dialogevent.index) {
			case 0:
				require("identifyWindow")(itemId);
				break;
			case 1:
				require("listmetadataWindow")(itemId);
				break;
			case 2:
				require("listidentifiersWindow")(itemId);
				break;
			case 3:
				require("listsetsWindow")(itemId);
				break;

			case 4:
				require("listrecordsWindow")(itemId);
				break;
			}

		}
	});
	$.show();
/*
	if (!Ti.App.Properties.hasProperty(id))
		OAI.createProvider({
			url : event.rowData.url
		}).Identify(null, function(result) {
			var repositoryName = result["OAI-PMH"].Identify.repositoryName;
			Ti.App.Properties.setString(id, repositoryName);
			$.setTitle(repositoryName);
			console.log(event.source.children[0].apiName);
			event.source.children[0].setText(repositoryName);
		}, function(error) {
			Ti.UI.createNotification({
				message : error.message
			}).show();
		});
*/
};
