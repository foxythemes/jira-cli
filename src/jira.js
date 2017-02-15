// Native
import path from 'path';
import fs from 'fs-promise';

// Packages
import JiraApi from 'jira-client';
import inquirer from 'inquirer';
import color from 'chalk';

// Local
import Config from './config';
import Issues from './issues';
import Projects from './projects';
import Users from './users';
import Versions from './versions';

// Singleton instance
let instance = null;

class JiraCLI {

	constructor(){

		// Set the config file name
		this.configFileName = '.jira-cl.json';

		// Create a new instance of configuration class
		this.config = new Config;
		this.issues = new Issues;
		this.projects = new Projects;
		this.users = new Users;
		this.versions = new Versions;

		// This is for cli-table defaults
		this.tableChars = { 'top': ' ' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
         , 'bottom': ' ' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
         , 'left': ' ' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
         , 'right': '' , 'right-mid': '' , 'middle': ' ' };

		if( !instance ){
      instance = this;
    }

    return instance;
	}

	/**
	* Initialize the config file
	*/
	init() {
		const _self = this;

		// Get the config file
		return this.config.init( this.configFileName ).then(function( r ){

			// Connect  to Jira
			_self.api = new JiraApi( r );
		});
	}

	/**
	* Make a jira API request
	*/
	apiRequest( path, options = {} ) {
		return this.api.doRequest(this.api.makeRequestHeader(this.api.makeUri({
			pathname: path,
		}), options ));
	}

	/**
	* Show errors from api response
	*/
	showErrors( response ){
  	console.log('');

		if ( typeof response.error !== 'undefined' ) {
			let errors = response.error.errors;
			let messages = response.error.errorMessages;
	  	

	  	if ( messages.length ) {
	  		for (var key in messages) {
				  console.log( color.red( '  Error: ' + messages[key] ) );
				}
	  	} else {
				for (var key in errors) {
				  console.log( color.red( '  Error: ' + errors[key] ) );
				}
	  	}
	  } else if ( typeof response.warningMessages !== 'undefined' ) {
	  	let warnings = response.warningMessages;

	  	warnings.forEach(( warning ) => {
	  		console.log( color.yellow(' Warning: ' + warning ) );
	  	});
		} else {
			console.log( '  ' + color.red( response ) );
		}

		console.log('');
	}

	/**
	* Show error in pretty format
	*/
	showError( msg ) {
		console.log('');
		console.log( color.red( '  ' + msg ) );
		console.log('');
	}

	/**
	* Config command handler
	*/
	cmdConfig( cmd, options ) {

		// If no command is provided show help
		if ( typeof cmd === 'undefined' ){
			this.config.docs();
		} else {

			// Remove config file
			if ( cmd == 'remove' ){
				this.config.removeConfigFile();
			}
		}
	}

	/**
	* Default command handler
	*/
	cmdDefault( cli ) {
		//cli.outputHelp();
	}

	/**
	* Create
	*/
	cmdCreate( cmd, options ) {
		this.issues.createIssueObj( options );
	}

	/**
	* Search
	*/
	cmdSearch( args ){
		this.issues.search( args );
	}

	/**
	* Open
	*/
	cmdOpen( args, options ) {

		if ( process.argv.slice(3).length ){
			this.issues.openIssue( args );
		}
	}

	/**
	* Projects
	*/
	cmdProject( cmd, options ) {

		if ( typeof cmd === 'undefined' ){
			this.projects.list();
		} else {
			// Commands go here
		}
	}

	/**
	* Users
	*/
	cmdUser( cmd, options ) {

		if ( typeof cmd === 'undefined' ){
			this.users.listUsers();
		} else {
			// Commands go here
		}
	}

	/**
	* Versions
	*/
	cmdVersion( args, options ) {

		if ( process.argv.slice(3).length ) {
			// If number option is passed create a new version
			if ( options.number ) {
				this.versions.createVersion( args, options.number );
			} else {
				this.versions.listVersions( args );
			}
		}
	}

	/**
	* Issues
	*/
	cmdIssue( args, options ) {

		// If no arguments(issues) are passed
		if ( !process.argv.slice(3).length || typeof args === 'undefined' ){

			// Get the release issues if --release option is passed
			if ( options.release ) {

				if ( options.project ) {
					this.issues.getReleaseIssues( options );
				} else {
					this.showError( 'You must specify a project (Use project option: -p <Project Key>)' );
				}

			} else if ( options.user ) {
				
				// Show user summary if user option is passed
				this.issues.summary( options.user );

			} else if ( options.project ) {

				// Show project issues
				this.issues.getProjectIssues( options.project );

			} else {

				// Show user open issues if no arguments/options are passed 
				this.issues.summary( false );
			}

		} else {

			if ( options.assign ) {
				// Assign issue to a user
				this.issues.assignIssue( args, options.assign );
			} else if ( options.transition ) {
				//Make issue transition
				this.issues.makeTransition( args, options.transition);
			} else {
				// If none of the above options is passed then search for specific issue
				this.issues.findIssue( args );
			}
		}
	}
}

export default new JiraCLI();