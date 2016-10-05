module.exports = function(prefix, namespace) {
	var titleView = Ti.UI.createLabel({
		text : prefix,
		left : 10,
		top : 5,
		textAlign : 'left',
		color : "white",
		font : {
			fontWeight : "bold",
			fontSize : 24
		}
	});
	var subtitleView = Ti.UI.createLabel({
		text : namespace,
		left : 10,
		bottom : 5,
		textAlign : 'left',
		color : "white",
		font : {
			fontSize : 14
		}
	});
	var row = Ti.UI.createTableViewRow({
		height : 80,
		backgroundColor : "#000033"
	});
	row.add(titleView);
	row.add(subtitleView);
	return row;
};
