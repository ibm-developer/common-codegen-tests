/*
These sets of tests only test if the set of docker files have been generated
and currently does not test the contents due to the contents not being common
across the languages.
*/
'use strict'

const assert = require('yeoman-assert');
const test_base = require('./test-base');
const semver = require('semver');
const CLI_LATEST = '0.0.3';   //latest version of the CLI

class test_docker extends test_base {
  constructor(generatorLocation, platform, options) {
    super(generatorLocation, platform, options);
    this.version = CLI_LATEST;
  }

  test(exists) {
    if(exists == undefined) {
      exists = true;    //default check for the existence of files
    }
    var prefix = this.path || '';
    var self = this;
    var check = this.getCheck(exists);

    describe('Generates a set of docker files', function () {

      if(self.generatorLocation) {
        before(self.before.bind(self));
      }

      it(check.desc + 'Dockerfile file', function () {
        check.file(prefix + 'Dockerfile');
      });

      it(check.desc + 'Dockerfile-tools file', function() {
        check.file(prefix + 'Dockerfile-tools');
      });

      if(semver.gte(self.version, '0.0.3')) {
        it(check.desc + 'Dockerfile-tools 0.0.3 file with the entries to set non-root user', function() {
          check.content(prefix + 'Dockerfile-tools', 'ARG bx_dev_user=root');
          check.content(prefix + 'Dockerfile-tools', 'ARG bx_dev_userid=1000');
          // CHECK(tunniclm): According to @ricardo.olivieri this line is not required for Swift
          // If this is incorrect, then we need to update the Swift Dockerfiles
          // If this is correct and also not required for other languages, then we should remove the assertion
          // If this really is an exception for Swift, then we should delete this comment!
          // This should be addressed as part of the following issue:
          // https://github.ibm.com/arf/planning-swift-solutions/issues/318
          if (self.platform !== 'SWIFT') {
            check.content(prefix + 'Dockerfile-tools', 'RUN BX_DEV_USERID=$bx_dev_userid');
          }
          check.content(prefix + 'Dockerfile-tools', /RUN if \[ "?\$bx_dev_user"? != "?root"? \]; then useradd -ms \/bin\/bash -u \$bx_dev_userid \$bx_dev_user; fi/);
        });
      }

      if(semver.eq(self.version, '0.0.2')) {
        // this test was added to ensure compliance with issue https://github.ibm.com/arf/cli-dev-plugin/pull/109
        it('should generate a Dockerfile-tools file with the entries to set non-root user', function() {
          check.content(prefix + 'Dockerfile-tools', 'ARG bx_dev_userid=root');
          check.content(prefix + 'Dockerfile-tools', 'RUN BX_DEV_USERID=$bx_dev_userid');
          check.content(prefix + 'Dockerfile-tools', 'RUN if [ $bx_dev_userid != "root" ]; then useradd -ms /bin/bash $bx_dev_userid; fi');
        });
      }

      it('should not generate the deprecated Dockerfile-run file', function() {
        assert.noFile(prefix + 'Dockerfile-run');
      });
    });
  }
}

module.exports = test_docker;
