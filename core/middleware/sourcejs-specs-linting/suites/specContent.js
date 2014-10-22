module.exports = function(Validator) {

	return Validator.create({
		"suites" : {
			"checkRequiredFields": function(spec) {
				return this.createException("EmptyReqFields", ["test", "test2"]);
			},
			"checkRequiredFields2": function(spec) {
				return this.createException("EmptyReqFields2", ["test3", "test4"]);
			}
		},
		"exceptions": {
			"EmptyReqFields": {
				"message": "Test Error message arguments: [{0}, {1}]",
				"type": "error"
			},
			"EmptyReqFields2": {
				"message": "Test Error {0}. With args. {1}",
				"type": "warning"
			}
		}
	});
};