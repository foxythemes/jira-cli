// Packages
import color from 'chalk';
import Table from 'cli-table3';

// Local
import jira from './jira';

export default class JiraVersions {

  /**
  * Show versions
  */
  showVersions ( versions ) {

    if ( versions.length ) {
      const table = new Table({
        chars: jira.tableChars,
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

  /**
  * Create Versions
  */
  async createVersion ( project, { number, description, startDate, releaseDate } ) {

    let object = {
      name: number,
      project: project
    }

    if(description) {
      object['description'] = description;
    }

    if(startDate) {
      object['userStartDate'] = startDate;
    }

    if(releaseDate) {
      object['userReleaseDate'] = releaseDate;
    }

    return jira.api.createVersion( object )
    .then(function( res ){
      console.log('');
      console.log('New version (' + color.bold.green( number ) + ') in project ' + color.bold( project ) + ' was created.');
      console.log('');
    })
    .catch(function( res ){
      jira.showErrors( res );
    });
  }
}
