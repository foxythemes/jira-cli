#!/usr/bin/env node

// Packages
import cl from 'commander';

// Local
import jira from './jira';

// Initiaize the config file
jira.init().then(function(){


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
   * Open in browser
   */

  cl
    .command('open [options]')
    .description('Open issues in browser')
    .alias('o')
    .action((c, o) => {
      jira.cmdOpen(c, o);
    });

  /**
   * Search Issues
   */

  cl
    .command('search [search terms]')
    .description('Search issues')
    .alias('s')
    .action((c, o) => {
      jira.cmdSearch(c, o);
    });


  /**
   * Configuration
   */

  cl
    .command('config [command]')
    .description('Configuration file options')
    .option("-h, --help", "")
    .option("-s, --set", "Set option")
    .option("-r, --remove", "Remove option")
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
    .option("-r, --release <version>", "Get the given release issues")
    .option("-p, --project <projectKey>", "Set the current project")
    .option("-u, --user <username>", "Set the user name")
    .option("-a, --assign <username>", "Assign issue to a user")
    .option("-t, --transition [transitionName]", "Make issue transition")
		.option("-c, --comment <comment>", "Add comment to issue")
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
   * Users
   */

  cl
    .command('user [command]')
    .description('User commands')
    .alias('u')
    .option("-h, --help", "")
    .action((c, o) => {
      jira.cmdUser(c, o);
    });


  /**
   * Versions
   */

  cl
    .command('version [command]')
    .description('Versions command')
    .alias('v')
    .option("-n, --number <version>", "Set the version number")
    .option("-d, --description <string>", "Set the description")
    .option("-s, --start-date <string>", "Set the start date")
    .option("-r, --release-date <string>", "Set the release date")
    // Get project versions
    .action((c, o) => {
      jira.cmdVersion(c, o);
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
