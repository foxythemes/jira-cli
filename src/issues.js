// Packages
import inquirer from 'inquirer';
import color from 'chalk';
import Table from 'cli-table3';
import moment from 'moment';
import opn from 'opn';

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
  * Get custom fields
  */
  getFields() {
    return jira.apiRequest('/field');
  }

  /**
  * Crate a new issue
  * Docs: https://docs.atlassian.com/jira/REST/cloud/#api/2/issue-createIssue
  */
  createIssue( newIssue ) {
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
  }

  /**
  * Crate a new issue object
  * Docs: https://docs.atlassian.com/jira/REST/cloud/#api/2/issue-createIssue
  */
  createIssueObj( options = {} ) {

    const _this = this;

    this.getMetaData().then(function( meta ){

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
          filter: function( val ){
            selectedProject = projects.indexOf( val );
            return keys[selectedProject];
          }
        }
      ];

      inquirer.prompt( project ).then(function( answers1 ){

        var projectIssueTypes = [];

        // Get issue types of the selected project
        for ( var i in issueTypes[selectedProject] ){
            projectIssueTypes.push({
              id: issueTypes[selectedProject][i].id,
              name: issueTypes[selectedProject][i].name,
              subtask: issueTypes[selectedProject][i].subtask
            });
          }

        var questions = [
          {
            type: 'list',
            name: 'issueType',
            message: 'Issue type: ',
            choices: projectIssueTypes,
            filter: function( val ){
              return projectIssueTypes.find(function( obj ){
                return obj.name == val;
              });
            }
          },
          {
            type: 'input',
            name: 'issueName',
            message: 'Please provide the issue name :',
            default: 'New Issue'
          }
        ];

        // Ask for the issue name and type
        inquirer.prompt( questions ).then(function( answers2 ){

          // Create the issue object
          var newIssue = {
            fields: {
              project: {
                key: answers1.project
              },
              summary: answers2.issueName,
              issuetype: {
                id: answers2.issueType.id
              }
            }
          };

            // Assign the issue to the current user if self option is passed
            if( typeof options.self !== 'undefined' ) {
              newIssue.fields.assignee = { name: jira.config.defaults.username };
            }

            if( answers2.issueType.subtask ){
              var question = [
                {
                  type: 'input',
                  name: 'issueParentName',
                  message: 'Please provide the parent issue key:'
                }
              ];

              inquirer.prompt( question ).then(function( answers3 ){
                newIssue.fields.parent = {
                  key: answers3.issueParentName
                };
                _this.createIssue( newIssue );
              });
            } else if( answers2.issueType.name == 'Epic' ) {
              // Get epic name custom field
              _this.getFields().then(function(data){
                let epicNameField = data.filter(function(val){
                  return val.custom && val.name == 'Epic Name';
                });

                var question = [
                  {
                    type: 'input',
                    name: 'epicName',
                    message: 'Epic name:'
                  }
                ];

                inquirer.prompt( question ).then(function( answers3 ){
                  newIssue.fields[epicNameField[0].id] = answers3.epicName;
                  _this.createIssue( newIssue );
                });
              });
            } else {
              _this.createIssue( newIssue );
            }
        }).catch((err) => {
          console.log(err);
          process.exit();
        });
      });
    });
  }

  /**
  * Search issues
  */
  search ( args ) {
    const _this = this;
    jira.api.searchJira( "summary ~ '" + args + "'" ).then(function( r ){
      if( r.total ){
        _this.showIssues( r.issues );
        console.log( color.bold( "  Total issues found: " + color.green( r.total ) ) );
        console.log('');
      } else {
        jira.showError( "No issues found with search terms: '" + args + "'" );
      }
    }).catch(function( res ){
      jira.showErrors( res );
      process.exit();
    });
  }

  /**
  * Open issue in default browser
  */
  openIssue( issue ) {
    const _this = this;
    let config = jira.config.defaults;
    let portUrlPart = config.port ? ':'+ config.port : '';

    jira.api.findIssue( issue ).then(function(){
      opn( config.protocol + '://' + config.host + portUrlPart + '/browse/' + issue, {wait: false});
    }).catch(function( res ){
      jira.showErrors( res );
      process.exit();
    });
  }

  /**
  * Show issues in a table format
  */
  showIssues( issues ) {
    const table = new Table({
      chars: jira.tableChars,
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
  * Show issue detail in pretty format
  */
  showIssue( issue ) {
    const table = new Table({ chars: jira.tableChars });
    const detailTable = new Table({ chars: jira.tableChars });
    let status;

    // Set status format
    switch( issue.fields.status.name ) {
      case 'Done':
        status = color.green( 'Done' );
      break;

      case 'In Progress':
        status = color.yellow( 'In Progress' );
      break;

      case 'To Do':
        status = color.blue( 'To Do' );
      break;

      default:
        status = issue.fields.status.name;
      break;
    }

    table.push(
        { 'Summary': issue.fields.summary.trim() }
      , { 'Status': status }
      , { 'Type': issue.fields.issuetype.name }
      , { 'Project': issue.fields.project.name + ' (' + issue.fields.project.key + ')' }
      , { 'Reporter': issue.fields.reporter.name });

    // If issue has assignee
    if( issue.fields.assignee != null ) {
      table.push( { 'Assignee': issue.fields.assignee.name } );
    }

    table.push(
      { 'Priority': issue.fields.priority.name }
    );

    // Start with detail table
    table.push(
        { '': '' }
      , { 'Id': issue.id }
      , { 'Created on': moment( issue.fields.created ).format('MMMM Do YYYY, h:mm:ss a') }
      , { 'Updated on': moment( issue.fields.updated ).format('MMMM Do YYYY, h:mm:ss a') }
    );

    // Fixes versions
    if ( issue.fields.fixVersions.length ) {
      let versions = [];
      issue.fields.fixVersions.forEach(function( version ){
        versions.push( version.name );
      });

      table.push( { 'Fix Versions:': versions.join( ', ' ) } );
    }

    // If issue has resolution
    if( issue.fields.resolution != null ) {
      table.push( { 'Resolution': issue.fields.resolution.name } );
    }

    console.log( table.toString() );
  }

  /**
  * Get default issues summary
  */
  summary( user ) {
    const _this = this;
    let jql;

    if ( user ) {
      jql = 'assignee = ' + user + ' and resolution = Unresolved';
    } else {
      jql = 'assignee = currentUser() and resolution = Unresolved';
    }

    jira.api.searchJira( jql ).then(function( r ){

      if ( typeof r.warningMessages !== 'undefined' ) {
        jira.showErrors( r );
      } else {
        if( r.total ){
          _this.showIssues( r.issues );
        }
      }
    }).catch(function( r ){
      jira.showErrors( r );
    });
  }

  /**
  * Get release issues
  */
  getReleaseIssues( options ) {
    const _this = this;
    jira.api.searchJira('project = ' + options.project + ' and fixVersion = ' + options.release ).then(function( r ){
      if( r.total ){
        _this.showIssues( r.issues );
      }
    }).catch(function( res ){
      jira.showErrors( res );
      process.exit();
    });
  }

  /**
  * Find specific issue
  */
  findIssue( issue ) {
    const _this = this;

    jira.api.findIssue( issue ).then(function( r ){
      _this.showIssue( r );
    }).catch(function( res ){
      jira.showErrors( res );
      process.exit();
    });
  }

  /**
  * Assign issue to user
  */
  assignIssue( issue, user ) {
    jira.apiRequest(`/issue/${issue}/assignee`,{
      method: 'PUT',
      followAllRedirects: true,
      body: {
        name: user
      }
    }).then(function(){
      console.log();
      console.log( color.green(`  Issue ${issue} successfully assigned to ${user}`) );
      console.log();
    }).catch(function( res ){
      jira.showErrors( res );
    });
  }

  /**
  * Get project issues
  */
  getProjectIssues( project ) {
    const _this = this;
    jira.api.searchJira( 'project = ' + project + ' and resolution = Unresolved').then(function( r ){
      if( r.total ){
        _this.showIssues( r.issues );
      }
    }).catch(function( res ){
      jira.showErrors( res );
      process.exit();
    });
  }

  /**
  * Get issue transitions
  */
  async getIssueTransitions( issueId ) {
    return jira.api.listTransitions( issueId )
      .then(function( res ) {
        let transitions = [];
        const transitionObj = res.transitions;

        for (var index in transitionObj){
          transitions.push({
            id: transitionObj[index].id,
            name: transitionObj[index].name,
            to: transitionObj[index].to.name
          });
        }

        return transitions;
      })
      .catch(function(err) {
          jira.showErrors(err);
      });
  }

  /**
  * API issue transition
  */
  transitionIssue( issueId, transitionObj ){

    return jira.api.transitionIssue( issueId, transitionObj )
    .then( function(res){
      console.log();
      console.log( '  Issue [' + issueId + '] moved to ' + color.green.bold(transitionObj.to) + '.' );
      console.log();
    })
    .catch( function (res){
      jira.showErrors(res);
    });
  }

  /**
  * Make issue transition
  */
  async makeTransition( issueId ){

    const transitions = await this.getIssueTransitions(issueId);
    const _this = this;

    if ( transitions.length == 1 ) {

      const obj = {
          transition: {
            id: transitions[0].id
          },
          to: transitions[0].to
        };

      return this.transitionIssue( issueId, obj );

    } else {

      var question = [
          {
           type: 'list',
           name: 'transition',
           message: 'Transitions: ',
           choices: transitions,
            filter: function(val){
              return transitions.find(function(obj){
                return obj.name == val;
              });
            }
          }
      ];

      inquirer.prompt(question).then(function( res ) {

        const obj = {
          transition: {
            id: res.transition.id
          },
          to: res.transition.to
        };

        return _this.transitionIssue( issueId, obj );
      });
    }
  }

  /**
  * Add comment to issue
  */
	addComment( issueId, comment ){
	return jira.api.addComment( issueId, comment ).then(function (res) {
				console.log(' Issue ' + issueId + ' successfully updated with comment:\n ' + comment);
			}).catch(function (err) {
				jira.showErrors(res);
			});

	}
}
