module.exports = (function() {
	"use strict";

	var formatString = function(format, args) {
		return format.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
				? args[number] 
				: match;
		});
	};

	var Validator = function(manifest) {
		manifest = this.normalizeManifest(manifest)
		this.suites = manifest.suites;
		this.exceptions = manifest.exceptions;
	};

	Validator.prototype = {
		"suites": {},
		"exceptions": {},
		"process": function(data, url) {
			var self = this;
			var result = [];
			Object.keys(self.suites).forEach(function(name) {
				var suiteResult = self.suites[name].call(self, data, url);
				suiteResult && result.push(suiteResult);
			});
			return result;
		},
		// TODO: add errors checking (if errId is correct and error exists)
		"createException": function(exId, args) {
			args = args || [];
			return {
				"name": exId,
				"message": formatString(this.exceptions[exId].message, args),
				"isError": this.exceptions[exId].type === "error"
			};
		},
		// TODO: implement normalization properly
		"normalizeManifest": function(manifest) {
			manifest.exceptions = manifest.exceptions || {};
			manifest.suites = manifest.suites || {};
			return manifest;
		}
	};

	Validator.create = function(manifest) {
		return new Validator(manifest || {});
	};

	return Validator;
})();