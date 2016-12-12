// Packages
import inquirer from 'inquirer';
import color from 'chalk';

// Local
import jira from './jira';

export default class JiraProjects {

	/**
	* Load jira projects
	*/
	async loadProjects() {
		return jira.api.listProjects()
		  .then(function(projectsObj) {
		  	let projects = [];

		  	for (var index in projectsObj){
		  		projects.push({
		  			key: projectsObj[index].key,
		  			name: projectsObj[index].name
		  		});
		  	}

		  	return projects;
		  })
		  .catch(function(err) {
		    console.error(err);
		  });
	}

	/**
	* List projects
	*/
	async list() {
		const projects = await this.loadProjects();

		projects.forEach(function ( project ) {
		  console.log( '  ' + color.blue( project.key ) + ' - ' + project.name );
		});
	}

	/**
	* Documentation
	*/
	docs() {
		console.log('');
		console.log('  Usage:  projects <command>');
		console.log('');
		console.log('');
		console.log('  Commands:');
		console.log('');
		console.log('    list 	List all projects');
		console.log('');
	}
}