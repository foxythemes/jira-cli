// Packages
import inquirer from 'inquirer';
import color from 'chalk';
import Table from 'cli-table2';

// Local11
import jira from './jira';

export default class JiraVersions {

	/**
	* Show versions
	*/
	showVersions ( versions ) {

		if ( versions.length ) {
			const table = new Table({
				chars: { 'top': ' ' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
	         , 'bottom': ' ' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
	         , 'left': ' ' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
	         , 'right': '' , 'right-mid': '' , 'middle': ' ' },
			  head: ['Name', 'Status', 'Release Date']
			});

			versions.forEach(function( version ){
				const name = version.name;
				const released = version.released ? color.green( 'Released' ) : color.red( 'Unreleased' );
				const releaseDate = version.releaseDate ? version.releaseDate : '';

				table.push(
	  			[ name, released, releaseDate ]
				);
			});

			console.log( table.toString() );
		} else {
			jira.showError( 'There are no releases for this project' );
		}
	}

	/**
	* Get versions
	*/
	async getVersions( project ) {

		return jira.api.getVersions( project ).then(function( r ){
			return r;
		}).catch(function( res ){
			jira.showErrors( res );
			process.exit();
		});
	}

	/**
	* List versions
	*/
	async listVersions ( project ) {
		const versions = await this.getVersions( project );

		this.showVersions( versions );
	}
}