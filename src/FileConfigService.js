var _ = require('lodash');
var fs = require('fs');
var PATH = require('path');

function FileConfigService(rootFolder) {
	if (!rootFolder) { throw new Error('FileConfigService requires an explicitly provided path to root all searches in.'); }
	function extendWithFiles(paths, locator) {
		return function extendWithFiles(config) {
			let content = findConfig(paths, locator);
			if (content !== null) {
				console.log(content);
				console.log(config);
				return _.assign({}, config, content);
			} else {
				console.info(`No valid configurations found from provided paths.`);
				return config;
			}	
		};
	}
	
	function findConfig(paths, locator) {
		paths = assertStringArray(paths);
		let i, found = false, result = null;
		for (i = 0; i < paths.length; ++i) {
			let path = PATH.resolve(rootFolder, paths[i]);
			console.info(`Considering loading configurations from ${path}`);
			let content = tryParseJson(path);
			if (content != null) {
				console.info(`Using configuration from ${path}`);
				// If a locator is present, find additional environmental configs
				if (_.isFunction(locator)) {
					let suffixes = assertStringArray(locator());
					let dirname = PATH.dirname(path);
					let filename = PATH.basename(path, '.json');
					suffixes.map(suffix => {
						return PATH.resolve(dirname, `${filename}.${suffix}.json`);
					}).forEach(additionalPath => {
						let additionalContent = tryParseJson(additionalPath);
						if (additionalContent != null) {
							// mutate content in place.
							_.assign(content, additionalContent);
						}
					});
					
				}
				result = content;
				found = true;
			}
			if (found) { break; }
		}
		
		return result;
	}
	
	function tryParseJson(filepath) {
		let json = null;
		try {
			let rawText = fs.readFileSync(filepath, 'utf8');
			json = JSON.parse(rawText);
		} catch (e) { /* Empty catch */}
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
		extendWithFiles: extendWithFiles
	};	
}

module.exports = FileConfigService;