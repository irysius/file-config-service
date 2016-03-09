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
	it('is expected to throw when mandatory constructor parameters are not passed', function () {
		var error;
		try {
			var fileConfigService = FileConfigService();
		} catch (e) { error = e; }
		console.log(error);
		expect(error).to.exist;
	});
	it('is expected to not change the config if no match is found', function (done) {
		var fileConfigService = FileConfigService({ 
			rootFolder: configPath, 
			paths: ['config-test.json']
		});
		var defaultConfig = { alpha: 'bravo', omega: 'gamma' };
		Promise.resolve().then(function () {
			return fileConfigService.transform(defaultConfig);	
		}).then(function (newConfig) {
			expect(newConfig).to.eql(defaultConfig);	
		}).then(function () {
			done();
		}).catch(function (err) {
			done(err);
		});
	});
	it('is expected to alter the config if a match is found', function (done) {
		var fileConfigService = FileConfigService({ 
			rootFolder: configPath, 
			paths: ['config-test.json', 'config.json']
		});
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
		
		Promise.resolve().then(function () {
			return fileConfigService.transform(defaultConfig);	
		}).then(function (newConfig) {
			expect(newConfig).to.eql(targetConfig);	
		}).then(function () {
			done();
		}).catch(function (err) {
			done(err);
		});
	});
	it('is expected to take in account locator information', function (done) {
		function locator() { return ['local']; }
		var fileConfigService = FileConfigService({ 
			rootFolder: configPath, 
			paths: ['config-test.json', 'config.json'],
			locator: locator
		});
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
		
		Promise.resolve().then(function () {
			return fileConfigService.transform(defaultConfig);	
		}).then(function (newConfig) {
			expect(newConfig).to.eql(targetConfig);	
		}).then(function () {
			done();
		}).catch(function (err) {
			done(err);
		});
	});
});