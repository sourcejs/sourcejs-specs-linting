sourcejs-specs-linting
======================

Sourcejs plugin for linting documentation page (spec) content, according to defined rules.

This plugin process any .src docs from your content folder, also you can configure it using your `options.js` (or `local_options.js` file). To get more information please read [this doc](http://sourcejs.com/docs/base/#4!).

## Getting Started.

To install, run `npm inastall` in `sourcejs/user` folder:

```
npm install sourcejs-specs-linting --save
```

Then restart your Sourcejs app instance.


## Plugin configuration.

To configure it please add `specsLinting` section to pluginsOptions in your `options.js` file. 
Here the default plugin configuration is:

```
pluginsOptions {
    
    . . .
    
    "specsLinting": {
        "enabled": true,
        "targets": {
            "development": ["*"], // validation is turned on for any project in your "development" environment
            "production": [] // validation is turned off in "production" environment
        }
    }
    . . .
}
```

#### specsLinting.enabled.

Type: `Boolean`

Default value: `false`

It defines if plugin is enabled.

#### specsLinting.targets.

Type: `Object`

This object defines environments set. Each of them can be specified by `global.MODE` Sourcejs option or by `process.env.NODE_ENV` global parameter. The `development` is default one.

#### specsLinting.targets.<%= envName %>

Type: `Array`

Default value: []

Values: `["env1Example", "env2Example", ...], ["*"], []`.

You can use `["*"]` value to make plugin process all projects.
Each Array member represents single project.

For example:
If you have the following projects folders structure:

```
user/
-webApp/
-mobApp/
```

To make your plugin process only `webApp` content you shell specify environment value like this: `"myEnv": ["webApp"]`.


## How to add validations.

Current plugin version contains several predefined validation sutes. This suites are examples, which can be used 'as is' or removed.
To create your own suites please add into `suites` folder your own js file, which has the following structure:

```javascript
module.exports = function(Validator) {

        var isValidDueToRule1 = function(spec) {
                // your implementation
                return false;
        };

        var isValidDueToRule2 = function(spec) {
                // your implementation
                return true;
        };

        return Validator.create({
                "suites": {
                        "validatinRule1": function(specificationObj, urlToSpecification) {
                                if (!isValidDueToRule1(specificationObj)) {
                                        return this.createException("WarningExampleName", [specificationObj.info.title, "parameter2"]);
                                }
                        },
                        "validatinRule2": function(specificationObj, urlToSpecification) {
                                if (!isValidDueToRule2(specificationObj)) {
                                        return this.createException("ErrorExampleName", [specificationObj.info.title]);
                                }
                        }
                },
                "exceptions": {
                        "ErrorExampleName": {
                                "message": "This is exception message with parameter {0}",
                                "type": "error"
                        },
                        "WarningExampleName": {
                                "message": "This is exception message with parameter {0} and {1}",
                                "type": "warning"
                        }
                }
        });
};
```
