/*
These sets of tests test if the cli-config exists and the contents of it.
*/

'use strict'

const test_base = require('./test-base');
const fs = require('fs');
const YMock = require('./yaasmock');
const yml = require('js-yaml');
const CLI_CONFIG_YML = 'cli-config.yml';
const assert = require('yeoman-assert');

function clone(from) {
  var to = {};
  for (var prop in from) {
    if (from.hasOwnProperty(prop)) {
        to[prop] = from[prop];
    }
  }
  return to;
}

//required entries for the cli-config.yml
const reqEntries = ['container-name-run', 'container-name-tools', 'image-name-run',
                    'image-name-tools', 'build-cmd-run', 'test-cmd', 'build-cmd-debug',
                    'container-path-run', 'container-path-tools', 'container-port-map', 'container-port-map-debug',
                    'dockerfile-run', 'dockerfile-tools', 'debug-cmd'];

//these entries are optional
const optionalEntries =  {
  'host-path-tools' : true,
  'stop-cmd' : true,
  'host-path-run':  true,
  'run-cmd': true,
  'version': true,
  'chart-path': true
};

class test_cli_config extends test_base {
  constructor(generatorLocation, platform, options) {
    super(generatorLocation, platform, options);
  }

  test(exists) {
    if(exists == undefined) {
      exists = true;    //default check for the existence of files
    }
    if(!this.ymock) {
      this.ymock = new YMock(this.appName, this.platform, this.options);
    }
    var prefix = this.path || '';
    var self = this;
    var check = this.getCheck(exists);

    describe('Generates a cli-config with properties', function () {
      var data;
      var ymock = self.ymock; //new YMock(self.appName, self.platform, self.options);

      if(self.generatorLocation) {
        before(self.before.bind(self));
      }

      it(check.desc + 'a cli-config.yml file', function () {
        check.file(prefix + CLI_CONFIG_YML);
        data = yml.safeLoad(fs.readFileSync(prefix + CLI_CONFIG_YML, 'utf8'));
      });

      it('it doesn\'t generate unexpected values in cli-config.yml', function() {
        var shadow = clone(data);   //make a copy of the values
        var messages = []
        reqEntries.forEach((value, index) => {
          //check value is present and has been set to something
          if(!(shadow[value] && shadow[value].length)) {
              messages.push("Missing " + CLI_CONFIG_YML + " entry : " + value);
          }
          shadow[value] = undefined;
        });
        //now make sure that the shadow object doesn't contain any values
        for (var prop in shadow) {
          if (shadow.hasOwnProperty(prop)) {
              if(shadow[prop] && !optionalEntries[prop]) {
                messages.push("Missing or unexpected entry found in " + CLI_CONFIG_YML + " : " + prop);
              }
          }
        }
        assert.strictEqual(messages.length, 0, `Extraneous or missing keys found in ${CLI_CONFIG_YML}: ` + JSON.stringify(messages));
      });

      it('generates the correct value for dockerfile-run', function() {
        var expectedValue = 'Dockerfile';
        assert.strictEqual(data['dockerfile-run'], expectedValue, `dockerfile-run has wrong value '${data['dockerfile-run']}' it should be '${expectedValue}'`);
      });

      it('generates the correct value for dockerfile-tools', function() {
        var expectedValue = 'Dockerfile-tools'
        assert.strictEqual(data['dockerfile-tools'], expectedValue, `dockerfile-tools has wrong value '${data['dockerfile-tools']}' it should be '${expectedValue}'`);
      });

      it('contains the app name in container-name-run', function() {
        var appName = ymock.getOptions().bluemix.name;
        var containsAppName = 'container-name-run';
        assert(data[containsAppName].includes(appName) || data[containsAppName].includes(appName.toLowerCase()),
          `${CLI_CONFIG_YML} error, could not find app name \'${appName}\' in ${containsAppName} : ${data[containsAppName]}`);
      });

      it('contains the app name in container-name-tools', function() {
        var appName = ymock.getOptions().bluemix.name;
        var containsAppName = 'container-name-tools';
        assert(data[containsAppName].includes(appName) || data[containsAppName].includes(appName.toLowerCase()),
          `${CLI_CONFIG_YML} error, could not find app name \'${appName}\' in ${containsAppName} : ${data[containsAppName]}`);
      });

      it('generates image name in lowercase', function() {
        var imageName = data['image-name-run'];
        assert.strictEqual(imageName, imageName.toLowerCase(), `image-name-run should be lowercase`);
      });
    });
  }
}

module.exports = test_cli_config;
