module.exports = function() {
	var $ = Ti.UI.createView({
		opacity : 0.7,
		width : 240,
		touchEnabled : false,
		height : 240,
		zIndex : 9999
	});
	$.progressView = require("de.appwerft.waterwaveprogress").createView({
		showWater : true,
		touchEnabled : false,
		waterColor : "#aaa",
		waterBgColor : "#000033",
		showRing : true,
		ringWidth : 30,
		ring2WaterWidth : 10,
		ringColor : "#ddd",
		maxProgress : 100.0,
		ringBgColor : "#666",
		showNumerical : true,
		fontSize : 122,
		textColor : "#000033",
	});
	$.progressView.setProgress(0.0);
	$.add($.progressView);
	$.setProgress = $.progressView.setProgress;
	return $;
};
