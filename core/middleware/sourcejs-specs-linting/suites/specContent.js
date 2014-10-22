module.exports = function(Validator) {

	return Validator.create({
		"suites" : {
			"checkRequiredFields": function(spec) {
				return this.createException("EmptyReqFields", ["test", "test2"]);
			}
		},
		"exceptions": {
			"EmptyReqFields": {
				"message": "Test Error message arguments: [{0}, {1}]",
				"type": "error"
			}
		}
	});
};