var request = require("request");
var path = require('path');
var fs = require('fs');
var JiraApi = require('jira-client');
var inquirer = require('inquirer');
var docs = require('./docs.js');
var color = require('chalk');

var configFilePath = path.join(process.env.HOME, '.jira-cl.json');
var config, jiraHost, jiraUser, password;

/**
 * Load config file
 */

var loadConfigFile = function(path) {
  var config;
  config = fs.readFileSync(path);
  return JSON.parse(config);
};

// Load config file
config = loadConfigFile(configFilePath);

// Connect to Jira
var jira = new JiraApi(config);

var projectsList = [];
var projectKeys = [];
var issueTypeList = [];

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
}

// Remove config file
function removeConfigFile(){
	fs.unlinkSync(configFilePath);
  console.log('Config file succesfully deleted');

  process.exit();
}

module.exports = {
	createIssue: function(arg){
		createIssue();
	},
	config: function(cmd, options){

		// If no command is provided show help
		if (typeof cmd === 'undefined'){
			docs.config();
		}else{

			// Remove config file
			if ( cmd == 'remove' ){
				removeConfigFile();
			}
		}
	}
};