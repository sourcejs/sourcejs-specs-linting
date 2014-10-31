module.exports = function(Validator) {

	var fileTree;
	var fileTreePath = global.app.get('user') + "/" + global.opts.core.fileTree.outputFile;

	var getFileTree = function() {
		return fileTree || JSON.parse(require('fs').readFileSync(fileTreePath, 'utf-8'));
	};

	var isNavigation = function(item) {
		return item.specFile.role && item.specFile.role === "navigation";
	};

	var hasSearchedField = function(item, field) {
		return item.specFile[field.key] && item.specFile[field.key] === field.value;
	};

	var getSpecsByField = function(source, field) {
		var acc = [];
		var getObj = function(data, field) {
			for(var key in data) {
				var item = data[key];
				var isValidItem = item && item.specFile;
				if(isValidItem && !isNavigation(item) && hasSearchedField(item, field)) {
					acc.push(item);
				}
				if(item instanceof Object) {
					getObj(item, field);
				};
			}
		};
		getObj(source, field);
		return acc;
	};

	var formatSpecsMsg = function(specs) {
		var result = []
		for (var i = 0; i < specs.length; i++) {
			result.push(specs[i].specFile.url);
		}
		return result.join('; ');
	};

	return Validator.create({
		"suites" : {
			"checkUnicTitle": function(spec, urlToSpec) {
				if (!spec || !spec.info || !spec.info.title) return;

				fileTree = getFileTree();
				var self = this;
				var result = getSpecsByField(fileTree, {"key": "title", "value": spec.info.title});

				if (result.length > 1) {
					console.log(result.length);
					return this.createException("IncorrectSpecTitle", [spec.info.title, formatSpecsMsg(result)]);
				}
			},
			"checkUnicKeywords": function(spec, urlToSpec) {
				if (!spec || !spec.info || !spec.info.title) return;

				fileTree = getFileTree();
				var self = this;
				var result = getSpecsByField(fileTree, {"key": "title", "value": spec.info.title});

				if (result.length > 1) {
					console.log(result.length);
					return this.createException("IncorrectSpecTitle", [spec.info.title, formatSpecsMsg(result)]);
				}
			}
		},
		"exceptions": {
			"IncorrectSpecTitle": {
				"message": "Spec title <strong>\"{0}\"</strong> is not unic. Specs with the same title: <strong>{1}</strong>.",
				"type": "error"
			},
			"ThumbnailNotFound": {
				"message": "Missed thumbnail in spec <strong>{0}</strong>",
				"type": "warning"
			},
			"IncorrectKeywordsSet": {
				"message": "Keywords set <strong>\"{0}\"</strong> is not unic in spec <strong>{1}</strong>.",
				"type": "warning"
			},
			"MissedDesignSpecLink": {
				"message": "Link to designer spec is missed in spec  <strong>{0}</strong>."
			}
		}
	});
};