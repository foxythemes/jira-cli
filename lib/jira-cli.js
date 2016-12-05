#!/usr/bin/env node

/**
 * Module dependencies.
 */
 
var cli = require('commander');
var inquirer = require('inquirer');
var fs = require('fs');
var path = require('path');
var configFilePath = path.join(process.env.HOME, '.jira-cli.json');

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

	cli
	  .version('1.0.0')


	/**
	 * Create issue
	 */

	cli
	  .command('create [options]')
	  .description('Create a new issue')
	  .action(jira.createIssue);


	/**
	 * Show help if executes with no arguments
	 */

	if (!process.argv.slice(2).length) {
	    cli.outputHelp();
	}

	cli.parse(process.argv);
}