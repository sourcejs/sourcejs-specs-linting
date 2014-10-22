exports.process = (function() {
	"use strict";

	var validator = require(__dirname + "/validator");

	var suites = (function() {
		var sList = {};
		var suitesPath = __dirname + '/suites/';

		require('fs').readdirSync(suitesPath).forEach(function(fileName) {
			if (!!fileName.match(/.+\.js/g)) {
				var suite = require(suitesPath + fileName)(validator);
				sList[fileName.replace('.js', '')] = suite;
			}
		});
		return sList;
	})();

	var processExceptions = function(specData, exceptions) {
		Object.keys(exceptions).forEach(function(type) {
			exceptions[type].forEach(function(ex) {
				renderException(specData, ex);
				storeException(specData, ex);
			});
		});

	};

	var renderException = function(specData, exception) {
		console.log("Rendering... ", exception);
	};

	var storeException = function(specData, exception) {
		console.log("Logging... ", exception);
	};

	var isEmpty = function(map) {
		for(var key in map) {
			if (map.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	};

	var processSpecs = function(req, res, next) {
		if (req && req.specData && !isEmpty(req.specData)) {
			var validationExceptions = {};
			Object.keys(suites).forEach(function(name) {
				var validationResults = suites[name].process(req.specData);
				if (validationResults && validationResults.length) {
					validationExceptions[name] = validationResults;
				}
			});
			if (!isEmpty(validationExceptions)) {
				processExceptions(req.specData || {}, validationExceptions);
			}			
		}
		next();
	};

	return processSpecs;

})();

