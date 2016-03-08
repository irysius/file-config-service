#File Config Service

Relies on a global implementation of Promise.

This service assumes an application that takes a very particular shape, and may not be applicable for all purposes.

It is intended to be used with `@irysius/config-service`. 

It searches paths progressively for configuration files, and optionally merge in environment specific configurations if necessary.

For all paths, it is suggested an absolute path be provided.

## Installation

	$ npm install @irysius/config-service
	
## Usage

To instantiate a service:

	var FileConfigService = require('@irysius/file-config-service');
	var fileConfigService = FileConfigService(__dirname);
	
By default it is assumed the config will be assembled in a chain of Promises:

	Promise.resolve({})
		.then(fileConfigService.extendWithFiles(['config.json']))
		.then(function (config) {
			// Use config
		});
		
But you may use it as a standalone like so:

	var config = fileConfigService.extendWithFiles(['config.json'])({});
	
## API
### constructor
`FileConfigService(rootFolder: String)`

### fileConfigService.extendWithFiles
`fileConfigService.extendWithFiles(paths: Array<String>, locator?: () => Array<String>)`
