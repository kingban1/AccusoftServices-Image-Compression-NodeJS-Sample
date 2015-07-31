'use strict';

var chai = require('chai'),
  expect = chai.expect,
  fs = require('fs'),
  request = require('request'),
  CompressService = require('../compress.js');

describe('Compress Service', function () {
  var oldCreateReadStream = fs.createReadStream,
    oldCreateWriteStream = fs.createWriteStream,
    oldPost = request.post,
    fsWriteStreamError = null,
    requestPostStatusCode = null;

  beforeEach(function () {
    request.post = function () {
      return {
        on: function (event, callback) {
          if (event === 'response') {
            callback({
              statusCode: requestPostStatusCode || 200,
              pipe: function (stream) {
                return this;
              }
            });
          }
          return this;
        }
      };
    };
    fs.createReadStream = function (filePath) {
      return {
        pipe: function (stream) {
          return this;
        }
      };
    };
    fs.createWriteStream = function (filePath) {
      if (filePath === 'test/bad-output.jpg') {
        fsWriteStreamError = true;
      }
      return {
        on: function (event, callback) {
          if (event === 'error' && fsWriteStreamError) {
            callback(new Error('unable to write file'));
          } else if (event === 'finish' && !fsWriteStreamError) {
            callback();
          }
          return this;
        },
        pipe: function (stream) {
          return this;
        }
      };
    };
  });

  afterEach(function () {
    fs.createReadStream = oldCreateReadStream;
    fs.createWriteStream = oldCreateWriteStream;
    request.post = oldPost;
    fsWriteStreamError = null;
    requestPostStatusCode = null;
  });

  describe('constructor', function () {
    it('fails if no config', function () {
      expect(function () {
        new CompressService();
      }).to.throw();
    });

    it('fails if no key', function () {
      expect(function () {
        new CompressService({ apiKey: null });
      }).to.throw();
    });

    it('succeeds if all values are set', function () {
      expect(function () {
        new CompressService({ apiKey: 'key' });
      }).to.not.throw();
    });
  });

  describe('reduce', function () {
    function getCompressService() {
      return new CompressService({ apiKey: 'key' });
    }

    it('fails with no callback', function () {
      expect(function () {
        getCompressService()
          .reduce();
      }).to.throw();
    });

    it('fails with invalid inputFilePath', function (done) {
      getCompressService()
        .reduce(null, null, function (error) {
          expect(error).to.be.ok;
          done();
        });
    });

    it('fails with invalid outputFilePath', function (done) {
      getCompressService()
        .reduce('test.jpg', null, function (error) {
          expect(error).to.be.ok;
          done();
        });
    });

    it('succeeds with valid input', function (done) {
      getCompressService()
        .reduce('test/input.jpg', 'test/output.jpg', function (error) {
          expect(error).to.not.be.ok;
          done();
        });
    });

    it('fails if service responds with statusCode >= 300', function (done) {
      requestPostStatusCode = 404;
      getCompressService()
        .reduce('test/input.jpg', 'test/output.jpg', function (error) {
          expect(error).to.be.ok;
          done();
        });
    });

    it('fails if the output cannot be written out', function (done) {
      getCompressService()
        .reduce('test/input.jpg', 'test/bad-output.jpg', function (error) {
          expect(error).to.be.ok;
          done();
        });
    });
  });
});
