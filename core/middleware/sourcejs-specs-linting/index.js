exports.process = (function() {

	var validators = (function() {
		var vList = {};
		var validatorsPath = __dirname + '/validators/';

		require('fs').readdirSync(validatorsPath).forEach(function(fileName) {
			if (fileName.match(/.+\.js/g) !== null) {
				vList[fileName.replace('.js', '')] = require(validatorsPath + fileName);
			}
		});
		return vList;
	})();

	var renderValidationResults = function(specData, errors) {

	};

	var validate = function(req, res, next) {
		if (req && req.specData) {
			var isValidSpec = true;
			var validationErrors = [];
			Object.keys(validators).forEach(function(key) {
				var validationResult = validators[key].call(this, req.specData);
				if (validationResult) {
					isValidSpec = false;
					validationErrors.push(validationResult);
				}
			});
			!isValidSpec && renderValidationResults(req.specData, validationErrors);
		}
		next();
	};

	return validate;

})();

