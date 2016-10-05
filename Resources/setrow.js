module.exports = function(set) {

	var titleView = Ti.UI.createLabel({
		text : set.setName.unescapeEntities(),
		left : 10,
		height : 50,
		top : 5,
		touchEnabled : false,
		textAlign : 'left',
		width : Ti.UI.FILL,
		color : "#c8c8c8",
		font : {
			fontSize : 20,
			fontWeight : "bold"
		}
	});
	var idView = Ti.UI.createLabel({
		text : set.setSpec,
		left : 10,
		height : 22,
		touchEnabled : false,
		textAlign : 'left',
		width : Ti.UI.FILL,
		color : "white",
		bottom : 10,
		font : {
			fontSize : 16
		}
	});
	var row = Ti.UI.createTableViewRow({
		height : 90,
		hasChild : true,
		setSpec : set.setSpec,
		backgroundColor : "#000033",
	});
	row.add(titleView);
	row.add(idView);
	return row;
};
