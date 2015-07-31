'use strict';

var fs = require('fs'),
  path = require('path'),
  f = {};

module.exports.writeLine = console.log;
function writeLine(line) {
  module.exports.writeLine(line);
}

function validateArgs(argv) {
  function validateFilePath(filePath) {
    var dirname = path.dirname(filePath),
      basename = path.basename(filePath),
      extname = path.extname(filePath),
      isDirectory = fs.statSync(dirname).isDirectory(),
      validFileName = !!basename,
      validExtName = !!extname;

    return isDirectory && validFileName && validExtName;
  }

  var operations = ['reduce'];

  if (argv.help) {
    writeLine('Usage: node app OPERATION INPUT OUTPUT');
    writeLine('Perform OPERATION on INPUT and put result in OUTPUT.');
    writeLine('Valid OPERATION values:');
    writeLine('  reduce');
    return null;
  }

  if (argv._.length < 3) {
    writeLine('Usage: node app OPERATION INPUT PATH');
    return null;
  }

  var operation = argv._[0].toLowerCase(),
    inputPath = argv._[1],
    outputPath = argv._[2];

  if (!operation || operations.indexOf(operation)) {
    writeLine('Invalid operation [' + operation + ']');
    return null;
  }

  if (!validateFilePath(inputPath)) {
    writeLine('Invalid input path [' + inputPath + ']');
    return null;
  }

  try {
    if (!fs.statSync(inputPath).isFile()) {
      writeLine('Invalid input path [' + inputPath + ']');
      return null;
    }
  } catch (error) {
    writeLine('Invalid input path [' + inputPath + ']');
    return null;
  }

  if (!validateFilePath(outputPath)) {
    writeLine('Invalid output path [' + outputPath + ']');
    return null;
  }

  return {
    operation: operation.toLowerCase(),
    inputFilePath: inputPath,
    outputFilePath: outputPath
  };
}

module.exports.validateArgs = validateArgs;
