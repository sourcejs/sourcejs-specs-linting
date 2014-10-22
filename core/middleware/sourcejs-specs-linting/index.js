exports.process = (function() {
	"use strict";

	var validator = require(__dirname + "/validator");
	var fs = require('fs');

	var suites = (function() {
		var sList = {};
		var suitesPath = __dirname + '/suites/';

		fs.readdirSync(suitesPath).forEach(function(fileName) {
			if (!!fileName.match(/.+\.js/g)) {
				var suite = require(suitesPath + fileName)(validator);
				sList[fileName.replace('.js', '')] = suite;
			}
		});
		return sList;
	})();

	var appendPluginStyles = function(specData) {
		var styles = '<style>\n' + fs.readFileSync(__dirname + "/styles.css",  'utf8') + '\n</style>\n';
		specData.renderedHtml += styles;
	}

	var processExceptions = function(specData, exceptions) {
		appendPluginStyles(specData);
		specData.renderedHtml += '<div class="ex-container">';
		Object.keys(exceptions).forEach(function(type) {
			exceptions[type].forEach(function(ex) {
				renderException(specData, ex);
				storeException(specData, ex);
			});
		});
		specData.renderedHtml += '</div>'

	};

	//TODO: wrap html strings to templates or functions
	var renderException = function(specData, exception) {
		var exDom = '<div class="linting-ex ' + (exception.isError ? "__error" : "__warning") + '">'
			+ '<span class="ex-name">' + exception.name + ': </span>'
			+ '<span class="ex-message">' + exception.message + '</span>'
			+ '</div>';
		specData.renderedHtml += exDom;
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

