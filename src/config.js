// Native
import path from 'path';
import fs from 'fs-promise';
import os from 'os';

// Packages
import inquirer from 'inquirer';
import color from 'chalk';

// Local
import jira from './jira';

// Local
export default class Config {

	/**
	* Init config file
	*/
	async init( fileName ) {
		this.filePath = path.join(os.homedir(), fileName);
		const filePath = this.filePath;

		// If file doesn't exist then create it
		if ( !fs.existsSync( filePath ) ) {
			this.defaults = await this.createConfigFile( filePath );

			// Exit when the file is created
			process.exit();
		} else {
			this.defaults = await this.loadConfigFile( filePath );
		}

		return this.defaults;
	}

	/**
	* Load config file
	*/

	async loadConfigFile( filePath ) {

	  return fs.readFile(filePath, {encoding:'utf8'}).then(function( config ){
	  	return JSON.parse( config );
	  });
	}

	/**
	* Create config file
	*/
	async createConfigFile( filePath ) {

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

		return inquirer.prompt(questions).then(function (answers) {

			const protocol = answers.protocol ? 'https' : 'http';

			const config = {
				protocol: protocol,
				host: answers.host,
				username: answers.username,
				password: answers.password,
				apiVersion: '2',
				strictSSL: true
			};

			return fs.writeFile(filePath, JSON.stringify(config), 'utf8')
				.then(function(){
					console.log('');
	   			console.log('Config file succesfully created in: ' + color.green(filePath) );
	   			console.log('');
	   			return config;
				});
		});
	}


	/**
	* Remove config file
	*/	
	removeConfigFile() {
		fs.unlinkSync( this.filePath );
		console.log('');
		console.log(color.red('Config file succesfully deleted!'));
		console.log('');
		process.exit();
	}

	/**
	* Update config file
	*/	
	updateConfigFile( ) {
		const filePath = this.filePath;

		fs.writeFile( filePath, JSON.stringify( this.defaults ), 'utf8' )
		.then(function(){
			console.log('');
			console.log( color.green( '  Config file succesfully updated.' ) );
			console.log('');
		})
		.catch(function(){
			jira.showError( 'Error updating config file.' );
		});
	}

	/**
	* Update config record
	*/	
	async updateConfigRecord( cmd, val, options ) {

		const _this = this;
		const boards = await jira.boards.getBoards();

		if ( cmd == 'username' ) {

			if ( typeof val === 'undefined' ) {
				console.log( '' );
				console.log( '  Current username: ' + color.blue.bold(this.defaults.username) );
				console.log( '' );
			} else {
				this.defaults.username = val;

				this.updateConfigFile();
			}
		} else if ( cmd == 'host' ) {
			if ( typeof val === 'undefined' ) {
				console.log( '' );
				console.log( '  Current host: ' + color.blue.bold(this.defaults.host) );
				console.log( '' );
			} else {
				this.defaults.host = val;

				this.updateConfigFile();
			}
		} else if ( cmd == 'password' ) {
			var questions = [
			  {
			  	type: 'password',
			  	name: 'password',
			  	message: 'Type your jira password:'
			  }
			];

			inquirer.prompt(questions).then(function( passwd ) {
				_this.defaults.password = passwd.password;
				_this.updateConfigFile();
			});
		} else if ( cmd == 'board' ) {
			if ( options.set ) {

				var question = [
				  	{
					   type: 'list',
					   name: 'board',
					   message: 'Board: ',
					   choices: boards,
					   filter: function( val ){
					   	return boards.find(function( obj ){
					    		return obj.name == val;
					    	});
					   }
				  	}
				];

				inquirer.prompt( question )
				.then(function( res ) {

					_this.defaults.defaultBoard = res.board.id;
					_this.updateConfigFile();
					
				});
			} else {
				if ( typeof this.defaults.defaultBoard === 'undefined' ) {
					console.log( '' );
					console.log( color.red( '  There is no default board set.' ) );
				} else {

					if ( options.remove ) {
						delete this.defaults.defaultBoard;
						this.updateConfigFile();
					} else {				
						const defaultBoard = await jira.boards.getBoard( this.defaults.defaultBoard );
						console.log( '' );
						console.log( '  Your default board is: ' + color.green.bold( defaultBoard.name ) );
					}
				}
			}
		}
	}

	/**
	* Documentation
	*/
	docs() {
		console.log('');
		console.log('  Usage:  config <command>');
		console.log('');
		console.log('');
		console.log('  Commands:');
		console.log('');
		console.log('    remove			Remove the config file');
		console.log('    switch=<config_name>	Switch to the named config');
		console.log('');
	}
}
