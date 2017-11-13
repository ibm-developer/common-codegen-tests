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

//common test module to mock YaaS invocation of generators


function mock_cloudant(name) {
  var instance = {
    "serviceInfo": {
      "name": name,
      "label": "cloudantNoSQLDB",
      "plan": "Lite"
    },
    "url": "https://bluemix.cloudant.com",
    "username": "userid-bluemix",
    "password": "password-bluemix"
  };
  return instance;
}

function clone(from, to) {
  for (var prop in from) {
    if (from.hasOwnProperty(prop)) {
        to[prop] = from[prop];
    }
  }
}

var mockService = function(type, name) {
  if(this.serviceNames[name]) {
    throw "The service " + name + " has already been mocked";
  }
  try {
    this.serviceNames[name] = eval('(mock_' + type +'("' + name + '"))');
    if(!this.options.bluemix[type]) {
      this.options.bluemix[type] = [];
    }
    this.options.bluemix[type].push(this.serviceNames[name]);
    this.options.bluemix.server.services.push(name);
  } catch (e) {
    //throw 'Unknown service type : ' + type;
    throw e;
  }
}

function YaaSMock(name, backendPlatform, generatorOptions) {
  this.options = {
    backendPlatform : backendPlatform,
    bluemix : {
      name : name,
      server : {
        name : name,
        host : "host",
        domain : "domain.mybluemix.net",
        instances : 3,
        memory : "1024M",
        diskQuota : "512M",
        services : []
      }
    }
  };
  if(generatorOptions) {
    clone(generatorOptions, this.options);    //these are options that would be set in YaaS generator options
  }
  this.serviceNames = {},                   //used to ensure unique service names
  this.mockService = mockService;
  this.getOptions = function() {
    return this.options;
  }
}

module.exports = exports = YaaSMock;
