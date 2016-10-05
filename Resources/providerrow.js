module.exports = function(url, title) {
	var id = url.replace("http://","").replace(/\/.*/g,"").replace(/\:.*/g,"");
	var titleView = Ti.UI.createLabel({
		text : title,
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
		text : id,
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
		backgroundColor : "#000033",
		url : url,
		id : id,
		label : title,
		title : titleView.text
	});
	row.add(titleView);
	row.add(idView);
	return row;
};
