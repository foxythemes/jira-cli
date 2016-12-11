#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _jira = require('./jira');

var _jira2 = _interopRequireDefault(_jira);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load the config file


// Local
var configFile = new _config2.default();

// Initiaize the config file


// Packages
configFile.init('.jira-cl.json').then(function () {

	// Create a new instance of JiraCLI
	var jira = new _jira2.default(configFile);

	_commander2.default.version('1.0.0');

	/**
  * Create issue
  */

	_commander2.default.command('create [options]').description('Create a new issue').action(jira.createIssue);

	/**
  * Remove config file
  */

	_commander2.default.command('config [command]').description('Configuration file options').option("-h, --help", "").action(function (c, o) {
		jira.cmdConfig(c, o);
	});

	/**
  * Show help if executes with no arguments
  */

	if (!process.argv.slice(2).length) {
		_commander2.default.outputHelp();
	}

	_commander2.default.parse(process.argv);
});