// Local
import jira from './jira';

export default class JiraBoards {

  /**
  * Get all boards
  */
  async getBoards(){
    return jira.agileRequest('/board')
    .then(function( res ){

      let boards = [];
      const boardObj = res.values;

      for ( var index in boardObj ){
          boards.push({
            id: boardObj[index].id,
            name: boardObj[index].name
          });
        }

        return boards;
    })
    .catch(function( r ){
      jira.showErrors( r );
    });
  }

  /**
  * Get board by id
  */
  async getBoard( boardId ){
    return jira.agileRequest(`/board/${boardId}`)
    .then(function( res ){

      let board = res;

        return board;
    })
    .catch(function( r ){
      jira.showErrors( r );
    });
  }
}
