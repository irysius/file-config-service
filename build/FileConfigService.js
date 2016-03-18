'use strict';

var _ = require('lodash');
var fs = require('fs');
var PATH = require('path');

function FileConfigService(_ref) {
	var rootFolder = _ref.rootFolder;
	var paths = _ref.paths;
	var locator = _ref.locator;

	if (!rootFolder) {
		throw new Error('FileConfigService requires an explicitly provided path to root all searches in.');
	}
	if (!paths || !_.isArray(paths)) {
		throw new Error('FileConfigService requires an array of filepaths to check for.');
	}

	function transform(config) {
		return Promise.resolve().then(function () {
			var content = findConfig(paths, locator); // from Service instantiation.
			if (content !== null) {
				return _.assign({}, config, content);
			} else {
				console.info('No valid configurations found from provided paths.');
				return config;
			}
		});
	}

	function findConfig(paths, locator) {
		paths = assertStringArray(paths);
		var i = void 0,
		    found = false,
		    result = null;

		var _loop = function _loop() {
			var path = PATH.resolve(rootFolder, paths[i]);
			console.info('Considering loading configurations from ' + path);
			var content = tryParseJson(path);
			if (content != null) {
				console.info('Using configuration from ' + path);
				// If a locator is present, find additional environmental configs
				if (_.isFunction(locator)) {
					(function () {
						var suffixes = assertStringArray(locator());
						var dirname = PATH.dirname(path);
						var filename = PATH.basename(path, '.json');
						suffixes.map(function (suffix) {
							return PATH.resolve(dirname, filename + '.' + suffix + '.json');
						}).forEach(function (additionalPath) {
							var additionalContent = tryParseJson(additionalPath);
							if (additionalContent != null) {
								// mutate content in place.
								_.assign(content, additionalContent);
							}
						});
					})();
				}
				result = content;
				found = true;
			}
			if (found) {
				return 'break';
			}
		};

		for (i = 0; i < paths.length; ++i) {
			var _ret = _loop();

			if (_ret === 'break') break;
		}

		return result;
	}

	function tryParseJson(filepath) {
		var json = null;
		try {
			var rawText = fs.readFileSync(filepath, 'utf8');
			json = JSON.parse(rawText);
		} catch (e) {/* Empty catch */}
		return json;
	}

	function assertStringArray(value) {
		if (_.isArray(value)) {
			return value;
		}
		if (_.isString(value)) {
			return [value];
		}
		return [];
	}

	return {
		transform: transform
	};
}

module.exports = FileConfigService;
