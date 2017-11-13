/*
These sets of tests test for common requirements when the BFF pattern is chosen.
*/

'use strict'

const MANIFEST_YML = 'manifest.yml';

var fs = require('fs');
var assert = require('yeoman-assert');
var yml = require('js-yaml');

const test_base = require('./test-base');

class test_pattern_bff extends test_base {
  constructor(generatorLocation, platform, options) {
    super(generatorLocation, platform, options);
  }

  test(exists) {
    if(exists == undefined) {
      exists = true;    //default check for the existence of files
    }
    var prefix = this.path || '';
    var self = this;
    var check = this.getCheck(exists);

    describe('Contains a manifest file with swagger options', function() {
      if(self.generatorLocation) {
        before(self.before.bind(self));
      }
      var data;

      it(check.desc + 'the manifest.yml file', function() {
        assert.file(prefix + MANIFEST_YML);
        var contents = fs.readFileSync(prefix + MANIFEST_YML, 'utf8');
        data = yml.safeLoad(contents);
      });

      it(check.desc + `${MANIFEST_YML} file with a env for OPENAPI_SPEC declared whose value ends in /swagger/api `, function() {
        assert(data.applications[0].env.OPENAPI_SPEC, 'Missing OPENAPI_SPEC env entry');
        assert(data.applications[0].env.OPENAPI_SPEC.endsWith('/swagger/api'), `Invalid OPENAPI_SPEC value of ${data.applications[0].env.OPENAPI_SPEC}`);
      });
    });
  }
}

module.exports = test_pattern_bff;
