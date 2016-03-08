/* global describe, it, before, after, __dirname */
if (typeof Promise === 'undefined') {
	require('babel-polyfill');
	console.info('Using babel-polyfill');	
}

var expect = require('chai').expect;
var PATH = require('path');
var FileConfigService = require('./../dist/FileConfigService');
var configPath = PATH.resolve(__dirname, './configs');

describe('file-config-service', function () {
	it('is expected to not change the config if no match is found', function () {
		var fileConfigService = FileConfigService(configPath);
		var defaultConfig = { alpha: 'bravo', omega: 'gamma' };
		var newConfig = fileConfigService.extendWithFiles(['config-test.json'])(defaultConfig);
		expect(newConfig).to.eql(defaultConfig);
	});
	it('is expected to alter the config if a match is found', function () {
		var fileConfigService = FileConfigService(configPath);
		var defaultConfig = { alpha: 'bravo', omega: 'gamma' };
		var targetConfig = {
			"alpha": "bravo",
			"omega": "gamma",
			"redis": {
				"host": "127.0.0.1",
				"port": 6379,
				"db": 0 
			},
			"keys": ["one", "two", "three"],
			"basicAuth": {
				"username": "emanresu",
				"password": "drowssap"
			}
		};
		var newConfig = fileConfigService.extendWithFiles(['config-test.json', 'config.json'])(defaultConfig);
		expect(newConfig).to.eql(targetConfig);
	});
	it('is expected to take in account locator information', function () {
		var fileConfigService = FileConfigService(configPath);
		var defaultConfig = { alpha: 'bravo', omega: 'gamma' };
		var targetConfig = {
			"alpha": "bravo",
			"omega": "gamma",
			"redis": {
				"host": "123.456.789.0",
				"port": 1111,
				"db": 0
			},
			"keys": ["five", "six", "seven"],
			"basicAuth": {
				"username": "emanresu",
				"password": "drowssap"
			}
		};
		function locator() { return ['local']; }
		var newConfig = fileConfigService.extendWithFiles(['config-test.json', 'config.json'], locator)(defaultConfig);
		expect(newConfig).to.eql(targetConfig);
	});
});