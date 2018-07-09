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


 //base test class to be extended

'use strict'

const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const YMock = require('./yaasmock');

class test_base {
  constructor(generatorLocation, platform, options) {
    this.appName = "testProject";       //default application name
    this.generatorLocation = generatorLocation;
    this.platform = platform;
    this.options = options;
  }

  //handy function for checking both existence and non-existence
  getCheck(exists) {
    return {
      file : exists ? assert.file : assert.noFile,
      desc : exists ? 'should create ' : 'should not create ',
      content : exists ? assert.fileContent : assert.noFileContent
    }
  }

  before() {
    this.ymock = new YMock(this.appName, this.platform, this.options);
    return helpers.run(this.generatorLocation)
        .withOptions(this.ymock.getOptions())
        .toPromise();
  }
}

module.exports = test_base;