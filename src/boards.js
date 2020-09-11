// Local
import jira from './jira';

export default class JiraBoards {
  /**
  * Get all boards
  */
  async getBoards() {
    return jira.agileRequest('/board')
      .then((res) => {
        const boards = [];
        const boardObj = res.values;

        for (const index in boardObj) {
          boards.push({
            id: boardObj[index].id,
            name: boardObj[index].name,
          });
        }

        return boards;
      })
      .catch((r) => {
        jira.showErrors(r);
      });
  }

  /**
  * Get board by id
  */
  async getBoard(boardId) {
    return jira.agileRequest(`/board/${boardId}`)
      .then((res) => {
        const board = res;

        return board;
      })
      .catch((r) => {
        jira.showErrors(r);
      });
  }
}
