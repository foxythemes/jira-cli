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
	apiRequest( path ) {
		return this.api.doRequest(this.api.makeRequestHeader(this.api.makeUri({
			pathname: path,
		})));
	}

	/**
	* Show errors from api response
	*/
	showErrors( response ){
  	console.log('');

		if ( typeof response.eror !== 'undefined' ) {
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
		this.issues.create( options );
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
	* Versions
	*/
	cmdVersion( args, options ) {

		if ( process.argv.slice(3).length ){
			this.versions.listVersions( args );
		}
	}

	/**
	* Issues
	*/
	cmdIssue( args, options ) {

		if ( !process.argv.slice(3).length ){
			this.issues.summary();
		} else {

			// Get the release issues if options -rp are passed
			if ( options.release && options.project ) {
				this.issues.getReleaseIssues( options );
			} else if ( !options.project && options.release ) {
				this.showError( 'You must specify a project (Use project option: -p <Project Key>)' );
			} else {
				this.issues.findIssue( args );
			}
		}
	}
}

export default new JiraCLI();