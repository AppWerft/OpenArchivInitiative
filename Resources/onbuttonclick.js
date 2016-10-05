module.exports = function(event) {
	var $ = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_DATE,
		minDate : new Date(1900, 0, 1),
		maxDate : new Date(),
		calendarViewShown : true,
		nativeSpinner : false
	});
	setTimeout(function() {
		var val = event.source.getTitle();
		if (val == "From" || val == "Until") val= Moment().format("YYYY-MM-DD");
		console.log(val);
		$.showDatePickerDialog({
			value : new Date(val.split("-")),
			calendarViewShown : false,
			callback : function(e) {
				if (!e.cancel) {
					value = Moment(e.value).startOf('day').format("YYYY-MM-DD");
					if (event.source.apiName == "Ti.UI.Button") {
						event.source.setTitle(value);
						event.source.fireEvent("change", {});
					}
				}
			}
		});
	}, 100);
};
