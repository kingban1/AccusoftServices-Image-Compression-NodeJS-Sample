'use strict';

var path = require('path'),
  fs = require('fs'),
  request = require('request');

function CompressService(config) {
  if (!config) {
    throw new Error('Missing parameter config');
  }

  if (!config.apiKey) {
    throw new Error('config.apiKey must be set');
  }

  this.apiKey = config.apiKey;
}

CompressService.prototype.reduce = function (inputFilePath, outputFilePath, callback) {
  if (!callback) {
    throw new Error('Missing parameter callback');
  }
  if (!inputFilePath) {
    callback(new Error('Missing parameter inputFilePath'));
    return;
  }
  if (!outputFilePath) {
    callback(new Error('Missing parameter ouputFilePath'));
    return;
  }

  var fileName = path.basename(inputFilePath);

  var options = {
    url: 'https://api.accusoft.com/v1/imageReducers/' + fileName,
    headers: {
      'acs-api-key': this.apiKey
    }
  };

  fs.createReadStream(inputFilePath)
    .pipe(request.post(options)
      .on('response', function (response) {
        if (response.statusCode > 300) {
          callback(new Error('Failure to reduce'));
        } else {
          response.pipe(fs.createWriteStream(outputFilePath)
            .on('error', function (error) {
              callback(error);
            })
            .on('finish', function () {
              callback(null);
            }));
        }
      }));
};

module.exports = CompressService;
