# node.js image compression example code
The following is sample code for nodejs image compression using Accusoft Services API.  
### Overview
The Accusoft Services image compression API gives you faster image compression and decompression, and higher-quality images, saving you space for storing your images and improving the performance of your website and web applications. Compress JPG and PNG files.

Learn more about [Accusoft Services image compression here](https://www.accusoft.com/products/accusoft-cloud-services/acs-compression/).
### Installation
Download the package and type

	npm install
Open **config.json** and replace everything within the quotes including the curly braces with a valid [api key](http://www.accusoft.com/portal/ "Get your api key") obtained for **free** from accusoft.com.

	{
	  "apiKey": "{{ valid key here }}"
	}

This code will not function without a valid api key. Please sign up at [www.accusoft.com/products/accusoft-cloud-services/portal/](http://www.accusoft.com/portal/ "Get your api key") to get your key.
### Usage instructions
From within the subdirectory where you installed this code example, type

	node app OPERATION INPUT PATH

		OPERATION: reduce
		INPUT: path to your file, including filename
		PATH: path to your output file, including the filename

### Example
	node app reduce ./mybigfile.jpg ./mysmallfile.jpg

### Explanation
This is a fully functioning example to get you started using the compression service. The main call to the api is within **compress.js**. Here is a brief walkthrough of that file.


#### Including required node modules
	'use strict';

	var path = require('path'),
	  fs = require('fs'),
	  request = require('request');

#### Creating a compress service module
The first step is to create the base module and make a check for the api key.

	function CompressService(config) {
	  if (!config) {
	    throw new Error('Missing parameter config');
	  }

	  if (!config.apiKey) {
	    throw new Error('config.apiKey must be set');
	  }

	  this.apiKey = config.apiKey;
	}

#### Creating the reduce method within the compress module
In this function, the contents are read from the **inputFilePath**, sent to the Accusoft Services api, and the compressed file is placed into the **outputFilePath**. In this example code, a callback function is required.

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

#### Exporting the module
The final step is to export the module for use by the main app.

	module.exports = CompressService;

## Support
Learn more about [Accusoft Services image compression here](https://www.accusoft.com/products/accusoft-cloud-services/acs-compression/).

If you have questions, please visit our online [help center](https://accusofthelp.zendesk.com/hc/en-us).
