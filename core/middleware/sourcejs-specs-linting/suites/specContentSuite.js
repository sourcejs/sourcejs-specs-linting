module.exports = function(Validator) {

	return Validator.create({
		"suites" : {
			"checkSpecDescription": function(spec, urlToSpec) {
				if (!spec.info || spec.info.role && spec.info.role === "navigation" || !spec.renderedHtml) {
					return;
				}
				var document = this.getRenderedHTMLDocument(spec.renderedHtml);
				var description = document.querySelector('.source_info').innerHTML;
				if (!description || !description.length) {
					return this.createException("DescriptionIsEmpty", [urlToSpec])
				}

			},
			"CheckCodeExamples": function(spec, urlToSpec) {
				if (!spec.info || spec.info.role && spec.info.role === "navigation" || !spec.renderedHtml) {
					return;
				}
				var document = this.getRenderedHTMLDocument(spec.renderedHtml);
				var examples = document.getElementsByClassName('source_example');
				if (!examples || !examples.length) {
					return this.createException("NoSourceCodeExamples", [urlToSpec])
				}
			}
		},
		"exceptions": {
			"DescriptionIsEmpty": {
				"message": "Spec description is missing in <strong>{0}</strong>.",
				"type": "warning"
			},
			"NoSourceCodeExamples": {
				"message": "At least one source example is required in <strong>{0}</strong>.",
				"type": "warning"
			}
		}
	});
};