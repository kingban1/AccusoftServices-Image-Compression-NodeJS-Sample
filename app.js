'use strict';

var CompressService = require('./compress.js'),
  argsValidator = require('./argsValidator.js'),
  parseArgs = require('minimist'),
  config = require('./config.json');

function execute(args) {
  var compressService = new CompressService({ apiKey: config.apiKey });

  if (args.operation === 'reduce') {
    compressService.reduce(args.inputFilePath, args.outputFilePath, function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Applied ' + args.operation + ' to ' + args.inputFilePath + ' writing output to ' + args.outputFilePath);
      }
    });
  }
}

var args = argsValidator.validateArgs(parseArgs(process.argv.slice(2)));

if (!args) {
  process.exit(-1);
}
execute(args);
