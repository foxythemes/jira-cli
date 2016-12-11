#!/usr/bin/env node

// Packages
import cl from 'commander';

// Local
import Config from './config';
import JiraCLI from './jira';

// Load the config file
const configFile = new Config;

// Initiaize the config file
configFile.init('.jira-cl.json').then(function(){

	// Create a new instance of JiraCLI
	const jira = new JiraCLI( configFile );

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
	 * Remove config file
	 */

	cl
	  .command('config [command]')
	  .description('Configuration file options')
	  .option("-h, --help", "")
	  .action(function(c, o){
	  	jira.cmdConfig(c, o);
	  });


	/**
	 * Show help if executes with no arguments
	 */

	if (!process.argv.slice(2).length) {
	    cl.outputHelp();
	}

	cl.parse(process.argv);

});