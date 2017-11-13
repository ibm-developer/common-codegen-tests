/*
These sets of tests test if the manifest exists and the contents of it.
*/

'use strict'

const PIPELINE_YML = '.bluemix/pipeline.yml';

var fs = require('fs');
var assert = require('yeoman-assert');
var yml = require('js-yaml');

const test_base = require('./test-base');

class test_pipeline extends test_base {
  constructor(generatorLocation, platform, options) {
    super(generatorLocation, platform, options);
  }

  testAll(exists) {
    this.test(exists);
    this.testcloudant(exists);
  }

  test(exists) {
    if(exists == undefined) {
      exists = true;    //default check for the existence of files
    }
    var prefix = this.path || '';
    var self = this;
    var check = this.getCheck(exists);

    describe('Generates a pipeline file with no services with the correct contents', function() {
      if(self.generatorLocation) {
        before(self.before.bind(self));
      }

      it(check.desc + 'generates the pipeline.yml file', function() {
        assert.file(prefix + PIPELINE_YML);
      });

      it(check.desc + 'generates pipeline with no services', function() {
        assert.noFileContent(prefix + PIPELINE_YML, 'cf create-service');
      });
    });
  }

  testcloudant(exists) {
    if(exists == undefined) {
      exists = true;    //default check for the existence of files
    }
    var prefix = this.path || '';
    var self = this;
    var check = this.getCheck(exists);

    describe('Generates a manifest file with Cloudant with the correct contents', function() {
      if(self.generatorLocation) {
        before(self.before.bind(self));
      }

      it(check.desc + 'generates the pipeline.yml file', function() {
        check.file(prefix + PIPELINE_YML);
      });

      it(check.desc + 'generates the cf create command for the Cloudant service', function() {
        check.content(prefix + PIPELINE_YML, 'cf create-service');
        check.content(prefix + PIPELINE_YML, 'cloudantNoSQLDB', 'Should specify the service type "cloudantNoSQLDB"');
        check.content(prefix + PIPELINE_YML, 'cloudantService', 'Should specify the service name "cloudantService"');
        check.content(prefix + PIPELINE_YML, 'Lite', 'Should specify the service plan "Lite"');
      });

    });
  }
}


module.exports = test_pipeline;
