// Packages
import inquirer from 'inquirer';
import color from 'chalk';
import Table from 'cli-table2';

// Local
import jira from './jira';

export default class JiraIssues {

	/**
	* Get required meta data to create issues 
	*/
	getMetaData() {
		return jira.apiRequest('/issue/createmeta');	
	}

	/**
	* Crate a new issue 
	* Docs: https://docs.atlassian.com/jira/REST/cloud/#api/2/issue-createIssue
	*/
	create( options ) {
		
		this.getMetaData().then(function(meta){

			var projects = []; 
			var keys = [];
			var issueTypes = [];
			var selectedProject;

			// Populate projects, keys and their respective issue types
			for ( var index in meta.projects ){
	  		projects.push(meta.projects[index].name);
	  		keys.push(meta.projects[index].key);
	  		issueTypes.push(meta.projects[index].issuetypes);
	  	}

	  	// Create the project question
			var project = [
			  {
			    type: 'list',
			    name: 'project',
			    message: 'Project: ',
			    choices: projects,
			    filter: function(val){
			    	selectedProject = projects.indexOf(val);
			    	return keys[selectedProject];
			    }
			  }
			];

			inquirer.prompt(project).then(function (answers1) {

				var projectIssueTypes = [];

				// Get issue types of the selected project
				for ( var i in issueTypes[selectedProject] ){
		  		projectIssueTypes.push(issueTypes[selectedProject][i].name);
		  	}

				var questions = [
				  {
				    type: 'list',
				    name: 'issueType',
				    message: 'Issue type: ',
				    choices: projectIssueTypes
				  },
				  {
				  	type: 'input',
				  	name: 'issueName',
				  	message: 'Please provide the issue name :',
				  	default: 'New Issue'
				  }
				];

				// Ask for the issue name and type
				inquirer.prompt(questions).then(function (answers2) {

					// Create the issue object
					var newIssue = {
						fields: {
							project: { 
							  key: answers1.project
							},
							summary: answers2.issueName,
							issuetype: {
							  name: answers2.issueType
							}
						}
					};
			    
			    // Assign the issue to the current user if self option is passed
			    if(  typeof options.self !== 'undefined' ) {
			    	newIssue.fields.assignee = { name: 'miguelmich' };
			    }

					// Create new issue
					jira.api.addNewIssue( newIssue )
					  .then(function( issue ) {

					  	let config = jira.config.defaults;

					  	console.log('');
					    console.log('New issue: ' + color.bold.red(issue.key));
					    console.log(config.protocol + '://' + config.host + '/browse/' + issue.key);
					    console.log('');
					  })
					  .catch(function( res ) {
					  	jira.showErrors( res );
					  });
				});
			});
		});
	}

	/**
	* Show issues in a table format
	*/
	showIssues( issues ) {
		const table = new Table({
			chars: { 'top': ' ' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
         , 'bottom': ' ' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
         , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
         , 'right': '' , 'right-mid': '' , 'middle': ' ' },
		  head: ['Key', 'Status', 'Summary']
		});

		issues.forEach(function( issue ){
			table.push(
  			[color.blue( issue.key ), color.green( issue.fields.status.name ), issue.fields.summary ]
			);
		});

		console.log( table.toString() );
	}

	/**
	* Get default issues summary
	*/
	summary() {
		const _this = this;

		jira.api.searchJira('assignee = currentUser() and resolution = Unresolved').then(function( r ){

			if( r.total ){
				_this.showIssues( r.issues );
			}
		});
	}

	/**
	* Get release issues
	*/
	getReleaseIssues( options ) {
		const _this = this;
		jira.api.searchJira('project = ' + options.project + ' and fixVersion = ' + options.version ).then(function( r ){
			if( r.total ){
				_this.showIssues( r.issues );
			}
		});
	}
}