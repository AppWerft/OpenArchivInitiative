module.exports = function(record, url) {
	return {
		properties : {
			itemId : JSON.stringify({
				id : record.identifier,
				url : url
			})
		},
		title : {
			text : record.identifier
		}

	};
};

