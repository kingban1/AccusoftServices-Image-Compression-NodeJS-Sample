'use strict';

var chai = require('chai'),
  expect = chai.expect,
  fs = require('fs'),
  argsValidator = require('../argsValidator.js');

function getBaseArgs() {
  return [
    'node',
    '.'
  ];
}

describe('Args Validator', function () {
  var oldStatSync = fs.statSync,
    output = false;

  beforeEach(function () {
    argsValidator.writeLine = function () { output = true; };
    fs.statSync = function (filePath) {
      return {
        isFile: function () {
          if (filePath === 'test/missing-input.jpg') {
            throw new Error('file does not exist');
          }
          return filePath === 'test/input.jpg';
        },
        isDirectory: function () {
          return filePath === 'test';
        }
      };
    };
  });

  afterEach(function () {
    fs.statSync = oldStatSync;
    output = false;
  });

  describe('validateArgs', function () {
    it('fails if no arguments', function () {
      expect(argsValidator.validateArgs([])).to.not.be.ok;
    });

    it('fails if arguments < 3', function () {
      expect(argsValidator.validateArgs(getBaseArgs())).to.not.be.ok;
    });

    it('fails if operation is not valid', function () {
      expect(argsValidator.validateArgs(getBaseArgs().concat(['bad-operation', 'test/input.jpg', 'test/output.jpg']))).to.not.be.ok;
    });

    it('fails if input file directory is invalid', function () {
      expect(argsValidator.validateArgs(getBaseArgs().concat(['reduce', 'bad-directory/input.jpg', 'test/output.jpg']))).to.not.be.ok;
    });

    it('fails if input file is invalid', function () {
      expect(argsValidator.validateArgs(getBaseArgs().concat(['reduce', 'test/bad-input.jpg', 'test/output.jpg']))).to.not.be.ok;
    });

    it('fails if input file is missing extension', function () {
      expect(argsValidator.validateArgs(getBaseArgs().concat(['reduce', 'test/input', 'test/output.jpg']))).to.not.be.ok;
    });

    it('fails if input file does not exist', function () {
      expect(argsValidator.validateArgs(getBaseArgs().concat(['reduce', 'test/missing-input.jpg', 'test/output.jpg']))).to.not.be.ok;
    });

    it('fails if output file directory is invalid', function () {
      expect(argsValidator.validateArgs(getBaseArgs().concat(['reduce', 'test/input.jpg', 'bad-directory/output.jpg']))).to.not.be.ok;
    });

    it('succeeds with valid values', function () {
      expect(argsValidator.validateArgs(getBaseArgs().concat(['reduce', 'test/input.jpg', 'test/output.jpg']))).to.be.ok;
    });

    it('writes help when requested', function () {
      expect(argsValidator.validateArgs(getBaseArgs().concat(['--help']))).to.not.be.ok;
      expect(output).to.be.ok;
    });
  });
});
