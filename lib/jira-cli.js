#!/usr/bin/env node

/**
 * Module dependencies.
 */

var cl = require('commander');
var inquirer = require('inquirer');
var fs = require('fs');
var path = require('path');
var configFilePath = path.join(process.env.HOME, '.jira-cl.json');

/**
 * Check if config file exists
 */
if ( !fs.existsSync(configFilePath) ) {

	var questions = [
	  {
	    type: ' input',
	    name: 'host',
	    message: 'Provide your jira host: ',
	    default: 'example.atlassian.net'
	  },
	  {
	  	type: 'input',
	  	name: 'username',
	  	message: 'Please provide your jira username :'
	  },
	  {
	  	type: 'password',
	  	name: 'password',
	  	message: 'Type your jira password:'
	  },
	  {
	    type: 'confirm',
	    name: 'protocol',
	    message: 'Enable HTTPS Protocol?'
	  }
	];

	inquirer.prompt(questions).then(function (answers) {

		var protocol = answers.protocol ? 'https' : 'http';

		var config = {
			protocol: protocol,
			host: answers.host,
			username: answers.username,
			password: answers.password,
			apiVersion: '2',
			strictSSL: true
		};

		fs.writeFileSync(configFilePath, JSON.stringify(config), 'utf8');
    console.log('Config file succesfully created in: ' + configFilePath);

    process.exit();
	});
}else{

	var jira = require('./jira.js');

	cl
	  .version('1.0.0');


	/**
	 * Create issue
	 */

	cl
	  .command('create [options]')
	  .description('Create a new issue')
	  .action(jira.createIssue);

	/**
	 * Remove config
	 */

	cl
	  .command('config [options]')
	  .description('Remove config file')
	  .option("-r, --remove", "Remove config file")
	  .action(jira.config);


	/**
	 * Show help if executes with no arguments
	 */

	if (!process.argv.slice(2).length) {
	    cl.outputHelp();
	}

	cl.parse(process.argv);
}