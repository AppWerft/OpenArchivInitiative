module.exports = function(tableView, progressView) {
	var ndx = 0;
	var rows = tableView.data[0].rows;
	resolve(rows[ndx]);
	function setProgress() {
		progressView.setWidth((ndx / rows.length * 100) + "%");
	}

	function resolve(row) {
		if (!row || !row.id)
			return;
		if (Ti.App.Properties.hasProperty(row.id)) {
			row.children[0].text = Ti.App.Properties.getString(row.id);
			ndx++;
			setProgress();
			resolve(rows[ndx]);
			console.log("{\"" + row.url + "\":\"" + Ti.App.Properties.getString(row.id) + "\"},");

		}
		ndx++;
		setProgress();
		resolve(rows[ndx]);
		return;
		if (Ti.App.Properties.hasProperty("_" + row.id)) {
			ndx++;
			resolve(rows[ndx]);
			setProgress();
			return;
		}

		OAI.createProvider({
			url : row.url
		}).Identify(null, function(e) {
			setProgress();
			console.log(ndx + " OK: " + row.id);
			try {
				Ti.App.Properties.setString(row.id, e["OAI-PMH"].Identify.repositoryName);
				row.children[0].text = e["OAI-PMH"].Identify.repositoryName;
			} catch(E) {
			}

			if (ndx < rows.length - 1) {
				ndx++;
				setProgress();
				resolve(rows[ndx]);
			}
		}, function() {
			setProgress();
			Ti.App.Properties.setString("_" + row.id, "");
			if (ndx < rows.length) {
				ndx++;
				setProgress();
				resolve(rows[ndx]);
			}
		});
	}

};
