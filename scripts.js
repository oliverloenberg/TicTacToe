//You can hack the game by using player1.setPlayerMoves()....How can we avoid this?
//Display winner
//Display Score
//Add reset button
//Add player option to choose what type of marker they want to use;
//Add option for player to choose his name
//Add CPU who randomly places a marker

const game = (() => {
  //In order to figure out who won, we look through each object in the win condition board array and its win condition array to see if any has an array length of 3, which means the player has put 3 game pieces in the correct positions to enable a win
  const determineWinner = () => {
    const boardResult = gameBoard.getWinningBoard();
    console.log(boardResult);
    for (let i = 0; i < boardResult.length; i++) {
      const winArray = boardResult[i].winCondition;
      if (winArray.length == 3) {
        console.log(`The player won by filling out ${boardResult[i].win}`);
      }
    }
  };
  //As soon as the human player has made 3 moves, check if they have won
  const checkGameState = () => {
    if (player1.getPlayerMoves() == 3) {
      console.log("The player has made all their moves, did they win?");
      determineWinner();
    }
  };
  return { determineWinner, checkGameState };
})();

//Here we set up the board to have one event listener that captures which gamepiece has been clicked and can pass that on to the other modules that need to know to determine who won
const gameBoard = (() => {
  const board = [];
  const getBoard = () => board;
  const winningBoard = [
    { win: "row1", winCondition: [] },
    { win: "row2", winCondition: [] },
    { win: "row3", winCondition: [] },
    { win: "col1", winCondition: [] },
    { win: "col2", winCondition: [] },
    { win: "col3", winCondition: [] },
    { win: "diag1", winCondition: [] },
    { win: "diag2", winCondition: [] },
  ];
  const getWinningBoard = () => winningBoard;
  const revealBoard = () => {
    console.log(`Here is the board ${JSON.stringify(board)}`);
  };
  const populateBoard = () => {
    const gamePieces = document.querySelectorAll(".game-piece");
    //console.log(gamePieces);
    for (let i = 0; i < gamePieces.length; i++) {
      board.push({
        pos: gamePieces[i].getAttribute("id"),
        occupant: "Nobody",
      });
    }
  };
  populateBoard();

  const gameContainer = document.querySelector(".game-container");

  gameContainer.addEventListener("click", (event) => addPlayerChoice(event));

  function addPlayerChoice(event) {
    if (
      event.target.className == "game-piece" &&
      event.target.className != "taken" &&
      player1.getPlayerMoves() < 3
    ) {
      const gamePiecePos = event.target.getAttribute("id");
      const gamePiece = event.target;
      gamePiece.textContent = "X";
      player1.setPlayerMoves();
      //winningBoard[0].winCondition1.push(gamePiecePos);
      console.log(gamePiecePos);
      console.log("Ive been clicked!");
      console.log(`Player moves made: ${player1.getPlayerMoves()}`);

      //Add in the HTML that the clicked on game piece is now taken, and add to the boardgame array who occupies it
      for (let i = 0; i < board.length; i++) {
        if (gamePiecePos == board[i].pos) {
          gamePiece.classList.toggle("taken");
          board[i].occupant = player1.getName();
        }
      }

      //Add to the gameboard win condition array for each piece clicked on
      switch (gamePiecePos) {
        case "pos1":
          console.log(`Pos ${gamePiecePos} has been clicked!`);
          winningBoard[0].winCondition.push(gamePiecePos);
          winningBoard[3].winCondition.push(gamePiecePos);
          winningBoard[6].winCondition.push(gamePiecePos);
          break;

        case "pos2":
          winningBoard[0].winCondition.push(gamePiecePos);
          winningBoard[4].winCondition.push(gamePiecePos);
          break;

        case "pos3":
          winningBoard[0].winCondition.push(gamePiecePos);
          winningBoard[5].winCondition.push(gamePiecePos);
          winningBoard[7].winCondition.push(gamePiecePos);
          break;

        case "pos4":
          winningBoard[1].winCondition.push(gamePiecePos);
          winningBoard[3].winCondition.push(gamePiecePos);
          break;

        case "pos5":
          winningBoard[1].winCondition.push(gamePiecePos);
          winningBoard[4].winCondition.push(gamePiecePos);
          winningBoard[6].winCondition.push(gamePiecePos);
          winningBoard[7].winCondition.push(gamePiecePos);
          break;

        case "pos6":
          winningBoard[1].winCondition.push(gamePiecePos);
          winningBoard[5].winCondition.push(gamePiecePos);
          break;

        case "pos7":
          winningBoard[2].winCondition.push(gamePiecePos);
          winningBoard[3].winCondition.push(gamePiecePos);
          winningBoard[7].winCondition.push(gamePiecePos);
          break;

        case "pos8":
          winningBoard[2].winCondition.push(gamePiecePos);
          winningBoard[4].winCondition.push(gamePiecePos);
          break;

        case "pos9":
          winningBoard[2].winCondition.push(gamePiecePos);
          winningBoard[5].winCondition.push(gamePiecePos);
          winningBoard[6].winCondition.push(gamePiecePos);
          break;

        default:
          break;
      }
      game.checkGameState();
    }
  }

  return { getBoard, getWinningBoard, revealBoard };
})();

const Player = (name, pieceChoice) => {
  let score = 0;
  let playerMoves = 0;
  const displayScore = () => {
    console.log(`This is ${name}'s score: ${score}`);
  };
  const getPlayerMoves = () => playerMoves;
  const setPlayerMoves = () => playerMoves++;
  const getScore = () => score;
  const getName = () => name;

  const getPieceChoice = () => pieceChoice;

  return {
    displayScore,
    getScore,
    getPlayerMoves,
    setPlayerMoves,
    getName,
    getPieceChoice,
  };
};

const player1 = Player("Player1", "X");
const player2CPU = Player("Computer", "O");
