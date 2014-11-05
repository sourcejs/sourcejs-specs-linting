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
		},

		"getSpecsByField": function(field) {
			var fileTreePath =  "./" + global.opts.core.api.specsData;
			var acc = [];
			var source = this.fileTree;

			var isNavigation = function(item) {
				return item.specFile.role && item.specFile.role === "navigation";
			};

			var hasSearchedField = function(item, field) {
				return item.specFile[field.key] && item.specFile[field.key] === field.value;
			};

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

			this.fileTree = this.fileTree || JSON.parse(require('fs').readFileSync(fileTreePath, 'utf-8'));
			getObj(source, field);
			return acc;
		}
	};

	Validator.create = function(manifest) {
		return new Validator(manifest || {});
	};

	return Validator;
})();