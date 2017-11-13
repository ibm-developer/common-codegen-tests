/*
These sets of tests test if we have generated all the bluemix files.
*/

'use strict'

const utils = require('./utils');
const YMock = require('./yaasmock');
const test_base = require('./test-base');

class test_bluemix extends test_base {
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
    var check = utils.getCheck(exists);

    describe('Generates basic bluemix files (no services)', function() {
      
      if(self.generatorLocation) {
        before(self.before.bind(self));
      }

      it(check.desc + 'bluemix file manifest.yml', function() {
        check.file(prefix + 'manifest.yml');
      });

      it(check.desc + 'bluemix file pipeline.yml', function() {
        check.file(prefix + '.bluemix/pipeline.yml');
      });

      it(check.desc + 'bluemix file toolchain.yml', function() {
        check.file(prefix + '.bluemix/toolchain.yml');
      });

      it(check.desc + 'bluemix file deploy.json', function() {
        check.file(prefix + '.bluemix/deploy.json');
      });
    });
  }
}


module.exports = test_bluemix;
