# common-codegen-tests
A set of common tests that apply to all generated code, irrespective of language. There are no tests in this
framework that requires language specific knowledge, perhaps with the exception of knowing which language is being
tested in order to correctly mock out any JSON.

| Build | Status |
| ------ | ---- |
| master | [![Build Status](https://travis.ibm.com/arf/common-codegen-tests.svg?token=D9H1S9JmREZirtqjnxut&branch=master)](https://travis.ibm.com/arf/common-codegen-tests) |

# Components
The core test framework is made up of a number of components.
To use the core framework you'll need to install the node module and then reference it in your test case
```
var tests = require('@arf/common-codegen-tests');
```

## YaaS Mock
This module allows you to mock YaaS by creating the same JSON data object that would have been passed from
YaaS to your code generator. The example below shows how to mock a YaaS object, the constructor takes the following parameters

* Name of your project (as would have been prompted on the CLI - not the host name);
* The backend language (SWIFT / NODE / JAVA), this is only to insert the right value in the JSON, rather than provide language specific tests.
* Options : A JSON object that represents the same values as would have been set in your `generator-options` section of the starter project.

## Tests
There are currently 5 common tests:

* test-cli-config
  - This will test the contents of the cli-config.yml, ensuring all the expected entries are found in the cli-config.yml
* test-docker
  - This will test that all the expected docker files exists
* test-bluemix
  - This will test that all the expected bluemix files exits
* test-manifest
  - This will test the contents of the manifest.yml file
* test-pipeline
  - This will test the contents of the pipeline.yml file
* test-pattern-bff
  - This will test common BFF pattern requirements
```
Example usage :-

'use strict'
const path = require('path');
const tests = require('@arf/common-codegen-tests');
const generatorLocation = path.join(__dirname, '../app');

// Options specifically for Swift generator
var options = { type: 'web', docker: true };
tests.test('test-cli-config', generatorLocation, 'SWIFT', options);
```

# Example usage
The example usage below shows a test case that would be added to a language generator test suite.

```
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var YMock = require('./yaasmock');

describe('generator : common test docker files', function () {

  describe('Generates a basic project (no services)', function () {

    const ymock = new YMock("testProject", platform, options);

    before(function() {
      return helpers.run(generatorLocation).
                    .withOptions(ymock.getOptions())
                    .toPromise();
    });

    it('should create a basic project', function () {
      assert(...);
    });
  });
});
```

# Version 2 and later
Version 2.0.0 of this module separated the generation phase from the test phase, allowing clients to skip the generation step if
they already have content that needs to be validated. The existing syntax from earlier versions (see above) is still supported, although
under the covers the parameters are mapped onto the new test structure.

## Only running the tests
In order to run the tests only, you need to specify more information than if the test suite had performed the generation itself, primarily where
the content is that needs to be validated. You will also need to override some of the defaults that were originally provided by the generation step, 
such as the project name, host name etc. Also note that some of the properties are only used by some of the tests.

* ALL tests
  - *path* : the location of the content to test.
  - *appName* : the name of the generated application.
  - *project* : the name of the generated project (can be different from the application name)
* test-docker
  - *version* : the version of the cli-config.yml file to be tested.
* test-manifest
  - *host* : name of the host in the manifest.yml file
  - *domain* : deployment domain for the manifest.yml

See the example below for more details.


## Example usage

The example below shows running all the test suites against the same pattern generated for each language.

```
const assert = require('assert');
const tests = require('@arf/common-codegen-tests');
const test_bluemix = tests.test('test-bluemix');
const APP_NAME = "basicwebjava";

const platforms = ['java', 'node', 'python', 'swift'];
const suites = ['bluemix', 'cli-config', 'docker', 'manifest', 'pipeline'];


platforms.forEach(platform => {
  describe(platform.toUpperCase() + ' : Common codegen tests', function() {
    suites.forEach(suite => {
      var framework = tests.test('test-' + suite);
      var appName = 'basicweb' + platform;
      framework.path = './test/resources/' + appName + '/';
      framework.appName = appName;
      framework.domain = "stage1";   //set the domain for this test
      framework.host = "basicweb" + platform.toLowerCase();
      framework.project = "basicweb" + platform.toLowerCase();
      framework.version = platform === 'java' ? '0.0.2' : '0.0.3';
      framework.test(true);
    });
  });
})
```