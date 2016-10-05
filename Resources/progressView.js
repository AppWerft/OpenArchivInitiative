module.exports = function() {
	return require('de.appwerft.waterwaveprogress').createView({
		maxProgress : 100,
		ringWidth : 4,
		waterColor : '#00ff00',
		waterBgColor : '#00aa00',
		ring2WaterWidth : 10.1,
		fontSize : 22,
		showRing : true,
		showNumerical : true,
		crestCount : 2.2,
		amplitude : 0.4,
		α : 0.7
	});
};
