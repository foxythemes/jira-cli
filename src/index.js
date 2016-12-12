#!/usr/bin/env node

// Packages
import cl from 'commander';

// Local
import jira from './jira';
 
// Initiaize the config file
jira.init().then(function(){

	cl
	  .version('1.0.0');


	/**
	 * Create issue
	 */

	cl
	  .command('create [options]')
	  .description('Create a new issue')
	  .option("-s, --self", "Assign the new issue to the current user")
	  .action((c, o) => {
	  	jira.cmdCreate(c, o);
	  });


	/**
	 * Configuration sub-command
	 */

	cl
	  .command('config [command]')
	  .description('Configuration file options')
	  .option("-h, --help", "")
	  .action((c, o) => {
	  	jira.cmdConfig(c, o);
	  });


	/**
	 * Project sub-command
	 */

	cl
	  .command('project [command]')
	  .description('Project commands')
	  .option("-h, --help", "")
	  .action((c, o) => {
	  	jira.cmdProject(c, o);
	  });


	/**
	 * Show help if executes with no arguments
	 */

	if (!process.argv.slice(2).length) {
	    cl.outputHelp();
	}

	cl.parse(process.argv);

});