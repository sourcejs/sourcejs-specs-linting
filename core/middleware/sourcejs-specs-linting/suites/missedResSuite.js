module.exports = function(Validator) {

	var fs = require('fs');
	var path = require('path');

	var isSourceURI = function(uri) {
		return !uri.indexOf('/source') || !uri.indexOf('/assets') || !uri.indexOf('/docs') || !uri.indexOf('/test');
	};

	var isValidResourceURI = function(uri, urlToSpec) {
		if (!uri) return true;
		if (isSourceURI(uri)) return true;
		urlToSpec = urlToSpec || "";

		var buildDir = "build/grunt/";

		var pathToUser = global.app.get('user') + "";
		var pathToSpecDir = path.dirname(path.join(pathToUser, urlToSpec));
		var pathToMasterApp = global.opts.core.masterApp ? global.opts.core.masterApp.path : undefined;
		var pathToMasterAppBuild = global.opts.core.masterApp ? path.join(global.opts.core.masterApp.path, buildDir) : undefined;
		var pathToMasterMob = global.opts.core.masterApp ? global.opts.core.masterApp.pathMob : undefined;

		var isInSpecDir = fs.existsSync(path.join(pathToSpecDir, uri));
		var isInUser = fs.existsSync(path.join(pathToUser, uri));
		var isInMasterApp = pathToMasterApp ? fs.existsSync(path.join(pathToMasterApp, uri)) : false;
		var isInMasterAppBuild = pathToMasterAppBuild ? fs.existsSync(path.join(pathToMasterAppBuild, uri)) : false;
		var isInMasterMob = pathToMasterMob ? fs.existsSync(path.join(pathToMasterMob, uri)) : false;

		return isInSpecDir || isInUser || isInMasterApp || isInMasterAppBuild || isInMasterMob;
	};

	return Validator.create({
		"suites" : {
			"checkThumbnail": function(spec, urlToSpec) {
				if (!spec.info || spec.info.role && spec.info.role === "navigation") {
					return;
				}
				var thumbnailPathParts = urlToSpec.split('/');
				thumbnailPathParts[thumbnailPathParts.length - 1] = "thumbnail.png";
				var thumbnailPath = global.app.get('user') + '/' + thumbnailPathParts.join('/');
				if(!require('fs').existsSync(thumbnailPath)) {
					return this.createException("ThumbnailNotFound", [urlToSpec]);
				}
				
			},
			"checkSpecResources": function(spec, urlToSpec) {
				if (!spec.info || spec.info.role && spec.info.role === "navigation" || !spec.renderedHtml) {
					return;
				}
				var document = this.getRenderedHTMLDocument(spec.renderedHtml);

				var links = document.getElementsByTagName('link') || [];
				for (var i = 0; i < links.length; i++) {
					if (!isValidResourceURI(links[i].href, urlToSpec)) {
						return this.createException("ResourceNotFound", [links[i].href, urlToSpec]);
					}
				}

				var images = document.getElementsByTagName('img') || [];
				for (var i = 0; i < images.length; i++) {
					var source = images[i].getAttribute('src');
					if (!~source.indexOf('http') && !isValidResourceURI(source, urlToSpec)) {
						return this.createException("ResourceNotFound", [source, urlToSpec]);
					}
				}
			}
		},
		"exceptions": {
			"ThumbnailNotFound": {
				"message": "Spec thumbnail.png is missing in <strong>{0}</strong>",
				"type": "warning"
			},
			"ResourceNotFound": {
				"message": "{0} is missing in <strong>{1}</strong>",
				"type": "error"
			}
		}
	});
};