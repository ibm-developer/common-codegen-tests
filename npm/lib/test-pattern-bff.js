/*
 * © Copyright IBM Corp. 2018
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
