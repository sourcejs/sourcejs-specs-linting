module.exports = function(Validator) {

	var fs = require('fs');

	var isValidResourceURI = function(uri) {
		return uri && fs.existsSync(uri);
	}

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
				"message": "Missed thumbnail.png in spec <strong>{0}</strong>",
				"type": "warning"
			},
			"ResourceNotFound": {
				"message": "Missed resource {0} in spec <strong>{1}</strong>",
				"type": "error"
			},
			"MissedDesignSpecLink": {
				"message": "Link to designer spec is missed in spec  <strong>{0}</strong>.",
				"type": "warning"
			}
		}
	});
};