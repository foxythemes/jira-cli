// Native
import url from 'url';

// Packages
import JiraApi from 'jira-client';
import color from 'chalk';
import request from 'request-promise';

// Local
import Config from './config';
import Boards from './boards';
import Issues from './issues';
import Projects from './projects';
import Users from './users';
import Versions from './versions';
import pkg from "../package.json";

// Singleton instance
let instance = null;

class JiraCLI {

  constructor(){

    // Set the config file name
    this.configFileName = '.jira-cli.json';

    // Create instance of each module
    this.config = new Config;
    this.boards = new Boards;
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
      let options = r;
      if (r.proxy) {
        const proxiedRequest = request.defaults({ proxy: r.proxy });
        options = Object.assign({}, r, { request: proxiedRequest });
      }

      // Connect  to Jira
      _self.api = new JiraApi( options );
    });
  }

  /**
  * Create agile URI
  */
  makeAgileUri({ pathname, query }) {
      const uri = url.format({
        protocol: this.api.protocol,
        hostname: this.api.host,
        port: this.api.port,
        pathname: `${this.api.base}/rest/agile/1.0${pathname}`,
        query,
      });
      return decodeURIComponent(uri);
    }

  /**
  * Make an agile request
  */
  agileRequest( path, options = {} ) {
    return this.api.doRequest(this.api.makeRequestHeader(this.makeAgileUri({
      pathname: path,
    }), options ));
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

    if ( response.statusCode == '401' ) {
      console.log( color.red( '  Error trying to authenticate' ) );
    } else {

      if ( typeof response.error !== 'undefined' ) {
        let errors = response.error.errors;
        let messages = response.error.errorMessages;


          if ( messages && messages.length ) {
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
    if ( typeof cmd === 'undefined' ) {
      this.config.docs();
    } else {

      // Remove config file
      if ( cmd == 'remove' ){
        this.config.removeConfigFile();
      } else if ( cmd == 'host' || cmd == 'username' || cmd == 'password' || cmd == 'board' || cmd == 'proxy' || cmd == 'port'){

        const val = process.argv.slice(4)[0];

        this.config.updateConfigRecord( cmd, val, options );
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
        this.versions.createVersion( args, options );
      } else {
        this.versions.listVersions( args );
      }
    } else {
      console.log( pkg.version );
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
      } else if (options.comment) {
				// Add comment to issue
				this.issues.addComment(args, options.comment);
			} else {
        // If none of the above options is passed then search for specific issue
        this.issues.findIssue( args );
      }
    }
  }
}

export default new JiraCLI();
