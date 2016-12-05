var request = require("request");
var path = require('path');
var fs = require('fs');
var JiraApi = require('jira-client');
var inquirer = require('inquirer');

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

	var questions = [
	  {
	    type: 'list',
	    name: 'project',
	    message: 'Project: ',
	    choices: projectsList,
	    filter: function(val){
	    	var pos = projectsList.indexOf(val);
	    	return projectKeys[pos];
	    }
	  },
	  {
	    type: 'list',
	    name: 'issueType',
	    message: 'Issue type: ',
	    choices: issueTypeList
	  },
	  {
	  	type: 'input',
	  	name: 'issueName',
	  	message: 'Please provide the issue name :',
	  	default: 'New Issue'
	  }

	];

	inquirer.prompt(questions).then(function (answers) {

		var newIssue = {
			"fields": {
				"project": { 
				  "key": answers.project
				},
				"summary": answers.issueName,
				"issuetype": {
				  "name": answers.issueType
				}
			}
		};

		// Create newissue
		jira.addNewIssue(newIssue)
		  .then(function(issue) {
		    console.log('Issue created succesfully!');
		    console.log(config.protocol + '://' + config.host + '/browse/' + issue.key);
		  })
		  .catch(function(err) {
		    console.error(err);
		  });
	});
};

// Remove config file
function removeConfigFile(){
	fs.unlinkSync(configFilePath);
  console.log('Config file succesfully deleted');

  process.exit();
};

module.exports = {
	createIssue: function(arg){
		arg = arg || false;

		if (arg){

		}else{
			loadProjects(function(){
				loadIssueTypes(function(){
					createIssue();
				});
			});
		}
	},

	config: function(env, options){
		console.log(env);

		if (typeof env === 'undefined'){
			console.log('You should pass some option here.');
		}else{
			//console.log(options.remove);
			if (options.remove){
				removeConfigFile();
			}
		}
	}
};