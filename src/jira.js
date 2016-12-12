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
		let errors = response.error.errors;
  	
  	console.log('');

		for (var key in errors) {
		  console.log( color.red( 'Error: ' + errors[key] ) );
		}

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
	* Create command
	*/
	cmdCreate( cmd, options ) {
		this.issues.create();
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
}

export default new JiraCLI();