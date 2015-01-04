module.exports = function(Validator) {

	var requiredFields = ["title", "author", "info", "tag"];
	var desiribleFields = ["keywords"];

	return Validator.create({
		"suites" : {
			"checkRequiredFields": function(spec, urlToSpec) {
				var self = this;
				var result;

				requiredFields.forEach(function(field) {
					if (!spec.info || spec.info.role && spec.info.role === "navigation") {
						return;
					} else if (!spec.info[field]) {
						result = self.createException("RequiredFieldMissed", [field, urlToSpec]);
						return;
					} else if (!spec.info[field].length) {
						result = self.createException("EmptyRequiredField", [field, urlToSpec]);
						return;
					}
				});
				return result;	
			},
			"checkResiribleField": function(spec, urlToSpec) {
				var self = this;
				var result;

				desiribleFields.forEach(function(field) {
					if (!spec.info || spec.info.role && spec.info.role === "navigation") {
						return;
					} else if (!spec.info[field]) {
						result = self.createException("DesirableFieldMissed", [field, urlToSpec]);
						return;
					} else if (!spec.info[field].length) {
						result = self.createException("EmptyDesirableField", [field, urlToSpec]);
						return;
					}
				});
				return result;
			}
		},
		"exceptions": {
			"RequiredFieldMissed": {
				"message": "Field <strong>\"{0}\"</strong> is missing in <strong>{1}</strong>.",
				"type": "error"
			},
			"DesirableFieldMissed": {
				"message": "Field <strong>\"{0}\"</strong> is recommended, but is missing in <strong>{1}</strong>.",
				"type": "warning"
			},
			"EmptyRequiredField": {
				"message": "Field <strong>\"{0}\"</strong> is empty in <strong>{1}</strong>.",
				"type": "error"
			},
			"EmptyDesirableField": {
				"message": "Field <strong>\"{0}\"</strong> is recommended, but is empty in spec <strong>{1}</strong>.",
				"type": "warning"
			}
		}
	});
};