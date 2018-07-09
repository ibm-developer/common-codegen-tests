/*
 * © Copyright IBM Corp. 2017, 2018
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
These sets of tests test if the manifest exists and the contents of it.
*/

'use strict'

var fs = require('fs');
var assert = require('yeoman-assert');
var yml = require('js-yaml');

const test_base = require('./test-base');

class test_manifest extends test_base {
  constructor(generatorLocation, platform, options) {
    super(generatorLocation, platform, options);
    this.domain ="domain";        //default domain
    this.host = "host";           //default host
    this.project = "testProject"; //default project name
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

    describe('Generates a manifest file with no services with the correct contents', function() {
      if(self.generatorLocation) {
        before(self.before.bind(self));
      }

      var data;

      it(check.desc + 'the manifest.yml file', function() {
        assert.file(prefix + 'manifest.yml');
        data = yml.safeLoad(fs.readFileSync(prefix + 'manifest.yml', 'utf8')).applications[0];
      });

      it(check.desc + 'the correct project name', function() {
        assert.equal(data.name, self.project);
      })

      it(check.desc + 'the correct host name', function() {
        assert.equal(data.host, self.host);
      });

      it(check.desc + 'the correct domain name', function() {
        assert.equal(data.domain, self.domain + '.mybluemix.net');
      });

      it(check.desc + 'no services', function() {
        assert.strictEqual(data.services, undefined, 'Should not have any services specified');
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

      var data;

      it(check.desc + 'the manifest.yml file', function() {
        assert.file(prefix + 'manifest.yml');
        data = yml.safeLoad(fs.readFileSync(prefix + 'manifest.yml', 'utf8')).applications[0];
      });

      it(check.desc + 'the correct project name', function() {
        assert.equal(data.name, self.project);
      })

      it(check.desc + 'the correct host name', function() {
        assert.equal(data.host, self.host);
      });

      it(check.desc + 'the correct domain name', function() {
        assert.equal(data.domain, self.domain + '.mybluemix.net');
      });

      it(check.desc + 'services with Cloudant', function() {
        assert.strictEqual(data.services.length, 1, 'Should only have one service specified');
        assert.equal(data.services[0], 'cloudantService');
      });

    });
  }
}

module.exports = test_manifest;
