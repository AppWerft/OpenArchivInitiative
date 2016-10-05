function getText(foo) {
	if ( typeof foo == "string") {
		return foo;
	} else if ( typeof foo == "object") {
		if (foo.list) {
			if ( typeof foo.list[0] == "string")
				return foo.list[0];
			else
				return foo.list[0].content;
		} else
			return foo.content;
	} else
		return "unknown";

}

module.exports = function(record, url) {
	if (record.header.status == "deleted") {
		console.log("DELETED");
		return {
			properties : {
				template :  "deleted" 
			},
			template :  "deleted" ,
			title : {
				text : "deleted"
			}

		};
	} else {
		var metadata = record.metadata["oai_dc:dc"];
		if (metadata) {
			return {
				properties : {
					itemId : JSON.stringify({
						id : record.header.identifier,
						url : url
					})
				},
				title : {
					text : getText(metadata["dc:creator"]).unescapeEntities()
				},
				subtitle : {
					text : getText(metadata["dc:title"]).unescapeEntities()
				}

			};
		} else {
			console.log("no metadata");
			return {};
		}
	}

};

var EXAMPLE = {
	"header" : {
		"setSpec" : {
			"list" : ["driver", "fondo-historico"]
		},
		"identifier" : "oai:zaguan.unizar.es:498",
		"datestamp" : "2016-09-23T09:32:34Z"
	},
	"metadata" : {
		"oai_dc:dc" : {
			"xmlns:oai_dc" : "http://www.openarchives.org/OAI/2.0/oai_dc/",
			"dc:creator" : "Andrés de Uztarroz, Juan Francisco",
			"xmlns:xsi" : "http://www.w3.org/2001/XMLSchema-instance",
			"dc:date" : "2014-11-20T09:30:38Z",
			"dc:identifier" : {
				"list" : ["http://zaguan.unizar.es/record/498", "oai:zaguan.unizar.es:498"]
			},
			"xsi:schemaLocation" : "http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd",
			"dc:title" : "Indice alfabético de los Indices Latinos de Geronimo Zurita",
			"xmlns:dc" : "http://purl.org/dc/elements/1.1/"
		}
	}
};
