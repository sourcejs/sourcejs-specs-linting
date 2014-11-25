module.exports = function(Validator) {

	var fs = require('fs');
	var path = require('path');

	var isValidResourceURI = function(uri) {
		if (!uri) return false;
		var isInUser = fs.existsSync(path.join(global.app.get('user'), uri));
		var isInMasterAppWeb = global.opts.core.masterApp && global.opts.core.masterApp.path
			? fs.existsSync(path.join(global.opts.core.masterApp.path, uri))
			: false;
		var isInMasterAppMob = global.opts.core.masterApp && global.opts.core.masterApp.pathMob
			? fs.existsSync(path.join(global.opts.core.masterApp.pathMob, uri))
			: false;
		return isInUser || isInMasterAppWeb || isInMasterAppMob;
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
					if (!isValidResourceURI(links[i].href)) {
						return this.createException("ResourceNotFound", [links[i].href, urlToSpec]);
					}
				}

				var images = document.getElementsByTagName('img') || [];
				for (var i = 0; i < images.length; i++) {
					if (!isValidResourceURI(images[i].src)) {
						return this.createException("ResourceNotFound", [images[i].src, urlToSpec]);
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