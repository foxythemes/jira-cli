'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _jiraClient = require('jira-client');

var _jiraClient2 = _interopRequireDefault(_jiraClient);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _docs = require('./docs');

var _docs2 = _interopRequireDefault(_docs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Packages
// Native
var JiraCLI = function () {
	function JiraCLI(config) {
		(0, _classCallCheck3.default)(this, JiraCLI);

		// Get the sub-commands documentation
		this.docs = new _docs2.default();
		this.config = config;

		// Connect to Jira
		var jira = new _jiraClient2.default(config);

		var projectsList = [];
		var projectKeys = [];
		var issueTypeList = [];
	}

	(0, _createClass3.default)(JiraCLI, [{
		key: 'cmdConfig',
		value: function cmdConfig(cmd, options) {
			// If no command is provided show help
			if (typeof cmd === 'undefined') {
				this.docs.config();
			} else {

				// Remove config file
				if (cmd == 'remove') {
					this.removeConfigFile();
				}
			}
		}

		// Remove config file

	}, {
		key: 'removeConfigFile',
		value: function removeConfigFile() {
			console.log(this.config.filePath);
			_fsPromise2.default.unlinkSync(this.config.filePath);
			console.log('Config file succesfully deleted');

			process.exit();
		}
	}]);
	return JiraCLI;
}();

/*
// Make a jira API request
function apiRequest(path){
	return jira.doRequest(jira.makeRequestHeader(jira.makeUri({
		pathname: path,
	})));
}

// Get metadata to create the issues
function getMeta(){
	return apiRequest('/issue/createmeta');	
}

// Load jira projects
function loadProjects(callback){
	jira.listProjects()
	  .then(function(projects) {

	  	for (var index in projects){
	  		projectsList.push(projects[index].name);
	  		projectKeys.push(projects[index].key);
	  	}

	  	if (callback){
	  		callback(projects);
	  	}
	  })
	  .catch(function(err) {
	    console.error(err);
	  });
}

// Load jira issue types
function loadIssueTypes(callback){
	jira.listIssueTypes()
	  .then(function(types) {

	  	for (var i in types){
	  		issueTypeList.push(types[i].name);
	  	}

	  	if (callback){
	  		callback(types);
	  	}
	  })
	  .catch(function(err) {
	    console.error(err);
	  });
}

// Create issue
function createIssue(){

	getMeta().then(function(meta){

		var projects = []; 
		var keys = [];
		var issueTypes = [];
		var selectedProject;

		// Populate projects, keys and their respective issue types
		for ( var index in meta.projects ){
  		projects.push(meta.projects[index].name);
  		keys.push(meta.projects[index].key);
  		issueTypes.push(meta.projects[index].issuetypes);
  	}

  	// Create the project question
		var project = [
		  {
		    type: 'list',
		    name: 'project',
		    message: 'Project: ',
		    choices: projects,
		    filter: function(val){
		    	selectedProject = projects.indexOf(val);
		    	return keys[selectedProject];
		    }
		  }
		];

		inquirer.prompt(project).then(function (answers1) {

			var projectIssueTypes = [];

			// Get issue types of the selected project
			for ( var i in issueTypes[selectedProject] ){
	  		projectIssueTypes.push(issueTypes[selectedProject][i].name);
	  	}

			var questions = [
			  {
			    type: 'list',
			    name: 'issueType',
			    message: 'Issue type: ',
			    choices: projectIssueTypes
			  },
			  {
			  	type: 'input',
			  	name: 'issueName',
			  	message: 'Please provide the issue name :',
			  	default: 'New Issue'
			  }
			];

			// Ask for the issue name and type
			inquirer.prompt(questions).then(function (answers2) {

				// Create the issue object
				var newIssue = {
					"fields": {
						"project": { 
						  "key": answers1.project
						},
						"summary": answers2.issueName,
						"issuetype": {
						  "name": answers2.issueType
						}
					}
				};

				// Create new issue
				jira.addNewIssue(newIssue)
				  .then(function(issue) {
				  	console.log('');
				    console.log('New issue: ' + color.bold.red(issue.key));
				    console.log(config.protocol + '://' + config.host + '/browse/' + issue.key);
				    console.log('');
				  })
				  .catch(function(err) {
				    console.error(err);
				  });
			});
		});
	});
}*/
/*
module.exports = {
	createIssue: function(arg){
		createIssue();
	}
};*/


// Local


exports.default = JiraCLI;
module.exports = exports['default'];