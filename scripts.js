//You can hack the game by using player1.setPlayerMoves()....How can we avoid this?
//Display winner - DONE
//Display Score - DONE
//Add reset button - DONE
//Add player option to choose what type of marker they want to use - DONE
//Add option for player to choose his name - DONE
//Add CPU who randomly places a marker
//Make sure CPU only places a marker on a free spot
//Make sure CPU only places a marker if the player clicked on a free spot
//Give CPU a point for winning a game
//Display CPU as winner if it wins

const game = (() => {
  //In order to figure out who won, we look through each object in the win condition board array and its win condition array to see if any has an array length of 3, which means the player has put 3 game pieces in the correct positions to enable a win
  const determineWinner = () => {
    const boardResult = gameBoard.getWinningBoard();
    const gamePieceElements = document.querySelectorAll(".game-piece");
    const gamePieceElementsArr = [...gamePieceElements];
    const areAllGamePiecesTaken = gamePieceElementsArr.every((gamePiece) => {
      return gamePiece.classList.contains("taken");
    });

    console.log(`gamePieceElementsArr: ${gamePieceElementsArr}`);
    console.log(`gamePieceElementsArr: ${areAllGamePiecesTaken}`);
    console.log(boardResult);
    for (let i = 0; i < boardResult.length; i++) {
      const winArrayP1 = boardResult[i].winConditionP1;
      const winArrayP2 = boardResult[i].winConditionP2;
      if (winArrayP1.length == 3) {
        console.log(
          `${player1.getName()} won by filling out ${boardResult[i].win}`
        );
        player1.setScore();
        player1.setWinner(true);
        gameBoard.displayWinner();
        gameBoard.updateScoreDisplay();
      } else if (winArrayP2.length == 3) {
        console.log(
          `${player2CPU.getName()} won by filling out ${boardResult[i].win}`
        );
        player2CPU.setScore();
        player2CPU.setWinner(true);
        gameBoard.displayWinner();
        gameBoard.updateScoreDisplay();
      }
    }

    if (
      areAllGamePiecesTaken == true &&
      player1.getWinner() == false &&
      player2CPU.getWinner() == false
    ) {
      //alert("Its a tie!");
      gameBoard.displayDraw();
    }
  };
  //As soon as the human player has made 3 moves, check if they have won
  const checkGameState = () => {
    if (player1.getPlayerMoves() > 2) {
      //console.log("The player has made all their moves, did they win?");
      determineWinner();
    }
  };

  const resetGame = () => {
    player1.setWinner(false);
    player1.setPlayerMoves(-player1.getPlayerMoves());
    player2CPU.setWinner(false);
    player2CPU.setPlayerMoves(-player2CPU.getPlayerMoves());
    gameBoard.activateClearBoard();
  };
  return { determineWinner, checkGameState, resetGame };
})();

//Here we set up the board to have one event listener that captures which gamepiece has been clicked and can pass that on to the other modules that need to know to determine who won
const gameBoard = (() => {
  let board = [];
  const getBoard = () => board;
  let winningBoard = [
    { win: "row1", winConditionP1: [], winConditionP2: [] },
    { win: "row2", winConditionP1: [], winConditionP2: [] },
    { win: "row3", winConditionP1: [], winConditionP2: [] },
    { win: "col1", winConditionP1: [], winConditionP2: [] },
    { win: "col2", winConditionP1: [], winConditionP2: [] },
    { win: "col3", winConditionP1: [], winConditionP2: [] },
    { win: "diag1", winConditionP1: [], winConditionP2: [] },
    { win: "diag2", winConditionP1: [], winConditionP2: [] },
  ];
  const getWinningBoard = () => winningBoard;
  const activateClearBoard = () => clearBoard();
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

  gameContainer.addEventListener("click", (event) => addGamePieces(event));

  function addGamePieces(event) {
    if (
      event.target.className == "game-piece" &&
      event.target.className != "taken" &&
      player1.getWinner() != true &&
      player2CPU.getWinner() != true
    ) {
      const gamePiecePos = event.target.getAttribute("id");
      const gamePiece = event.target;
      gamePiece.textContent = player1.getGamePiece();
      player1.setPlayerMoves(1);
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
          winningBoard[0].winConditionP1.push(gamePiecePos);
          winningBoard[3].winConditionP1.push(gamePiecePos);
          winningBoard[6].winConditionP1.push(gamePiecePos);
          break;

        case "pos2":
          winningBoard[0].winConditionP1.push(gamePiecePos);
          winningBoard[4].winConditionP1.push(gamePiecePos);
          break;

        case "pos3":
          winningBoard[0].winConditionP1.push(gamePiecePos);
          winningBoard[5].winConditionP1.push(gamePiecePos);
          winningBoard[7].winConditionP1.push(gamePiecePos);
          break;

        case "pos4":
          winningBoard[1].winConditionP1.push(gamePiecePos);
          winningBoard[3].winConditionP1.push(gamePiecePos);
          break;

        case "pos5":
          winningBoard[1].winConditionP1.push(gamePiecePos);
          winningBoard[4].winConditionP1.push(gamePiecePos);
          winningBoard[6].winConditionP1.push(gamePiecePos);
          winningBoard[7].winConditionP1.push(gamePiecePos);
          break;

        case "pos6":
          winningBoard[1].winConditionP1.push(gamePiecePos);
          winningBoard[5].winConditionP1.push(gamePiecePos);
          break;

        case "pos7":
          winningBoard[2].winConditionP1.push(gamePiecePos);
          winningBoard[3].winConditionP1.push(gamePiecePos);
          winningBoard[7].winConditionP1.push(gamePiecePos);
          break;

        case "pos8":
          winningBoard[2].winConditionP1.push(gamePiecePos);
          winningBoard[4].winConditionP1.push(gamePiecePos);
          break;

        case "pos9":
          winningBoard[2].winConditionP1.push(gamePiecePos);
          winningBoard[5].winConditionP1.push(gamePiecePos);
          winningBoard[6].winConditionP1.push(gamePiecePos);
          break;

        default:
          break;
      }
      addComputerChoice();
      game.checkGameState();
    }
  }

  function addComputerChoice() {
    const currentBoard = gameBoard.getBoard();
    const gamePieceElements = document.querySelectorAll(".game-piece");
    const gamePiecesArr = [...gamePieceElements];
    const freeSpaces = gamePiecesArr.filter(
      (piece) => piece.classList.contains("taken") == false
    );

    if (freeSpaces.length > 0) {
      const rndIndexNum = Math.floor(Math.random() * freeSpaces.length);
      const chosenGamePieceId = freeSpaces[rndIndexNum].getAttribute("id");
      const chosenGamePiece = freeSpaces[rndIndexNum];
      //chosenGamePiece.classList.add("taken");
      chosenGamePiece.textContent = player2CPU.getGamePiece();

      for (let i = 0; i < board.length; i++) {
        if (chosenGamePieceId == board[i].pos) {
          chosenGamePiece.classList.toggle("taken");
          board[i].occupant = player2CPU.getName();
        }
      }

      switch (chosenGamePieceId) {
        case "pos1":
          //console.log(`Pos ${gamePiecePos} has been clicked!`);
          winningBoard[0].winConditionP2.push(chosenGamePieceId);
          winningBoard[3].winConditionP2.push(chosenGamePieceId);
          winningBoard[6].winConditionP2.push(chosenGamePieceId);
          break;

        case "pos2":
          winningBoard[0].winConditionP2.push(chosenGamePieceId);
          winningBoard[4].winConditionP2.push(chosenGamePieceId);
          break;

        case "pos3":
          winningBoard[0].winConditionP2.push(chosenGamePieceId);
          winningBoard[5].winConditionP2.push(chosenGamePieceId);
          winningBoard[7].winConditionP2.push(chosenGamePieceId);
          break;

        case "pos4":
          winningBoard[1].winConditionP2.push(chosenGamePieceId);
          winningBoard[3].winConditionP2.push(chosenGamePieceId);
          break;

        case "pos5":
          winningBoard[1].winConditionP2.push(chosenGamePieceId);
          winningBoard[4].winConditionP2.push(chosenGamePieceId);
          winningBoard[6].winConditionP2.push(chosenGamePieceId);
          winningBoard[7].winConditionP2.push(chosenGamePieceId);
          break;

        case "pos6":
          winningBoard[1].winConditionP2.push(chosenGamePieceId);
          winningBoard[5].winConditionP2.push(chosenGamePieceId);
          break;

        case "pos7":
          winningBoard[2].winConditionP2.push(chosenGamePieceId);
          winningBoard[3].winConditionP2.push(chosenGamePieceId);
          winningBoard[7].winConditionP2.push(chosenGamePieceId);
          break;

        case "pos8":
          winningBoard[2].winConditionP2.push(chosenGamePieceId);
          winningBoard[4].winConditionP2.push(chosenGamePieceId);
          break;

        case "pos9":
          winningBoard[2].winConditionP2.push(chosenGamePieceId);
          winningBoard[5].winConditionP2.push(chosenGamePieceId);
          winningBoard[6].winConditionP2.push(chosenGamePieceId);
          break;

        default:
          break;
      }
      console.log(`Game pieces elements: ${gamePiecesArr}`);
      console.log(`Current free space game pieces: ${freeSpaces}`);
      console.log(`Freespaces array length: ${freeSpaces.length}`);
      console.log(`Rnd index nr to use: ${rndIndexNum}`);
      console.log(`Chosen gamepiece: ${chosenGamePieceId}`);
    }
  }

  function clearBoard() {
    board = [];
    populateBoard();
    for (let i = 0; i < winningBoard.length; i++) {
      winningBoard[i].winConditionP1 = [];
      winningBoard[i].winConditionP2 = [];
    }
    const gamePieces = document.querySelectorAll(".game-piece");
    //console.log(gamePieces);
    for (let i = 0; i < gamePieces.length; i++) {
      if (gamePieces[i].classList.contains("taken")) {
        //console.log(`${gamePieces[i]} has taken!`);
        gamePieces[i].classList.toggle("taken");
        gamePieces[i].textContent = "";
      }
    }

    const showWinner = document.getElementById("show-winner");
    showWinner.style.opacity = 0;

    console.log("Board has been cleard");
  }

  const displayWinner = () => {
    const showWinner = document.getElementById("show-winner");
    //const insertWinner = document.getElementById("insert-winner");
    if (player1.getWinner() == true) {
      showWinner.style.opacity = 1;
      showWinner.textContent = `${player1.getName()} WINS!`;
    } else {
      showWinner.style.opacity = 1;
      showWinner.textContent = `${player2CPU.getName()} WINS!`;
    }
  };

  const displayDraw = () => {
    const showWinner = document.getElementById("show-winner");
    showWinner.style.opacity = 1;
    //insertWinner.textContent = "Its a";
    showWinner.textContent = "Its a DRAW!";
  };

  const updateScoreDisplay = () => {
    const player1Score = document.getElementById("player1-score");
    player1Score.textContent = player1.getScore();
    const player2Score = document.getElementById("player2-score");
    player2Score.textContent = player2CPU.getScore();
  };

  return {
    getBoard,
    getWinningBoard,
    revealBoard,
    activateClearBoard,
    displayWinner,
    displayDraw,
    updateScoreDisplay,
  };
})();

const Player = (name, pieceChoice) => {
  let playerName = name;
  let score = 0;
  let winner = false;
  let playerMoves = 0;
  let playerGamePiece = pieceChoice;
  const displayScore = () => {
    console.log(`This is ${name}'s score: ${score}`);
  };

  const getScore = () => score;
  const setScore = () => score++;
  const getWinner = () => winner;
  const setWinner = (bool) => (winner = bool);
  const getPlayerMoves = () => playerMoves;
  const setPlayerMoves = (val) => (playerMoves += val);
  const getGamePiece = () => playerGamePiece;
  const setGamePiece = (piece) => (playerGamePiece = piece);
  const getName = () => playerName;
  const setName = (name) => (playerName = name);

  return {
    displayScore,
    getScore,
    setScore,
    getWinner,
    setWinner,
    getPlayerMoves,
    setPlayerMoves,
    getName,
    setName,
    getGamePiece,
    setGamePiece,
  };
};

const player1 = Player("Player1", "X");
const player2CPU = Player("Computer", "O");

//UI stuff

//Change name btn
const changeNameBtn = document.getElementById("change-name");
//console.log(changeNameBtn);
const player1Name = document.getElementById("player1-name");
//console.log(player1Name);

//Change name
changeNameBtn.addEventListener("click", () => {
  const newName = prompt("Please enter your name", "Enter here");
  player1Name.textContent = newName;
  player1.setName(newName);
});

//Reset game btn
const resetGameBtn = document.getElementById("reset-game");
//console.log(resetGameBtn);
resetGameBtn.addEventListener("click", game.resetGame);

//Choose your marker
const gamePieceChoiceCnt = document.getElementById("game-piece-choice");
console.log(gamePieceChoiceCnt);

gamePieceChoiceCnt.addEventListener("click", (event) => {
  if (event.target.id == "x-button") {
    console.log(`You clicked ${event.target.textContent}`);
    game.resetGame();
    player1.setGamePiece(event.target.textContent);
    player2CPU.setGamePiece("O");
    event.target.classList.add("clicked");
    const oBtn = document.getElementById("o-button");
    oBtn.classList.remove("clicked");
  } else if (event.target.id == "o-button") {
    console.log(`You clicked ${event.target.textContent}`);
    game.resetGame();
    player1.setGamePiece(event.target.textContent);
    player2CPU.setGamePiece("X");
    event.target.classList.add("clicked");
    const xBtn = document.getElementById("x-button");
    xBtn.classList.remove("clicked");
  }
});
