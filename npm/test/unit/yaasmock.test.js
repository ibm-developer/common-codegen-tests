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

//test the YaaS mock module

var assert = require('yeoman-assert');
var YMock = require('../../lib/yaasmock');

const APPNAME = "appName";

describe('YaaS mock module', function() {

  describe('generate mock', function() {
    it('should be constructable with no options', function(){
      var ymock = new YMock(APPNAME, "platform");
      assert.equal("platform", ymock.getOptions().backendPlatform);
      assert.equal(APPNAME, ymock.getOptions().bluemix.name);
    });
    it('it should be constructable with options', function(){
      var options = { "test" : "true"};
      var ymock = new YMock(APPNAME, "platform", options);
      assert.equal("platform", ymock.getOptions().backendPlatform);
      assert.equal("true", ymock.getOptions().test);
    });
  });

  describe('generate mock services', function() {
    it('should not be possible to mock the same named service twice', function(){
      var options = { "test" : "true"};
      var ymock = new YMock(APPNAME, "platform", options);
      ymock.mockService('cloudant', 'mycloudantsvc');
      assert.equal("platform", ymock.getOptions().backendPlatform);
      assert.throws(() => {ymock.mockService('cloudant', 'mycloudantsvc')});
    });
    it('should not be possible to mock a service with an unknown type', function(){
      var options = { "test" : "true"};
      var ymock = new YMock(APPNAME, "platform", options);
      assert.throws(() => {ymock.mockService('madeuptype', 'mycloudantsvc');});
    });
  });

  describe('generate mock cloudant services', function() {
    it('should be possible to mock cloudant', function(){
      var options = { "test" : "true"};
      var ymock = new YMock(APPNAME, "platform", options);
      ymock.mockService('cloudant', 'mycloudantsvc');
      assert.equal("platform", ymock.getOptions().backendPlatform);
      assert.equal("true", ymock.getOptions().test);
      assert.equal(1, ymock.getOptions().bluemix.cloudant.length);
      assert.equal('mycloudantsvc', ymock.getOptions().bluemix.cloudant[0].serviceInfo.name);
      assert.equal('cloudantNoSQLDB', ymock.getOptions().bluemix.cloudant[0].serviceInfo.label);
      assert.equal('Lite', ymock.getOptions().bluemix.cloudant[0].serviceInfo.plan);
      assert.equal('mycloudantsvc', ymock.getOptions().bluemix.server.services[0]);
    });
  });

});
