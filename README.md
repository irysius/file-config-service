#File Config Service

Relies on a global implementation of Promise.

This service assumes an application that takes a very particular shape, and may not be applicable for all purposes.

It is intended to be used with `@irysius/config-service`. 

It searches paths progressively for configuration files, and optionally merge in environment specific configurations if necessary.

For all paths, it is suggested an absolute path be provided.

## Installation

	$ npm install @irysius/file-config-service
	
## Usage

To instantiate a service:

	var FileConfigService = require('@irysius/file-config-service');
	var fileConfigService = FileConfigService({ rootFolder: __dirname, paths: ['config.json'] });
	
By default it is assumed the config will be assembled in the following manner:

	configManager
		.use(fileConfigService)
		.assemble().then(function (config) {
			// Use config
		});
		
But you may use it as a standalone like so:

	fileConfigService.transform(prevConfig).then(function (config) {
		// Use config
	});
	
## API
### constructor
`FileConfigService({ rootFolder: String, paths: Array<String>, locator?: () => Array<String>})`

Constructor for the config service.

The root folder is mandatory, and is the root by which the paths array will resolve from.

The paths array is mandatory, but may be empty. The service proceeds down the list one-by-one until it finds a matching file. It only considers the first match.

Once a match is found, the locator, if provided, will be used to search for additional files that may need to be merged in.

### fileConfigService.transform
`fileConfigService.transform(prevConfig: {}) => Promise<nextConfig: {}>`

Tries to merge in the located configuration, and returns a Promise of the new configuration.