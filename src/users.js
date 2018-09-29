// Packages
import color from 'chalk';
import Table from 'cli-table3';

// Local
import jira from './jira';

export default class JiraUsers {

	/**
	* Load jira projects
	*/
	async getUsers() {
		return jira.apiRequest('/user/search?startAt=0&maxResults=1000&username=_');
	}

	/**
	* List projects
	*/
	async listUsers() {
		const users = await this.getUsers();

		const table = new Table({
			chars: jira.tableChars,
		  head: ['Username', 'Name']
		});

		users.forEach(function ( user ) {
		  table.push(
  			[ user.name, user.displayName ]
			);
		});

		console.log( table.toString() );
	}
}