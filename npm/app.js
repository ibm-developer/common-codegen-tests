/*
 * Copyright IBM Corporation 2017
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

//module for the common tests
'use strict';

var YMock = require('./lib/yaasmock');
var pkg = require('./package.json');

console.log("Common tests version " + pkg.version);

function test(file, generatorLocation, platform, options) {
  var test = require('./lib/' + file);
  var result = new test(generatorLocation, platform, options);
  if(generatorLocation === undefined) {
    //return the module so that the caller can configure
    return result;
  }
  //run the test with the supplied options
  //testAll() runs multiple tests by default, test() is the default test
  result.testAll ? result.testAll() : result.test();
}

module.exports = {
  YMock : YMock,
  test: test,
}
