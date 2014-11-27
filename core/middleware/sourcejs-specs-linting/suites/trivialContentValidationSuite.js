module.exports = function(Validator) {

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

				var self = this;
				var result = this.getSpecsByField({"key": "title", "value": spec.info.title});
				var currentCategory = urlToSpec && urlToSpec.length
					? urlToSpec.split("/")[0]
					: undefined;

				if (result.length <= 1) return;

				var nonUnicCounter = 0;
				for (var i = 0; i < result.length; i++) {
					var itemCategory = result[i].specFile.id && result[i].specFile.id.length
						? result[i].specFile.id.split("/")[0]
						: undefined;
					if (itemCategory && currentCategory && itemCategory !== currentCategory) {
						nonUnicCounter += 1;
					}
				}
				if (nonUnicCounter > 1) {
					return this.createException("IncorrectSpecTitle", [spec.info.title, formatSpecsMsg(result)]);
				}
			},
			"checkUnicKeywords": function(spec, urlToSpec) {
				if (!spec || !spec.info || !spec.info.title) return;

				var self = this;
				var result = this.getSpecsByField({"key": "keywords", "value": spec.info.keywords});

				if (result.length > 1) {
					return this.createException("IncorrectKeywordsSet", [spec.info.keywords, formatSpecsMsg(result)]);
				}
			}
		},
		"exceptions": {
			"IncorrectSpecTitle": {
				"message": "Spec title <strong>\"{0}\"</strong> is not unique. Specs with the same title: <strong>{1}</strong>.",
				"type": "error"
			},
			"IncorrectKeywordsSet": {
				"message": "Keywords <strong>\"{0}\"</strong> are not unique in <strong>{1}</strong>.",
				"type": "warning"
			}
		}
	});
};