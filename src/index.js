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
	 * Configuration
	 */

	cl
	  .command('config [command]')
	  .description('Configuration file options')
	  .option("-h, --help", "")
	  .action((c, o) => {
	  	jira.cmdConfig(c, o);
	  });


	/**
	 * Issues
	 */

	cl
	  .command('issue [command]')
	  .description('Issue commands')
	  .alias('i')
	  .option("-h, --help", "")
	  .action((c, o) => {
	  	jira.cmdIssue(c, o);
	  });


	/**
	 * Projects
	 */

	cl
	  .command('project [command]')
	  .description('Project commands')
	  .alias('p')
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


	/**
	 * Execute default method if no registered command or no command is given
	 */	

	if ( process.argv.slice(2).length  ) {

		// Check if an argument is passed in position 1
		if ( typeof cl.args[1] !== 'undefined' ) {
			if( !cl.args[1].constructor.name == "Command" ) {
				jira.cmdDefault( cl );
			}
		}else{
			jira.cmdDefault( cl );
		}
	}

});